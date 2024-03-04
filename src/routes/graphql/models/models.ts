export type CreateUserDto = Pick<User, 'name' | 'balance'>;

export type ChangeUserDto = Pick<User, 'name' | 'balance'>;

export type CreatePostDto = Omit<Post, 'id'>;

export type ChangePostDto = Pick<Post, 'title' | 'content'>;

export type CreateProfileDto = Omit<Profile, 'id'>;

export type ChangeProfileDto = Pick<Profile, 'isMale' | 'yearOfBirth' | 'memberTypeId'>;

export type SubscribeDto = { userId: string } & UserSubscribedTo;


export type MemberType = {
    id: string;
    discount: number;
    postsLimitPerMonth: number;
}

export type User = {
    id: string;
    name: string;
    balance: number;
    subscribedToUser?: SubscribedToUser[];
    userSubscribedTo?: UserSubscribedTo[];
};

export type Post = {
    id: string;
    title: string;
    content: string;
    authorId: string;
};

export type Profile = {
    id: string;
    isMale: boolean;
    yearOfBirth: number;
    userId: string;
    memberTypeId: string;
};

type SubscribedToUser = {
    subscriberId: string;
};

type UserSubscribedTo = {
    authorId: string;
};

export type PrismaQueryUsersIncludeArgs = {
    userSubscribedTo?: true;
    subscribedToUser?: true;
};

