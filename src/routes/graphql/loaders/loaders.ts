import {PrismaClient} from '@prisma/client';
import {MemberType, Post, Profile, User} from '../models/models.js';

export async function loadMemberTypes(memberTypeIds: string[], prisma: PrismaClient,): Promise<MemberType[]> {
    const memberTypes = await prisma.memberType.findMany({
        where: {id: {in: memberTypeIds}},
    });

    const memberTypeMap: { [id: string]: MemberType } = {};
    memberTypes.forEach((memberType) => {
        memberTypeMap[memberType.id] = memberType;
    });

    return memberTypeIds.map((id) => memberTypeMap[id]);
}

export async function loadUsers(userIds: string[], prisma: PrismaClient,): Promise<User[]> {
    const users = await prisma.user.findMany({
        where: {id: {in: userIds}},
        include: {
            userSubscribedTo: true,
            subscribedToUser: true,
        }
    });

    const usersMap: { [id: string]: User } = {};
    users.forEach((user) => {
        usersMap[user.id] = user;
    });

    return userIds.map((id) => usersMap[id]);
}

export async function loadPosts(
    authorIds: string[],
    prisma: PrismaClient,
): Promise<Post[][]> {
    const posts = await prisma.post.findMany({where: {authorId: {in: authorIds}}});

    const postsByAuthorMap: { [authorId: string]: Post[] } = {};

    posts.forEach((post) => {
        if (!postsByAuthorMap[post.authorId]) {
            postsByAuthorMap[post.authorId] = [];
        }
        postsByAuthorMap[post.authorId].push(post);
    });

    return authorIds.map((authorId) => postsByAuthorMap[authorId] || []);
}

export async function loadProfiles(
    userIds: string[],
    prisma: PrismaClient,
): Promise<Profile[]> {
    const profiles = await prisma.profile.findMany({
        where: {userId: {in: userIds}},
    });

    const profilesMap: { [id: string]: Profile } = {};
    profiles.forEach((profile) => {
        profilesMap[profile.userId] = profile;
    });

    return userIds.map((id) => profilesMap[id]);
}

export async function loadSubscribers(
    authorIds: string[],
    prisma: PrismaClient,
): Promise<User[][]> {
    const users = await prisma.user.findMany({
        where: {userSubscribedTo: {some: {authorId: {in: authorIds}}}},
        include: {userSubscribedTo: true},
    });

    const usersMap: { [id: string]: User[] } = {};

    users.forEach((user) => {
        user.userSubscribedTo.forEach((userSubscribedTo) => {
            if (!usersMap[userSubscribedTo.authorId]) {
                usersMap[userSubscribedTo.authorId] = [];
            }
            usersMap[userSubscribedTo.authorId].push(user);
        });
    });

    return authorIds.map((authorId) => usersMap[authorId] ?? []);
}

export async function loadSubscriptions(
    subscriberIds: string[],
    prisma: PrismaClient,
): Promise<User[][]> {
    const users = await prisma.user.findMany({
        where: {subscribedToUser: {some: {subscriberId: {in: subscriberIds}}}},
        include: {subscribedToUser: true},
    });

    const usersMap: { [id: string]: User[] } = {};

    users.forEach((user) => {
        user.subscribedToUser.forEach((subscribedToUser) => {
            if (!usersMap[subscribedToUser.subscriberId]) {
                usersMap[subscribedToUser.subscriberId] = [];
            }
            usersMap[subscribedToUser.subscriberId].push(user);
        });
    });

    return subscriberIds.map((subscriberId) => usersMap[subscriberId] ?? []);
}

// const memberTypeLoader = new DataLoader<string, MemberType>(async (memberTypeIds) =>
//     loadMemberTypes([...memberTypeIds], prisma),
// );
//
// const postLoader = new DataLoader<string, Post[]>(async (authorIds) =>
//     loadPosts([...authorIds], prisma),
// );
//
// const profileLoader = new DataLoader<string, Profile>(async (userIds) =>
//     loadProfiles([...userIds], prisma),
// );
//
// const subscribersLoader = new DataLoader<string, User[]>(async (userIds) =>
//     loadSubscribers([...userIds], prisma),
// );
//
// const subscriptionsLoader = new DataLoader<string, User[]>(async (userIds) =>
//     loadSubscriptions([...userIds], prisma),
// );