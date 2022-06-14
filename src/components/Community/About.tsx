import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
  Image,
  Spinner,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { Community, communityState } from "../../atoms/communitiesAtom";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import moment from "moment";
import "moment/locale/es";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "../../firebase/clientApp";
import useSelectFile from "../../hooks/useSelectFile";
import { FaReddit } from "react-icons/fa";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import { useSetRecoilState } from "recoil";

type AboutProps = {
  communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const selectFileRef = useRef<HTMLInputElement>(null);
  const { setSelectedFile, onSelectFile, selectedFile } = useSelectFile();
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const setCommunityStateValue = useSetRecoilState(communityState);
  const { communityId } = router.query;

  const onUpdateImage = async () => {
    console.log("onUpdateImage");
    if (!selectedFile) return;
    setUploadingImage(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "communities", communityData.id), {
        imageUrl: downloadURL,
      });
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageUrl: downloadURL,
        } as Community,
      }));
    } catch (error: any) {
      console.log("onUpdateImage error", error);
    }
    setUploadingImage(false);
  };

  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.400"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700} color="white">
          Acerca de la communidad
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction="column" flexGrow={1}>
              <Text>{communityData.numberOfMembers.toLocaleString()}</Text>
              <Text>Miembros</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>1</Text>
              <Text>Activos</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align="center"
            width="100%"
            p={1}
            fontWeight={500}
            fontSize="10pt"
          >
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {communityData.createdAt && (
              <Text>
                Creado{"  "}
                {moment(
                  new Date(communityData.createdAt?.seconds * 1000)
                ).format("DD MMM YYYY")}
              </Text>
            )}
          </Flex>
          <Link href={`/r/${communityId}/submit`}>
            <Button mt={3} height="30px">
              Publicar
            </Button>
          </Link>
          {user?.uid === communityData.creatorId && (
            <>
              {" "}
              <Divider />
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => selectFileRef.current?.click()}
                  >
                    Cambiar imagen
                  </Text>
                  {communityData.imageUrl || selectedFile ? (
                    <Image
                      src={selectedFile || communityData.imageUrl}
                      borderRadius="full"
                      boxSize="40px"
                      alt="imagen communidad"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color="brand.100"
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text
                      color="blue.500"
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                      onClick={onUpdateImage}
                    >
                      Guardar cambios
                    </Text>
                  ))}{" "}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  ref={selectFileRef}
                  hidden
                  onChange={onSelectFile}
                ></input>
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default About;
