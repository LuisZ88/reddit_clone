import React from "react";
import { Flex, Image } from "@chakra-ui/react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";

const NavBar: React.FC = () => {
  return (
    <Flex bg="white" height="44px" padding="6px 12px">
      <Flex align="center">
        <Image src="/images/redditFace.svg" alt="" height="30px" />
        <Image src="/images/redditText.svg" alt="" height="46px" display={{base: "none", md: "unset"}} />
      </Flex>
      <SearchInput/>
      <RightContent/>
      {/* <Directory/>
      
       */}
    </Flex>
  );
};
export default NavBar;
