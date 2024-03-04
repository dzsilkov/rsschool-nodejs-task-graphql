import {FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox';
import {createGqlResponseSchema, gqlResponseSchema, gqlSchema} from './schemas.js';
import {graphql} from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
    const {prisma} = fastify;

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
            return await graphql({
                schema: gqlSchema,
                contextValue: {
                    prisma
                },
                source,
                variableValues,
            });
        },
    });
};

export default plugin;
