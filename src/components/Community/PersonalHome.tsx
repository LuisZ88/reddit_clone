import React, { useState } from "react";
import { Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { FaReddit } from "react-icons/fa";
import useDirectory from "../../hooks/useDirectory";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";
import { auth } from "../../firebase/clientApp";

const PersonalHome: React.FC = () => {
  const { toggleMenuOpen } = useDirectory();
  const [createCommunityModalOpen, setCreateCommunityModalOpen] =
    useState(false);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const onClick = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    const { communityId } = router.query;

    if (communityId) {
      router.push(`/r/${communityId}/submit`);
      return;
    }
    toggleMenuOpen();
  };
  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
      position="sticky"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="34px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/redditPersonalHome.png)"
        backgroundSize="cover"
      ></Flex>
      <Flex direction="column" p="12px">
        <Flex align="center" mb={2}>
          <Icon as={FaReddit} fontSize={50} color="brand.100" mr={2} />
          <Text fontWeight={600}>Principal</Text>
        </Flex>
        <Stack spacing={3}>
          <Text fontSize="9pt">
            Esta es tu página principal de Reddit. Úsala para ponerte al día
            sobre tus comunidades favoritas.
          </Text>
          <Button height="30px" onClick={onClick}>
            Publicar
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
};
export default PersonalHome;
