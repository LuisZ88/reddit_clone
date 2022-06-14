import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React from "react";
import { useRecoilState } from "recoil";
import { postState, Post } from "../atoms/postsAtom";
import { firestore, storage } from "../firebase/clientApp";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async () => {};
  const onSelectPost = ()=>{};
  const onDeletePost = async (post: Post): Promise<boolean> => {
    console.log("DELETING POST: ", post.id)
    try {
      // comprobar si hay imagen y eliminarla
      if (post.imageUrl) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }
      // eliminar post
      const postDocRef = doc(firestore, 'posts', post.id);
      await deleteDoc(postDocRef);
      // actualizar posts en atom estado
      setPostStateValue((prev) => ({...prev, posts: prev.posts.filter(p => p.id !== post.id)}));
      return true;
    } catch (error) {
      return false;
    }
   
  };


  

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  }
};
export default usePosts;
