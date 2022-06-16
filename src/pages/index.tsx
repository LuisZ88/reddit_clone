import { Stack } from "@chakra-ui/react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import { Post, PostVote } from "../atoms/postsAtom";
import CreatePostLink from "../components/Community/CreatePostLink";
import PersonalHome from "../components/Community/PersonalHome";
import PostItem from "../components/Community/Posts/PostItem";
import PostLoader from "../components/Community/Posts/PostLoader";
import Premium from "../components/Community/Premium";
import Recommendations from "../components/Community/Recommendations";
import PageContent from "../components/Layout/PageContent";
import { auth, firestore } from "../firebase/clientApp";
import useCommunityData from "../hooks/useCommunityData";
import usePosts from "../hooks/usePosts";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    onVote,
  } = usePosts();
  const { communityStateValue } = useCommunityData();
  const [loading, setLoading] = useState(false);
  const buildUserHomeFeed = async () => {
    setLoading(true);
    try {
      if (communityStateValue.mySnippets.length) {
        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        );
        const postQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunityIds),
          limit(10)
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      } else {
        buidNoUserHomeFeed();
      }
    } catch (error) {
      console.log("Error al obtener posts", error);
    }
    setLoading(false);
  };
  const buidNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );
      const postDocs = await getDocs(postQuery);
      const post = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostStateValue((prev) => ({ ...prev, posts: post as Post[] }));
    } catch (error) {
      console.log("buildNoUserHomeFeed", error);
    }
    setLoading(false);
  };
  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
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
    } catch (error) {
      console.log("getUserPostVotes", error);
    }
  };

  useEffect(() => {
    if (!user && !loadingUser) {
      buidNoUserHomeFeed();
    } else {
      buildUserHomeFeed();
    }
  }, [user, loadingUser]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (communityStateValue.snippetsFetched) {
      buildUserHomeFeed();
    }
  }, [communityStateValue.snippetsFetched]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user && postStateValue.posts.length) {
      getUserPostVotes();
      return () => {
        setPostStateValue((prev) => ({ ...prev, postVotes: [] }));
      };
    }
  }, [user, postStateValue.posts]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageContent>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onDeletePost={onDeletePost}
                onSelectPost={onSelectPost}
                onVote={onVote}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                homePage
              />
            ))}
          </Stack>
        )}
      </>

      <Stack spacing={5} width="75%">
        <Recommendations />
        <Premium />
        <PersonalHome />
      </Stack>
    </PageContent>
  );
};

export default Home;
