import {UUIDType} from './uuid.js';
import {GraphQLBoolean, GraphQLInt, GraphQLObjectType} from 'graphql';
import {MemberType} from './member-type.js';

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: {type: UUIDType},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
        memberType: {type: MemberType}
    }),
});