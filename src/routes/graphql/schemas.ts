import {Type} from '@fastify/type-provider-typebox';
import {GraphQLList, GraphQLObjectType, GraphQLSchema} from 'graphql';
import {MemberType} from './types/member-type.js';

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
    query: new GraphQLObjectType<any, any>({
        name: 'Root',
        fields: {
            memberTypes: {
                type: new GraphQLList(MemberType),
            }
        }
    })

});
