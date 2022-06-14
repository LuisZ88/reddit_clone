import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Community } from "../../../atoms/communitiesAtom";
import { auth } from "../../../firebase/clientApp";
import { firestore } from "../../../firebase/clientApp";
import usePosts from "../../../hooks/usePosts";
import { Post } from "../../../atoms/postsAtom";
import PostItem from "./PostItem";
import { Item } from "framer-motion/types/components/Reorder/Item";
import { Stack } from "@chakra-ui/react";
import PostLoader from "./PostLoader";

type PostProps = {
  communityData: Community;
};

const Posts: React.FC<PostProps> = ({ communityData }) => {
  const [loading, setLoading] = React.useState(false);
  const [user] = useAuthState(auth);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  } = usePosts();
  const getPosts = async () => {
    try {
      setLoading(true);
      const postQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postQuery);

      // guardar posts en atom estado
      const post = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPostStateValue((prev) => ({ ...prev, posts: post as Post[] }));
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, [communityData]);
  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post: Post) => (
            <PostItem
              key={post.id}
              post={post}
              userIsCreator={user?.uid === post.creatorId}
              userVoteValue={
                postStateValue.postVotes.find((vote) => vote.postId === post.id)
                  ?.voteValue
              }
              onVote={onVote}
              onDeletePost={onDeletePost}
              onSelectPost={() => onSelectPost(post)}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
