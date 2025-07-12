import MemberCard from "./MemberCard";
import { MemberProfile } from "@/lib/models/MemberProfile";

export default async function MembersPage() {
  // Fetch all members from the database
  const members = await MemberProfile.find({}).lean();

  return (
    <div className="space-y-4">
      {members.map((member: any) => (
        <MemberCard key={member._id} member={member} />
      ))}
    </div>
  );
}
