import { Timestamp } from "@google-cloud/firestore";
import { atom } from "recoil";

export interface Community{
    id: string;
    creatorId: string;
    numberOfMembers: number;
    privacyType: "public" | "private" | "restricted";
    createdAt?: Timestamp;
    imageUrl?: string;
}
export interface CommunitySnippet{
    communityId: string;
    isModerator?: boolean;
    imageUrl?: string;
}
interface CommunityState {
    mySnippets: CommunitySnippet[];
    currentCommunity?: Community;
}
const defaultCommunityState: CommunityState = {
    mySnippets: [],
    currentCommunity: undefined,
}

export const communityState = atom<CommunityState> ({
    key: "communitiesState",
    default: defaultCommunityState
});