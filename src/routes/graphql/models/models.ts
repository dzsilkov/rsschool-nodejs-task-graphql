export type MemberType = {
    id: string;
    discount: number;
    postsLimitPerMonth: number;
}

export type Post = {
    id: string;
    title: string;
    content: string;
};

export type Profile = {
    id: string;
    isMale: boolean;
    yearOfBirth: number;
};

type SubscribedToUser = {
    subscriberId: string;
};

type UserSubscribedTo = {
    authorId: string;
};

export type User = {
    id: string;
    name: string;
    balance: number;
    subscribedToUser?: SubscribedToUser[];
    userSubscribedTo?: UserSubscribedTo[];
};

export type PrismaQueryUsersIncludeArgs = {
    userSubscribedTo?: true;
    subscribedToUser?: true;
};