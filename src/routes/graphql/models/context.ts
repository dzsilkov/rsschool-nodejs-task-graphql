import {Prisma, PrismaClient} from '@prisma/client';
import {DefaultArgs} from '@prisma/client/runtime/library.js';
import {HttpErrors} from '@fastify/sensible';
import DataLoader from 'dataloader';
import {MemberType, Post, Profile, User} from './models.js';

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
    httpErrors: HttpErrors;
    memberTypeLoader: DataLoader<string, MemberType, string>;
    postLoader: DataLoader<string, Post[], string>;
    profileLoader: DataLoader<string, Profile, string>;
    subscribersLoader: DataLoader<string, User[], string>;
    subscriptionsLoader: DataLoader<string, User[], string>;
}
