import { ResolverMap } from "../../../types/graphql-utils";
import { removeAllUserSessions } from "../../../utils/removeAllUserSessions";

export const resolvers: ResolverMap = {
    Mutation: {
        logout: async (_, __, { req: { session }, redis }) => {
            const { userId } = session;
            if (!userId) return;

            await removeAllUserSessions(userId, redis);
            return true;
        }
    }
};
