import {GraphQLEnumType, GraphQLObjectType, GraphQLFloat, GraphQLInt} from 'graphql';

export const MemberTypeEnumId: GraphQLEnumType = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
        basic: {value: 'basic'},
        business: {value: 'business'},
    },
});

export const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: {type: MemberTypeEnumId},
        discount: {type: GraphQLFloat},
        postsLimitPerMonth: {type: GraphQLInt},
    }),
});