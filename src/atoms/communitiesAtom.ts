import { Timestamp } from "@google-cloud/firestore";
import { atom } from "recoil";

export interface Community{
    id: string;
    creatorId: string;
    numberOfMembers: number;
    privacyType: "public" | "private" | "restricted";
    createdAt?: Timestamp;
    ImageUrl?: string;
}
interface CommunitySnippet{
    communityId: string;
    isModerator?: boolean;
    imgUrl?: string;
}
interface CommunityState {
    mySnippets: CommunitySnippet[];
    // visitedCommunities
}
const defaultCommunityState: CommunityState = {
    mySnippets: [],
}

export const communityState = atom<CommunityState> ({
    key: "communitiesState",
    default: defaultCommunityState
});