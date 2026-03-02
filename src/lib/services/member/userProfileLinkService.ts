import { UserProfileLink, ProfileRelationship, IUserProfileLink } from "@/lib/models/UserProfileLink";
import { MemberProfile, IMemberProfile } from "@/lib/models/MemberProfile";
import { mapMemberDocToDTO } from "./memberProfileService";
import type { MemberProfileDTO } from "@/types/MemberProfile";
import type { HydratedDocument } from "mongoose";

export async function getLinkedProfilesForUser(auth0Id: string): Promise<MemberProfileDTO[]> {
  const links = await UserProfileLink.find({ auth0Id })
    .sort({ isPrimary: -1 })
    .lean<IUserProfileLink[]>();

  if (links.length === 0) return [];

  const profileIds = links.map((l) => l.profileId);
  const profiles = await MemberProfile.find({ _id: { $in: profileIds } });

  const profileMap = new Map(profiles.map((p) => [p._id.toString(), p]));

  return links
    .map((l) => {
      const doc = profileMap.get(l.profileId.toString());
      return doc ? mapMemberDocToDTO(doc as HydratedDocument<IMemberProfile>) : null;
    })
    .filter((p): p is MemberProfileDTO => p !== null);
}

export async function getPrimaryProfileForUser(auth0Id: string): Promise<MemberProfileDTO | null> {
  const link = await UserProfileLink.findOne({ auth0Id, isPrimary: true }).lean<IUserProfileLink>();
  if (!link) return null;

  const doc = await MemberProfile.findById(link.profileId);
  if (!doc) return null;

  return mapMemberDocToDTO(doc as HydratedDocument<IMemberProfile>);
}

export async function createManagedProfile(
  auth0Id: string,
  relationship: ProfileRelationship,
  initialData?: { displayFirstName?: string; displayLastName?: string; personalInfo?: { email?: string } }
): Promise<MemberProfileDTO> {
  const hasLinks = await UserProfileLink.countDocuments({ auth0Id });
  const isPrimary = hasLinks === 0;

  let guardian: { firstName?: string; lastName?: string } | undefined;
  if (relationship === "guardian") {
    const selfLink = await UserProfileLink.findOne({ auth0Id, relationship: "self" }).lean<IUserProfileLink>();
    if (selfLink) {
      const selfProfile = await MemberProfile.findById(selfLink.profileId).lean<IMemberProfile>();
      if (selfProfile) {
        guardian = {
          firstName: selfProfile.displayFirstName,
          lastName: selfProfile.displayLastName,
        };
      }
    }
  }

  const newProfile = await MemberProfile.create({ ...(initialData ?? {}), ...(guardian ? { guardian } : {}) });
  await UserProfileLink.create({
    auth0Id,
    profileId: newProfile._id,
    relationship,
    isPrimary,
  });
  return mapMemberDocToDTO(newProfile as HydratedDocument<IMemberProfile>);
}

