import {ChangePostInput, CreatePostInput, PostType} from '../../types/post.js';
import {GraphQLNonNull} from 'graphql/index.js';
import {ChangePostDto, CreatePostDto} from '../../models/models.js';
import {Context} from '../../models/context.js';
import {UUIDType} from '../../types/uuid.js';
import {GraphQLBoolean} from 'graphql';

export const postMutations = {
    createPost: {
        type: PostType,
        args: {
            dto: {
                type: new GraphQLNonNull(CreatePostInput)
            }
        },
        resolve: async (_, {dto}: { dto: CreatePostDto }, context: Context) => {
            return await context.prisma.post.create({data: dto});
        }
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
        resolve: async (
            _,
            {id, dto}: { id: string, dto: ChangePostDto },
            context: Context
        ) => {
            return await context.prisma.post.update({where: {id}, data: dto});
        }

    },
    deletePost: {
        type: GraphQLBoolean,
        args: {
            id: {
                type: new GraphQLNonNull(UUIDType)
            }
        },
        resolve: async (_, {id}: { id: string }, context: Context) => {
            await context.prisma.post.delete({where: {id}});
            return true;
        }

    },
};