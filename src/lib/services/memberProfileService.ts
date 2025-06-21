import { MemberProfile } from "@/lib/models/MemberProfile";
import { Auth0User } from "@/lib/types/Auth0User";

export async function findOrCreateMemberProfile(auth0User: Auth0User) {
    const auth0Id = auth0User.sub;
  
    let profile = await MemberProfile.findOne({ auth0Id });
  
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
  