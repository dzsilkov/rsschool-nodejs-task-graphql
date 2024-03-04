import {GraphQLList, GraphQLNonNull} from 'graphql/index.js';
import {UserType} from '../../types/user.js';
import {Context} from '../../models/context.js';
import {parseResolveInfo} from 'graphql-parse-resolve-info';
import {PrismaQueryUsersIncludeArgs, User} from '../../models/models.js';
import {UUIDType} from '../../types/uuid.js';

export const userQuery = {
    users: {
        type: new GraphQLList(UserType),
        resolve: async (_, _1, context: Context, resolveInfo) => {

            const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
            const fields = parsedResolveInfoFragment?.fieldsByTypeName.User;
            const includeArgs: PrismaQueryUsersIncludeArgs = {};

            if (fields && 'userSubscribedTo' in fields) {
                includeArgs.userSubscribedTo = true;
            }

            if (fields && 'subscribedToUser' in fields) {
                includeArgs.subscribedToUser = true;
            }

            const users = await context.prisma.user.findMany({include: includeArgs});

            const idsToPrime = new Set<string>();
            const userMap = new Map<string, User>();
            users.forEach((user) => {
                userMap.set(user.id, user);
                if (includeArgs.userSubscribedTo) {
                    user.userSubscribedTo?.forEach(({authorId}) => {
                        idsToPrime.add(authorId);
                    });
                }

                if (includeArgs.subscribedToUser) {
                    user.subscribedToUser?.forEach(({subscriberId}) => {
                        idsToPrime.add(subscriberId);
                    });
                }
            });

            idsToPrime.forEach((id) => {
                const user = userMap.get(id);
                if (user) {
                    context.userLoader.prime(id, user);
                }
            });
            return users;
        },
    },
    user: {
        type: UserType,
        args: {
            id: {
                type: new GraphQLNonNull(UUIDType),
            },
        },
        resolve: async (_source, {id}: { id: string }, context) =>
            await context.userLoader.load(id),
    },
};