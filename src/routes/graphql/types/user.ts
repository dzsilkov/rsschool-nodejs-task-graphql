import {UUIDType} from './uuid.js';
import {GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLObjectType, GraphQLString} from 'graphql';
import {ProfileType} from './profile.js';
import {PostType} from './post.js';
import {Context} from '../models/context.js';
import {User} from '../models/models.js';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: UUIDType},
        name: {type: GraphQLString},
        balance: {type: GraphQLFloat},
        profile: {
            type: ProfileType,
            resolve: ({id}: User, _args, context: Context) => context.profileLoader.load(id)
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: ({id}: User, _args, context: Context) => context.postLoader.load(id)
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve: ({subscribedToUser}: User, _args, context: Context) => {
                if (!subscribedToUser) {
                    return [];
                }
                const subscriberIds = subscribedToUser.map(({subscriberId}) => subscriberId);
                return context.userLoader.loadMany(subscriberIds);
            }
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve: ({userSubscribedTo}: User, _args, context: Context) => {
                if (!userSubscribedTo) {
                    return [];
                }
                const authorIds = userSubscribedTo.map(({authorId}) => authorId);
                return context.userLoader.loadMany(authorIds);
            }
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