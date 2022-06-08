import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import Link from "next/link";

const CommunityNotFound: React.FC = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      Lo sentimos, no existe ninguna comunidad en Reddit con ese nombre.
      <Link href="/">
        <Button mt={4}>VOLVER A LA PÁGINA PRINCIPAL</Button>
      </Link>
    </Flex>
  );
};
export default CommunityNotFound;