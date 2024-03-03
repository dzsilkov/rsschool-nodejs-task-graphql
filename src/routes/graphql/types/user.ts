import {UUIDType} from './uuid.js';
import {GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString} from 'graphql';
import {ProfileType} from './profile.js';
import {PostType} from './post.js';

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: UUIDType},
        name: {type: GraphQLString},
        balance: {type: GraphQLFloat},
        profile: {type: ProfileType},
        posts: {type: new GraphQLList(PostType)},
    }),
});