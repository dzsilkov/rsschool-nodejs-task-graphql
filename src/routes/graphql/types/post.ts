import {GraphQLInputObjectType, GraphQLObjectType, GraphQLString} from 'graphql/index.js';
import {UUIDType} from './uuid.js';

export const PostType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: {type: UUIDType},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
        authorId: {type: UUIDType},
    }),
});

export const CreatePostInput = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: () => ({
        authorId: {type: UUIDType},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
    })
});

export const ChangePostInput = new GraphQLInputObjectType({
    name: 'ChangePostInput',
    fields: () => ({
        title: {type: GraphQLString},
        content: {type: GraphQLString},
    })
});