import {UUIDType} from './uuid.js';
import {GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLObjectType, GraphQLString} from 'graphql';
import {ProfileType} from './profile.js';
import {PostType} from './post.js';
import {Context} from '../models/context.js';

interface SourceId {
    id: string;
}

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: UUIDType},
        name: {type: GraphQLString},
        balance: {type: GraphQLFloat},
        profile: {
            type: ProfileType,
            resolve: (source: SourceId, _args, context: Context) => context.profileLoader.load(source.id)
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: (source: SourceId, _args, context: Context) => context.postLoader.load(source.id)
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve: (source: SourceId, _args, context: Context) => context.subscribersLoader.load(source.id)
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve: (source: SourceId, _args, context: Context) => context.subscriptionsLoader.load(source.id)
        }
    }),
});

export const CreateUserInput = new GraphQLInputObjectType({
    name: 'CreateUser',
    fields: () => ({
        name: {type: GraphQLString},
        balance: {type: GraphQLFloat}
    })
});

export const ChangeUserInput = new GraphQLInputObjectType({
    name: 'ChangeUser',
    fields: () => ({
        name: {type: GraphQLString},
        balance: {type: GraphQLFloat}
    })
});