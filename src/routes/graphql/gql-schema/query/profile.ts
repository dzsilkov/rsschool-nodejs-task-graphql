import {ProfileType} from '../../types/profile.js';
import {GraphQLList, GraphQLNonNull} from 'graphql/index.js';
import {UUIDType} from '../../types/uuid.js';
import {Context} from '../../models/context.js';

export const profileQuery = {
    profiles: {
        type: new GraphQLList(ProfileType),
        resolve: async (_, _1, context: Context) => await context.prisma.profile.findMany(),
    },
    profile: {
        type: ProfileType,
        args: {
            id: {
                type: new GraphQLNonNull(UUIDType),
            },
        },
        resolve: async (_source, {id}: { id: string }, context: Context) =>
            await context.prisma.profile.findUnique({where: {id}}),
    },
};