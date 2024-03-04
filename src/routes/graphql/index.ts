import {FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox';
import {createGqlResponseSchema, gqlResponseSchema} from './schemas.js';
import {graphql, parse, validate} from 'graphql';
import depthLimit from 'graphql-depth-limit';
import {gqlSchema} from './gql-schema/gql-schema.js';
import DataLoader from 'dataloader';
import {MemberType, Post, Profile, User} from './models/models.js';
import {
    loadMemberTypes,
    loadPosts,
    loadProfiles,
    loadUsers
} from './loaders/loaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
    const {prisma, httpErrors} = fastify;

    fastify.route({
        url: '/',
        method: 'POST',
        schema: {
            ...createGqlResponseSchema,
            response: {
                200: gqlResponseSchema,
            },
        },
        async handler(req) {
            const {body: {query: source, variables: variableValues}} = req;
            const parsedQuery = parse(source);
            const errors = validate(gqlSchema, parsedQuery, [depthLimit(5)]);

            if (errors.length) {
                return {data: null, errors};
            }

            const contextValue = {
                prisma,
                httpErrors,
                memberTypeLoader: new DataLoader<string, MemberType>(async (memberTypeIds) =>
                    loadMemberTypes([...memberTypeIds], prisma),
                ),
                userLoader: new DataLoader<string, User>(async (userIds) =>
                    loadUsers([...userIds], prisma),
                ),
                postLoader: new DataLoader<string, Post[]>(async (authorIds) =>
                    loadPosts([...authorIds], prisma),
                ),
                profileLoader: new DataLoader<string, Profile>(async (userIds) =>
                    loadProfiles([...userIds], prisma),
                ),
            };

            return await graphql({
                schema: gqlSchema,
                contextValue,
                source,
                variableValues,
            });
        },
    });
};

export default plugin;
