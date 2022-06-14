import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { prepareServerlessUrl } from "next/dist/server/base-server";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import { Community, communityState } from "../atoms/communitiesAtom";
import { postState, Post, PostVote } from "../atoms/postsAtom";
import { auth, firestore, storage } from "../firebase/clientApp";

const usePosts = (communityData?: Community) => {
  const router = useRouter();
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const currentCommunity = useRecoilValue(communityState).currentCommunity;
  const communityStateValue = useRecoilValue(communityState);

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    event.stopPropagation();
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    const { voteStatus } = post;
    const existingVote = postStateValue.postVotes.find(
      (vote) => vote.postId === post.id
    );
    try {
      let voteChange = vote;
      const batch = writeBatch(firestore);

      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];

      if (!existingVote) {
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );
        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id,
          communityId,
          voteValue: vote,
        };
        batch.set(postVoteRef, newVote);

        // await batch.commit();
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        const postVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );
        if (existingVote.voteValue === vote) {
          voteChange *= -1;
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );

          batch.delete(postVoteRef);
        } else {
          voteChange = 2 * vote;
          updatedPost.voteStatus = voteStatus + 2 * vote;
          const voteIdx = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );
          updatedPostVotes[voteIdx] = { ...existingVote, voteValue: vote };
          if (voteIdx !== -1) {
            updatedPostVotes[voteIdx] = {
              ...existingVote,
              voteValue: vote,
            };
          }
          batch.update(postVoteRef, { voteValue: vote });
        }
      }
      let updatedState = { ...postStateValue, postVotes: updatedPostVotes };
      const postRef = doc(firestore, "posts", post.id!);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });
      const postIdx = postStateValue.posts.findIndex((p) => p.id === post.id);
      updatedPosts[postIdx] = updatedPost;

      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));
      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }

      await batch.commit();
    } catch (error: any) {
      console.log("onVote error", error);
    }
  };
  const onSelectPost = (post: Post) => {
    setPostStateValue((prev) => ({ ...prev, selectedPost: post }));
    router.push(`/r/${post.communityId}/comments/${post.id}`);
  };
  const onDeletePost = async (post: Post): Promise<boolean> => {
    console.log("DELETING POST: ", post.id);
    try {
      // comprobar si hay imagen y eliminarla
      if (post.imageUrl) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }
      // eliminar post
      const postDocRef = doc(firestore, "posts", post.id);
      await deleteDoc(postDocRef);
      // actualizar posts en atom estado
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((p) => p.id !== post.id),
      }));
      return true;
    } catch (error) {
      return false;
    }
  };
  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );
    const postVotesDocs = await getDocs(postVotesQuery);
    const postVotes = postVotesDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
  };
  useEffect(() => {
    if (!user || !communityStateValue.currentCommunity) return;
    getCommunityPostVotes(communityStateValue.currentCommunity.id);
    console.log("usePosts");
  }, [user, communityStateValue.currentCommunity]);
  useEffect(() => {
    if (!user) {
      setPostStateValue((prev) => ({ ...prev, postVotes: [] }));
    }
  }, [user]);
  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};
export default usePosts;
