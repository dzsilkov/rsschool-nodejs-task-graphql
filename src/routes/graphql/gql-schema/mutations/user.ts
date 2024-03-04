import {ChangeUserInput, CreateUserInput, UserType} from '../../types/user.js';
import {GraphQLNonNull, GraphQLString} from 'graphql/index.js';
import {UUIDType} from '../../types/uuid.js';
import {ChangeUserDto, CreateUserDto, SubscribeDto} from '../../models/models.js';
import {Context} from '../../models/context.js';
import {GraphQLBoolean} from 'graphql';

export const userMutations = {
    createUser: {
        type: UserType,
        args: {
            dto: {
                type: new GraphQLNonNull(CreateUserInput)
            }
        },
        resolve: async (_, {dto}: { dto: CreateUserDto }, context: Context) =>
            await context.prisma.user.create({data: dto})
    },
    deleteUser: {
        type: GraphQLBoolean,
        args: {
            id: {
                type: new GraphQLNonNull(UUIDType)
            }
        },
        resolve: async (_, {id}: { id: string }, context: Context) => {
            await context.prisma.user.delete({where: {id}});
            return true;
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
        resolve: async (
            _,
            {id, dto}: { id: string, dto: ChangeUserDto },
            context: Context
        ) => await context.prisma.user.update({where: {id}, data: dto})
    },
    subscribeTo: {
        type: UserType,
        args: {
            userId: {type: new GraphQLNonNull(UUIDType)},
            authorId: {type: new GraphQLNonNull(UUIDType)}
        },
        resolve: async (_, {userId, authorId}: SubscribeDto, context: Context) => {
            context.userLoader.clear(userId);
            return await context.prisma.user.update({
                where: {id: userId},
                data: {
                    userSubscribedTo: {
                        create: {
                            authorId
                        }
                    }
                }
            });
        }

    },
    unsubscribeFrom: {
        type: GraphQLBoolean,
        args: {
            userId: {type: new GraphQLNonNull(UUIDType)},
            authorId: {type: new GraphQLNonNull(UUIDType)}
        },
        resolve: async (_source, {userId, authorId}: SubscribeDto, context: Context) => {
            context.userLoader.clear(userId);
            await context.prisma.subscribersOnAuthors.delete({
                where: {
                    subscriberId_authorId: {
                        subscriberId: userId,
                        authorId,
                    },
                },
            });
            return true;
        }
    },
};