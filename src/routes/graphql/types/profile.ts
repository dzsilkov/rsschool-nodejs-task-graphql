import {UUIDType} from './uuid.js';
import {GraphQLBoolean, GraphQLInt, GraphQLObjectType} from 'graphql';
import {MemberType, MemberTypeEnumId} from './member-type.js';
import {Context} from '../models/context.js';
import {GraphQLInputObjectType} from 'graphql/index.js';
import {Profile} from '../models/models.js';

export const ProfileType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: {type: UUIDType},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
        memberType: {
            type: MemberType,
            resolve: ({memberTypeId}: Profile, _, context: Context) => context.memberTypeLoader.load(memberTypeId)
        },
        memberTypeId: {type: MemberTypeEnumId},
        userId: {type: UUIDType}
    }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
    name: 'CreateProfile',
    fields: () => ({
        userId: {type: UUIDType},
        memberTypeId: {type: MemberTypeEnumId},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
    })
});

export const ChangeProfileInput = new GraphQLInputObjectType({
    name: 'ChangeProfile',
    fields: () => ({
        memberTypeId: {type: MemberTypeEnumId},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
    })
});