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