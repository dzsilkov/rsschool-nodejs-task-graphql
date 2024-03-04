import {Type} from '@fastify/type-provider-typebox';
import {GraphQLList, GraphQLObjectType, GraphQLSchema} from 'graphql';
import {MemberType, MemberTypeId} from './types/member-type.js';
import {ChangePostInput, CreatePostInput, PostType} from './types/post.js';
import {ChangeUserInput, CreateUserInput, UserType} from './types/user.js';
import {ChangeProfileInput, CreateProfileInput, ProfileType} from './types/profile.js';
import {GraphQLNonNull, GraphQLString} from 'graphql/index.js';
import {UUIDType} from './types/uuid.js';
import {MemberTypeId as MemberTypeIdType} from '../member-types/schemas.js';
import {Context} from './types/context.js';

export const gqlResponseSchema = Type.Partial(
    Type.Object({
        data: Type.Any(),
        errors: Type.Any(),
    }),
);

export const createGqlResponseSchema = {
    body: Type.Object(
        {
            query: Type.String(),
            variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
        },
        {
            additionalProperties: false,
        },
    ),
};

export const gqlSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: () => ({
            memberTypes: {
                type: new GraphQLList(MemberType),
                resolve: (_, _1, context: Context) => context.prisma.memberType.findMany(),
            },
            posts: {
                type: new GraphQLList(PostType),
                resolve: (_, _1, context: Context) => context.prisma.post.findMany(),
            },
            users: {
                type: new GraphQLList(UserType),
                resolve: (_, _1, context: Context) => context.prisma.user.findMany(),
            },
            profiles: {
                type: new GraphQLList(ProfileType),
                resolve: (_, _1, context: Context) => context.prisma.profile.findMany(),
            },
            memberType: {
                type: MemberType,
                args: {
                    id: {
                        type: new GraphQLNonNull(MemberTypeId),
                    },
                },
                resolve: (_source, {id}: { id: string }, context: Context) =>
                    context.prisma.memberType.findUnique({where: {id}}),
            },
            post: {
                type: PostType,
                args: {
                    id: {
                        type: new GraphQLNonNull(UUIDType),
                    },
                },
                resolve: (_source, {id}: { id: string }, context: Context) =>
                    context.prisma.post.findUnique({where: {id}}),
            },
            user: {
                type: UserType,
                args: {
                    id: {
                        type: new GraphQLNonNull(UUIDType),
                    },
                },
                resolve: (_source, {id}: { id: string }, context) =>
                    context.prisma.user.findUnique({
                        where: {id},
                    }),
            },
            profile: {
                type: ProfileType,
                args: {
                    id: {
                        type: new GraphQLNonNull(UUIDType),
                    },
                },
                resolve: (_source, {id}: { id: string }, context: Context) =>
                    context.prisma.profile.findUnique({where: {id}}),
            },
        }),
    }),
    mutation: new GraphQLObjectType({
        name: 'RootMutation',
        fields: () => ({
            createUser: {
                type: UserType,
                args: {dto: {type: new GraphQLNonNull(CreateUserInput)}},
                resolve: (_source, _args: { dto: { name: string, balance: number } }, context: Context) =>
                    context.prisma.user.create({data: _args.dto})
            },
            createPost: {
                type: PostType,
                args: {dto: {type: new GraphQLNonNull(CreatePostInput)}},
                resolve: (_source, _args: { dto: { authorId: string, title: string, content: string } }, context: Context) =>
                    context.prisma.post.create({data: _args.dto})
            },
            createProfile: {
                type: ProfileType,
                args: {dto: {type: new GraphQLNonNull(CreateProfileInput)}},
                resolve: (_source, _args: { dto: { userId: string, memberTypeId: MemberTypeIdType, isMale: boolean, yearOfBirth: number } }, context: Context) =>
                    context.prisma.profile.create({data: _args.dto})
            },
            deleteUser: {
                type: GraphQLString,
                args: {id: {type: new GraphQLNonNull(UUIDType)}},
                resolve: async (_source, _args: { id: string }, context: Context) => {
                    await context.prisma.user.delete({where: {id: _args.id}});
                    return null;
                }

            },
            deletePost: {
                type: GraphQLString,
                args: {id: {type: new GraphQLNonNull(UUIDType)}},
                resolve: async (_source, _args: { id: string }, context: Context) => {
                    await context.prisma.post.delete({where: {id: _args.id}});
                    return null;
                }

            },
            deleteProfile: {
                type: GraphQLString,
                args: {id: {type: new GraphQLNonNull(UUIDType)}},
                resolve: async (_source, _args: { id: string }, context: Context) => {
                    await context.prisma.profile.delete({where: {id: _args.id}});
                    return null;
                }

            },
            changeUser: {
                type: UserType,
                args: {
                    id: {
                        type: new GraphQLNonNull(UUIDType),
                    },
                    dto: {
                        type: new GraphQLNonNull(ChangeUserInput)
                    }
                },
                resolve: (
                    _source,
                    _args: { id: string, dto: { name: string, balance: number } },
                    context: Context
                ) => context.prisma.user.update({where: {id: _args.id}, data: _args.dto})
            },
            changePost: {
                type: PostType,
                args: {
                    id: {
                        type: new GraphQLNonNull(UUIDType),
                    },
                    dto: {
                        type: new GraphQLNonNull(ChangePostInput)
                    }
                },
                resolve: (
                    _source,
                    _args: { id: string, dto: { title: string, content: string } },
                    context: Context
                ) => context.prisma.post.update({where: {id: _args.id}, data: _args.dto})

            },
            changeProfile: {
                type: ProfileType,
                args: {
                    id: {
                        type: new GraphQLNonNull(UUIDType),
                    },
                    dto: {
                        type: new GraphQLNonNull(ChangeProfileInput)
                    }
                },
                resolve: (
                    _source,
                    _args: { id: string, dto: { isMale: boolean, yearOfBirth: number, memberTypeId: MemberTypeIdType } },
                    context: Context
                ) => context.prisma.profile.update({where: {id: _args.id}, data: _args.dto})
            },
            subscribeTo: {
                type: UserType,
                args: {
                    userId: {type: new GraphQLNonNull(UUIDType)},
                    authorId: {type: new GraphQLNonNull(UUIDType)}
                },
                resolve: (_source, _args: { userId: string, authorId: string }, context: Context) =>
                    context.prisma.user.update({
                        where: {id: _args.userId},
                        data: {userSubscribedTo: {create: {authorId: _args.authorId}}}
                    })
            },
            unsubscribeFrom: {
                type: GraphQLString,
                args: {
                    userId: {type: new GraphQLNonNull(UUIDType)},
                    authorId: {type: new GraphQLNonNull(UUIDType)}
                },
                resolve: async (_source, _args: { userId: string, authorId: string }, context: Context) => {
                    await context.prisma.subscribersOnAuthors.delete({
                        where: {
                            subscriberId_authorId: {
                                subscriberId: _args.userId,
                                authorId: _args.authorId,
                            },
                        },
                    });
                    return null;
                }
            }
        }),
    })
});
