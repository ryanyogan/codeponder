import { Resolver, Query, Ctx } from "type-graphql";
import { User } from "../../entity/User";
import { PonderContext } from "../../types/Context";

@Resolver(User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: PonderContext) {
    const { userId } = ctx.req.session!;

    return userId ? User.findOne(userId) : null;
  }
}
