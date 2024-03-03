import {UUIDType} from './uuid.js';
import {GraphQLBoolean, GraphQLInt, GraphQLObjectType} from 'graphql';

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: {type: UUIDType},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
    }),
});