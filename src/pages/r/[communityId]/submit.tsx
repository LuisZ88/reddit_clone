import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { communityState } from "../../../atoms/communitiesAtom";
import NewPostForm from "../../../components/Community/Posts/NewPostForm";
import PageContent from "../../../components/Layout/PageContent";
import { auth } from "../../../firebase/clientApp";

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const communityStateValue = useRecoilState(communityState);
  console.log("communityStateValue", communityStateValue);
  return (
    <PageContent>
      <>
        <Box p="14px 0" borderBottom="1px solid white">
          <Text>Crear una publicación</Text>
        </Box>

        {user && <NewPostForm user={user} />}
      </>
      <> {/* <About/> */}</>
    </PageContent>
  );
};
export default SubmitPostPage;
