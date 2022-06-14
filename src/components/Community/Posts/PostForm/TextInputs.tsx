import { Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import React from "react";

type TextInputsProps = {
  textInputs: {
    title: string;
    body: string;
  };
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCreatePost: () => void;
  loading: boolean;
};

const TextInputs: React.FC<TextInputsProps> = ({textInputs, onChange, handleCreatePost, loading}) => {
  return (
    <Stack spacing={3} width={"100%"}>
      <Input
        name="title"
        value={textInputs.title}
        onChange={onChange}
        fontSize={"10pt"}
        borderRadius={4}
        placeholder="Titulo"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          borderColor: "black",
          border: "1px solid",
        }}
      />
      <Textarea
       value={textInputs.body}
       onChange={onChange}
        name="body"
        placeholder="Texto (opcional)"
        fontSize={"10pt"}
        borderRadius={4}
        height={"200px"}
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          borderColor: "black",
          border: "1px solid",
        }}
      />
      <Flex justify="flex-end">
        <Button
          height="34px"
          padding="0px 20px"
          disabled={false}
          onClick={handleCreatePost}
          isLoading={loading}
        >
          Publicar
        </Button>
      </Flex>
    </Stack>
  );
};
export default TextInputs;
