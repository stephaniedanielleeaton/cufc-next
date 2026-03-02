/**
 * Migration script: members → memberprofiles
 *
 * - Drops and recreates the memberprofiles collection on every run (safe to rerun)
 * - Preserves the original members._id as the memberprofiles._id
 * - Migrates ALL members including duplicates (deduplication is handled manually via admin UI)
 * - Resolves auth0Id by matching email against the users collection; falls back to pending:<email>
 * - members collection is never modified
 *
 * Usage:
 *   node scripts/migrate-members-to-profiles.mjs
 */

import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const envPath = resolve(__dirname, "../.env.local");
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      process.env[key.trim()] = rest.join("=").trim();
    }
  } catch {
    console.warn("Could not load .env.local — falling back to process env.");
  }
}

loadEnv();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is not set.");
  process.exit(1);
}

function mapMemberToProfile(member, auth0Id) {
  const g = {
    firstName: member.guardian_first_name || undefined,
    lastName: member.guardian_last_name || undefined,
  };
  const hasGuardian = g.firstName || g.lastName;

  return {
    _id: member._id,
    auth0Id,
    displayFirstName: member.display_first_name,
    displayLastName: member.display_last_name,
    personalInfo: member.personal_info
      ? {
          legalFirstName: member.personal_info.legal_first_name,
          legalLastName: member.personal_info.legal_last_name,
          email: member.personal_info.email,
          phone: member.personal_info.phone,
          dateOfBirth: member.personal_info.date_of_birth,
          address: member.personal_info.address
            ? {
                street: member.personal_info.address.street,
                city: member.personal_info.address.city,
                state: member.personal_info.address.state,
                zip: member.personal_info.address.zip,
                country: member.personal_info.address.country,
              }
            : undefined,
        }
      : undefined,
    guardian: hasGuardian ? g : undefined,
    isWaiverOnFile: member.is_waiver_on_file ?? false,
    notes: member.notes || undefined,
    squareCustomerId: member.square_customer_id || undefined,
    memberStatus: "New",
    profileComplete: false,
    isPaymentWaived: false,
  };
}

async function migrate() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB.");

    const db = client.db();
    const membersCol = db.collection("members");
    const profilesCol = db.collection("memberprofiles");
    const usersCol = db.collection("users");

    // Drop and recreate memberprofiles so this script is safe to rerun
    await profilesCol.drop().catch(() => {});
    console.log("Dropped memberprofiles collection.\n");

    const members = await membersCol.find({}).toArray();
    console.log(`Found ${members.length} member(s) to migrate.\n`);

    let migrated = 0;

    for (const member of members) {
      const email = member.personal_info?.email;

      // Resolve auth0Id from users collection by email, or use pending placeholder
      const user = email ? await usersCol.findOne({ email }) : null;
      const auth0Id = user?.auth0Id ?? (email ? `pending:${email}` : `pending:id:${member._id}`);

      const profile = mapMemberToProfile(member, auth0Id);
      await profilesCol.insertOne(profile);

      if (auth0Id.startsWith("pending:")) {
        console.log(
          `MIGRATED (pending) [${member.display_first_name} ${member.display_last_name}] — id: ${member._id}`
        );
      } else {
        console.log(
          `MIGRATED [${member.display_first_name} ${member.display_last_name}] — id: ${member._id}`
        );
      }
      migrated++;
    }

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━
Migration complete
  Migrated:  ${migrated}
━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  } finally {
    await client.close();
  }
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
