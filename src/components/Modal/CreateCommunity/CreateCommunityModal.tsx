import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Divider,
  Text,
  Input,
  Stack,
  Checkbox,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { Transaction } from "@google-cloud/firestore";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import { auth, firestore } from "../../../firebase/clientApp";

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  open,
  handleClose,
}) => {
  const [communityName, setCommunityName] = useState("");
  const [charactersLeft, setCharactersLeft] = useState(21);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityName(e.target.value);
    setCharactersLeft(21 - e.target.value.length);
  };
  const [user] = useAuthState(auth);
  const [communityType, setCommunityType] = useState("public");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onCommunityTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityType(e.target.name);
  };
  const handleCreateCommunity = async () => {
    if (error) setError("");

    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (communityName.length < 3 || communityName.length > 21) {
      setError("El nombre de la comunidad debe tener entre 3 y 21 caracteres");
      return;
    }
    if (communityName.match(format)) {
      setError(
        "El nombre de la comunidad no puede contener caracteres especiales"
      );
      return;
    }
    setLoading(true);
    try {
      const communityDocRef = doc(firestore, "communities", communityName);

      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists()) {
          throw new Error(`Ya existe una comunidad con ese nombre`);
        }
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });
        //create snnipet for community
        transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityName), {
          communityId: communityName,
          isModerator: true,
        });
      });

      
    } catch (error: any) {
      console.log("handleCreateCommunity", error);
      setError(error.message);
    }
    // create community

    setLoading(false);

    // create community document in firestore
  };
  return (
    <>
      <Modal isOpen={open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Create a community
          </ModalHeader>
          <Box pl={3} pr={3}>
            <Divider />
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text fontSize={11} color="gray.500">
                El nombre de la comunidad, incluyendo el uso de mayúsculas, no
                puede ser cambiado.
              </Text>
              <Text
                position="relative"
                top="28px"
                left="10px"
                width="20px"
                color="gray.400"
              >
                r/
              </Text>
              <Input
                position={["relative"]}
                value={communityName}
                size="sm"
                pl="22px"
                onChange={handleChange}
                maxLength={21}
              />
              <Text
                fontSize="9pt"
                color={charactersLeft === 0 ? "red" : "gray.500"}
              >
                {charactersLeft} caracteres restantes
              </Text>
              <Text fontSize="9pt" color="red" pt={1}>
                {error}
              </Text>

              <Box mt={4} mb={4}>
                <Text fontWeight={600} fontSize={15}>
                  Tipo de comunidad
                </Text>
                {/* checkbox */}
                <Stack spacing={2}>
                  <Checkbox
                    name="public"
                    isChecked={communityType === "public"}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillPersonFill} mr={2} color="gray.500" />
                      <Text fontSize="10pt" mr={1}>
                        Pública
                      </Text>
                      <Text fontSize="8pt" color="GrayText.500" pt={1}>
                        Cualquiera puede ver, publicar y comentar en esta
                        comunidad
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="restricted"
                    isChecked={communityType === "restricted"}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Text fontSize="10pt" mr={1}>
                        <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                        Restringida
                      </Text>
                      <Text fontSize="8pt" color="GrayText.500" pt={1}>
                        Cualquiera puede ver esta comunidad, pero solo los
                        usuarios aprobados pueden publicar
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="private"
                    isChecked={communityType === "private"}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={HiLockClosed} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Privado
                      </Text>
                      <Text fontSize="8pt" color="GrayText.500" pt={1}>
                        Solo los usuarios aprobados pueden ver y participar en
                        esta comunidad
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>
          <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              height="30px"
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Crear comunidad
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModal;
