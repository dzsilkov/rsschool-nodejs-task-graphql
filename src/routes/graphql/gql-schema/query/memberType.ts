import {MemberType, MemberTypeEnumId} from '../../types/member-type.js';
import {GraphQLList, GraphQLNonNull} from 'graphql/index.js';
import {Context} from '../../models/context.js';

export const memberTypeQuery = {
    memberTypes: {
        type: new GraphQLList(MemberType),
        resolve: async (_, _1, context: Context) => await context.prisma.memberType.findMany(),
    },
    memberType: {
        type: MemberType,
        args: {
            id: {
                type: new GraphQLNonNull(MemberTypeEnumId),
            },
        },
        resolve: async (_source, {id}: { id: string }, context: Context) =>
            await context.prisma.memberType.findUnique({where: {id}}),
    },
};