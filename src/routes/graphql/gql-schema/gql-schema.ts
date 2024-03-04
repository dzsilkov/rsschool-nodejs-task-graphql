import {GraphQLObjectType, GraphQLSchema} from 'graphql/index.js';
import {postMutations} from './mutations/post.js';
import {profileMutations} from './mutations/profile.js';
import {userMutations} from './mutations/user.js';
import {profileQuery} from './query/profile.js';
import {postQuery} from './query/post.js';
import {memberTypeQuery} from './query/memberType.js';
import {userQuery} from './query/user.js';
import {UserType} from '../types/user.js';
import {MemberType} from '../types/member-type.js';
import {PostType} from '../types/post.js';
import {ProfileType} from '../types/profile.js';

export const gqlSchema = new GraphQLSchema({
    types: [UserType, MemberType, PostType, ProfileType],
    query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: () => ({
            ...userQuery,
            ...memberTypeQuery,
            ...postQuery,
            ...profileQuery
        }),
    }),
    mutation: new GraphQLObjectType({
        name: 'RootMutation',
        fields: () => ({
            ...userMutations,
            ...profileMutations,
            ...postMutations
        }),
    })
});
