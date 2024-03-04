import {UUIDType} from './uuid.js';
import {GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLObjectType, GraphQLString} from 'graphql';
import {ProfileType} from './profile.js';
import {PostType} from './post.js';
import {Context} from '../models/context.js';
import {User} from '../models/models.js';

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
            resolve: (source: User, _args, context: Context) => context.profileLoader.load(source.id)
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: (source: User, _args, context: Context) => context.postLoader.load(source.id)
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve: (source: User, _args, context: Context) => {
                if (!source.subscribedToUser) {
                    return [];
                }
                const subscriberIds = source.subscribedToUser.map(({subscriberId}) => subscriberId);
                return context.userLoader.loadMany(subscriberIds);
            }
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve: (source: User, _args, context: Context) => {
                if (!source.userSubscribedTo) {
                    return [];
                }
                const authorIds = source.userSubscribedTo.map(({authorId}) => authorId);
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