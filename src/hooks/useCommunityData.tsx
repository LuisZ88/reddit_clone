import { collection, doc, getDocs, increment, writeBatch } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";

const useCommunityData = () => {

  const joinCommunity = async (communityData: Community) => {
    // escribir en la base de datos, unirse a la comunidad y actualizar los miembros
    try {
      const batch = writeBatch(firestore);
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
      };
      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );
      batch.update(doc(firestore, `communities/${communityData.id}`), {
        numberOfMembers: increment(1),
      });
      await batch.commit();
      // actualizar el estado de la comunidad con recoil
      setCommunityStateValue(prev => ({...prev, mySnippets: [...prev.mySnippets, newSnippet]}));


    } catch (error: any) {
      console.log("joinCommunity error", error);
      setError(error.message);
    }
    setLoading(false);
    
  };
  const leaveCommunity = (communityId: string) => {
      try {
          // escribir en la base de datos, dejar la comunidad y actualizar los miembros
          const batch = writeBatch(firestore);
          batch.delete(doc(firestore, `users/${user?.uid}/communitySnippets`, communityId));
          batch.update(doc(firestore, `communities/${communityId}`), {
              numberOfMembers: increment(-1),
            });
            batch.commit();
            // actualizar el estado de la comunidad con recoil
            setCommunityStateValue(prev => ({...prev, mySnippets: prev.mySnippets.filter(snippet => snippet.communityId !== communityId)}));
      } catch (error: any) {
            console.log("leaveCommunity error", error);
            setError(error.message);
          
      }
        setLoading(false);
  };
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = useState("");
  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined?: boolean
  ) => {
      if(!user){
        setAuthModalState({open: true, view: "login"});
      }
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };
  const getMySnippets = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
      console.log("snippets", snippets);
    } catch (error: any) {
      console.log("getMySnippet error", error);
      setError(error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (!user) return;
    getMySnippets();
  }, [user]);

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  };
};
export default useCommunityData;
