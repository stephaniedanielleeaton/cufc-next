import { MemberProfile } from "@/lib/models/MemberProfile";
import mongoose from "mongoose";

async function getMembers() {
  // Ensure mongoose is connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
  return MemberProfile.find({}).lean();
}

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Member Dashboard</h1>
      <div className="flex flex-col gap-3">
        {members.map((member: any) => {
          const name = [member.displayFirstName, member.displayLastName].filter(Boolean).join(" ") || <span className="text-gray-400 italic">N/A</span>;
          return (
            <div
              key={member._id}
              className="bg-white rounded-lg shadow border border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              <div className="flex-1">
                <div className="font-semibold text-lg text-navy truncate">{name}</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {/* Profile Complete Badge */}
                  {member.profileComplete ? (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Profile Complete</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">Profile Incomplete</span>
                  )}
                  {/* Waiver Badge */}
                  {member.isWaiverOnFile ? (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Waiver Signed</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">No Waiver</span>
                  )}
                  {/* Last Check-In */}
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    Last Check-In: {member.lastAttendanceCheckIn ? new Date(member.lastAttendanceCheckIn).toLocaleDateString() : <span className="text-gray-400 italic">Never</span>}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


