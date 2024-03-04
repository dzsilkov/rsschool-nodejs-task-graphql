import {GraphQLInputObjectType, GraphQLObjectType, GraphQLString} from 'graphql/index.js';
import {UUIDType} from './uuid.js';

export const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: {type: UUIDType},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
    }),
});

export const CreatePostInput = new GraphQLInputObjectType({
    name: 'CreatePost',
    fields: () => ({
        authorId: {type: UUIDType},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
    })
});

export const ChangePostInput = new GraphQLInputObjectType({
    name: 'ChangePost',
    fields: () => ({
        title: {type: GraphQLString},
        content: {type: GraphQLString},
    })
});