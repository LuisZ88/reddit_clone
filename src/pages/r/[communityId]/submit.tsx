import { Box, Text } from "@chakra-ui/react";
import React from "react";
import NewPostForm from "../../../components/Community/Posts/NewPostForm";
import PageContent from "../../../components/Layout/PageContent";

const SubmitPostPage: React.FC = () => {
  return (
    <PageContent>
        <><Box p='14px 0' borderBottom="1px solid white"><Text>Crear una publicación</Text></Box>

      <NewPostForm/></>
      <> {/* <About/> */}</>
    </PageContent>
  );
};
export default SubmitPostPage;
