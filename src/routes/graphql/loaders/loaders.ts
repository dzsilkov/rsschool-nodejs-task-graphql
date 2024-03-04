import {PrismaClient} from '@prisma/client';
import {MemberType, Post, Profile, User} from '../models/models.js';
import DataLoader from 'dataloader';

async function loadMemberTypes(ids: string[], prisma: PrismaClient,): Promise<MemberType[]> {
    const memberTypes = await prisma.memberType.findMany({
        where: {id: {in: ids}},
    });

    const memberTypeMap: { [id: string]: MemberType } = {};
    memberTypes.forEach((memberType) => {
        memberTypeMap[memberType.id] = memberType;
    });

    return ids.map((id) => memberTypeMap[id]);
}

async function loadUsers(ids: string[], prisma: PrismaClient,): Promise<User[]> {
    const users = await prisma.user.findMany({
        where: {id: {in: ids}},
        include: {
            userSubscribedTo: true,
            subscribedToUser: true,
        }
    });

    const usersMap: { [id: string]: User } = {};
    users.forEach((user) => {
        usersMap[user.id] = user;
    });

    return ids.map((userId) => usersMap[userId]);
}

async function loadPosts(
    ids: string[],
    prisma: PrismaClient,
): Promise<Post[][]> {
    const posts = await prisma.post.findMany({where: {authorId: {in: ids}}});

    const postsByAuthorMap: { [authorId: string]: Post[] } = {};

    posts.forEach((post) => {
        if (!postsByAuthorMap[post.authorId]) {
            postsByAuthorMap[post.authorId] = [];
        }
        postsByAuthorMap[post.authorId].push(post);
    });

    return ids.map((authorId) => postsByAuthorMap[authorId] || []);
}

async function loadProfiles(
    ids: string[],
    prisma: PrismaClient,
): Promise<Profile[]> {
    const profiles = await prisma.profile.findMany({
        where: {userId: {in: ids}},
    });

    const profilesMap: { [id: string]: Profile } = {};
    profiles.forEach((profile) => {
        profilesMap[profile.userId] = profile;
    });

    return ids.map((id) => profilesMap[id]);
}

export const userLoader = (prisma: PrismaClient) =>
    new DataLoader<string, User>(async (userIds) =>
        loadUsers([...userIds], prisma),
    );

export const memberTypeLoader = (prisma: PrismaClient) =>
    new DataLoader<string, MemberType>(async (memberTypeIds) =>
        loadMemberTypes([...memberTypeIds], prisma),
    );

export const postLoader = (prisma: PrismaClient) =>
    new DataLoader<string, Post[]>(async (authorIds) =>
        loadPosts([...authorIds], prisma),
    );

export const profileLoader = (prisma: PrismaClient) =>
    new DataLoader<string, Profile>(async (userIds) =>
        loadProfiles([...userIds], prisma),
    );
