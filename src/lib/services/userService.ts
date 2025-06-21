import { User, IUser } from "@/lib/models/User"
import { dbConnect } from "@/lib/mongoose"

export async function findOrCreateUser(auth0User: Auth0User): Promise<IUser> {
  await dbConnect();

  const auth0Id = auth0User.sub;

  let user = await User.findOne({ auth0Id });

  if (!user) {
    user = await User.create({
      auth0Id,
      name: auth0User.name || "",
      email: auth0User.email || "",
      role: "member",
    });
  }

  return user;
}

interface Auth0User {
  sub: string;
  name?: string;
  email?: string;
}
