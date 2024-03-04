import {UUIDType} from './uuid.js';
import {GraphQLBoolean, GraphQLInt, GraphQLObjectType} from 'graphql';
import {MemberType, MemberTypeId} from './member-type.js';
import {Context} from '../models/context.js';
import {GraphQLInputObjectType} from 'graphql/index.js';
import {MemberTypeId as MemberTypeIdType} from '../../member-types/schemas.js';

interface SourceId {
    memberTypeId: MemberTypeIdType;
}

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: {type: UUIDType},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
        memberType: {
            type: MemberType,
            resolve: (source: SourceId, _args, context: Context) => context.memberTypeLoader.load(source.memberTypeId)
        }
    }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
    name: 'CreateProfile',
    fields: () => ({
        userId: {type: UUIDType},
        memberTypeId: {type: MemberTypeId},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
    })
});

export const ChangeProfileInput = new GraphQLInputObjectType({
    name: 'ChangeProfile',
    fields: () => ({
        memberTypeId: {type: MemberTypeId},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
    })
});