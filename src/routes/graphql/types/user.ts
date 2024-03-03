import {UUIDType} from './uuid.js';
import {GraphQLFloat, GraphQLObjectType, GraphQLString} from 'graphql';

export const PostType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: UUIDType},
        name: {type: GraphQLString},
        balance: {type: GraphQLFloat},
    }),
});