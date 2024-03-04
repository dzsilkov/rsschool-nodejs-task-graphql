import {PostType} from '../../types/post.js';
import {GraphQLList, GraphQLNonNull} from 'graphql/index.js';
import {UUIDType} from '../../types/uuid.js';
import {Context} from '../../models/context.js';

export const postQuery = {
    posts: {
        type: new GraphQLList(PostType),
        resolve: async (_, _1, context: Context) => await context.prisma.post.findMany(),
    },
    post: {
        type: PostType,
        args: {
            id: {
                type: new GraphQLNonNull(UUIDType),
            },
        },
        resolve: async (_source, {id}: { id: string }, context: Context) =>
            await context.prisma.post.findUnique({where: {id}}),
    },
};