import { User } from "../entity/User";

export const createUser = async ({
  username,
  githubId,
  pictureUrl,
  bio,
  name,
}: {
  username: string;
  githubId: string;
  pictureUrl: string;
  bio: string;
  name: string;
}) => {
  let user: User | undefined = undefined;
  let times: number = 0;
  let maybeUsername = username;

  while (times < 100) {
    try {
      user = await User.create({
        username: times ? `${maybeUsername}${times}` : username,
        githubId,
        pictureUrl,
        bio,
        name,
      }).save();

      break;
    } catch (error) {
      if (!error.detail.includes("already exists")) {
        throw error;
      }
    }

    times += 1;
  }

  return user;
};
