import { MemberProfile } from "@/lib/models/MemberProfile";
import { Auth0User } from "@/types/Auth0User";
import { dbConnect } from "@/lib/mongoose";

export async function findOrCreateMemberProfile(auth0User: Auth0User) {
    await dbConnect();
    const auth0Id = auth0User.sub;
  
    let profile = await MemberProfile.findOne({ auth0Id });
  
    if (!profile && auth0User.email) {
      const pendingProfile = await MemberProfile.findOne({
        "personalInfo.email": auth0User.email,
        auth0Id: { $regex: /^pending:/ },
      });
  
      if (pendingProfile) {
        profile = await MemberProfile.findByIdAndUpdate(
          pendingProfile._id,
          { $set: { auth0Id } },
          { new: true }
        );
      }
    }
  
    if (!profile) {
      profile = await MemberProfile.create({
        auth0Id,
        displayFirstName: auth0User.given_name || auth0User.name?.split(" ")[0],
        displayLastName: auth0User.family_name || auth0User.name?.split(" ")[1],
        personalInfo: {
          email: auth0User.email,
        },
      });
    }
  
    return profile;
  }