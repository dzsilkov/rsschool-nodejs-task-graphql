import {UUIDType} from './uuid.js';
import {GraphQLBoolean, GraphQLInt, GraphQLObjectType} from 'graphql';
import {MemberType} from './member-type.js';
import {Context} from './context.js';

interface SourceId {
    memberTypeId: string;
}

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: {type: UUIDType},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
        memberType: {
            type: MemberType,
            resolve: (source: SourceId, _args, context: Context) =>
                context.prisma.memberType.findUnique({where: {id: source.memberTypeId}})
        }
    }),
});