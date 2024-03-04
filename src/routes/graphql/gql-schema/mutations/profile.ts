import {ChangeProfileInput, CreateProfileInput, ProfileType} from '../../types/profile.js';
import {GraphQLNonNull, GraphQLString} from 'graphql/index.js';
import {UUIDType} from '../../types/uuid.js';
import {ChangeProfileDto, CreateProfileDto} from '../../models/models.js';
import {Context} from '../../models/context.js';
import {GraphQLBoolean} from 'graphql';

export const profileMutations = {
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
        resolve: async (
            _,
            {id, dto}: { id: string, dto: ChangeProfileDto },
            context: Context
        ) => await context.prisma.profile.update({where: {id}, data: dto})
    },
    deleteProfile: {
        type: GraphQLBoolean,
        args: {
            id: {
                type: new GraphQLNonNull(UUIDType)
            }
        },
        resolve: async (_, {id}: { id: string }, context: Context) => {
            await context.prisma.profile.delete({where: {id}});
            return true;
        }
    },
    createProfile: {
        type: ProfileType,
        args: {
            dto: {
                type: new GraphQLNonNull(CreateProfileInput)
            }
        },
        resolve: async (_, {dto}: { dto: CreateProfileDto }, context: Context) =>
            await context.prisma.profile.create({data: dto})
    },
}