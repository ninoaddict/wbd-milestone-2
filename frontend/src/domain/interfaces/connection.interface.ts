export interface UserShortInfo {
    id: bigint,
    name: string,
    email: string,
    profile_photo_path: string,
    username: string
}

export interface UserShortInfoQueried {
    createdAt: string,
    user: {
        id: bigint,
        name: string,
        profile_photo_path: string,
        username: string
    }
}

export type UserList = UserShortInfo[];

export type UserListQueried = UserShortInfoQueried[];