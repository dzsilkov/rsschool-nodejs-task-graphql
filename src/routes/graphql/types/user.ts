import {UUIDType} from './uuid.js';
import {GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLObjectType, GraphQLString} from 'graphql';
import {ProfileType} from './profile.js';
import {ChangePostInput, PostType} from './post.js';
import {Context} from './context.js';

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
            resolve: (source: SourceId, _args, context: Context) =>
                context.prisma.profile.findUnique({where: {userId: source.id}})
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: (source: SourceId, _args, context: Context) =>
                context.prisma.post.findMany({where: {authorId: source.id}})
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve: (source: SourceId, _args, context: Context) =>
                context.prisma.user.findMany({
                    where: {
                        userSubscribedTo: {some: {authorId: source.id}}
                    }
                })
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve: (source: SourceId, _args, context: Context) =>
                context.prisma.user.findMany({
                    where: {
                        subscribedToUser: {some: {subscriberId: source.id}}
                    }
                })
        }
    }),
});

export const CreateUserInput = new GraphQLInputObjectType({
    name: 'CreateUser',
    fields: () => ({
        name: {type: UUIDType},
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