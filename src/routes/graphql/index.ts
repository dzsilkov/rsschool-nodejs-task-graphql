import {FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox';
import {createGqlResponseSchema, gqlResponseSchema} from './schemas.js';
import {graphql, GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLNonNull} from 'graphql';
import {UUIDType} from './types/uuid.js';
import {MemberType, MemberTypeId} from './types/member-type.js';
import {PostType} from './types/post.js';
import {ProfileType} from './types/profile.js';
import {UserType} from './types/user.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
    const {prisma} = fastify;

    const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'RootQuery',
            fields: {
                memberTypes: {
                    type: new GraphQLList(MemberType),
                    resolve() {
                        return prisma.memberType.findMany();
                    },
                },
                posts: {
                    type: new GraphQLList(PostType),
                    resolve() {
                        return prisma.post.findMany();
                    },
                },
                users: {
                    type: new GraphQLList(UserType),
                    resolve: () => {
                        return prisma.user.findMany();
                    },
                },
                profiles: {
                    type: new GraphQLList(ProfileType),
                    resolve: () => {
                        return prisma.profile.findMany();
                    },
                },
                memberType: {
                    type: MemberType,
                    args: {
                        id: {
                            type: new GraphQLNonNull(MemberTypeId),
                        },
                    },
                    resolve: (_source, {id}: { id: string }) => {
                        return prisma.memberType.findUnique({where: {id}});
                    },
                },
                post: {
                    type: PostType,
                    args: {
                        id: {
                            type: new GraphQLNonNull(UUIDType),
                        },
                    },
                    resolve: (_source, {id}: { id: string }) => {
                        return prisma.post.findUnique({where: {id}});
                    },
                },
                user: {
                    type: UserType,
                    args: {
                        id: {
                            type: new GraphQLNonNull(UUIDType),
                        },
                    },
                    resolve: (_source, {id}: { id: string }) => {
                        return prisma.user.findUnique({
                            where: {id},
                            include: {
                                profile: {
                                    include: {
                                        memberType: true
                                    }
                                },
                                posts: true
                            }
                        });
                    },
                },
                profile: {
                    type: ProfileType,
                    args: {
                        id: {
                            type: new GraphQLNonNull(UUIDType),
                        },
                    },
                    resolve: (_source, {id}: { id: string }) => {
                        return prisma.profile.findUnique({where: {id}});
                    },
                },
            },
        }),
    });


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
                schema,
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
