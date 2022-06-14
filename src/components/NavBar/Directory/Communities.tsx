import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal";
import { GrAdd } from "react-icons/gr";
import { communityState } from "../../../atoms/communitiesAtom";
import { useRecoilValue } from "recoil";

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(communityState).mySnippets;
  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MIS COMUNIDADES
        </Text>
      </Box>
      <MenuItem
        width="100%"
        fontSize="10pt"
        onClick={() => {
          setOpen(true);
        }}
        _hover={{ bg: "gray.100" }}
      >
        <Flex align="center">
          <Icon fontSize={20} mr={2} as={GrAdd} />
          Crear comunidad
        </Flex>
      </MenuItem>
      {mySnippets.map((snippet) => (
        <div>{snippet.communityId}</div>
      ))}
    </>
  );
};
export default Communities;
