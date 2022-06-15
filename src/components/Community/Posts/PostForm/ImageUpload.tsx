import { Button, Flex, Icon, Image, Stack } from "@chakra-ui/react";
import React, { useRef } from "react";
import { MdDelete } from "react-icons/md";

type ImageUploadProps = {
  selectedFile?: string;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: (value: string) => void;
  setSelectedFile: (value: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFile,
  onSelectImage,
  setSelectedFile,
  setSelectedTab,
}) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);
  return (
    <Flex justify="center" align="center" width="100%" direction="column">
      {selectedFile ? (
        <>
          <Image
            src={selectedFile}
            alt="img"
            maxWidth="400px"
            maxHeight="400px"
          />
          <Stack direction="row" mt={4}>
            <Button height="28px" onClick={() => setSelectedTab("Publicar")}>
              Volver para publicar
            </Button>
            <Button
              height="28px"
              onClick={() => setSelectedFile("")}
              variant="outline"
            >
              <Icon as={MdDelete} fontSize="20px" />
              Borrar
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify="center"
          align="center"
          p={20}
          border="1px dashed"
          borderColor="gray.200"
          width="100%"
          borderRadius={4}
        >
          <Button
            variant="outline"
            onClick={() => selectedFileRef.current?.click()}
          >
            selecciona y sube
          </Button>
          <input
            type="file"
            accept="image/png, image/gif, image/jpeg"
            ref={selectedFileRef}
            hidden
            onChange={onSelectImage}
          ></input>
        </Flex>
      )}
    </Flex>
  );
};
export default ImageUpload;
