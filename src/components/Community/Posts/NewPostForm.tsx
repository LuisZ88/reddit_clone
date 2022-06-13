import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Stack,
  Textarea,
  Image,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import { useRecoilState, useSetRecoilState } from "recoil";
import { firestore, storage } from "../../../firebase/clientApp";
import TabItem from "./TabItem";
import { postState } from "../../../atoms/postsAtom";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import TextInputs from "./PostForm/TextInputs";
import ImageUpload from "./PostForm/ImageUpload";

type NewPostFormProps = {
  onSubmit: (values: any) => void;
};

const formTabs: TabItem[] = [
  {
    title: "Publicar",
    icon: IoDocumentText,
  },
  {
    title: "Multimedia",
    icon: IoImageOutline,
  },
  {
    title: "Enlace",
    icon: BsLink45Deg,
  },
  {
    title: "Encuesta",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
    disabled: true,
  },
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
  disabled?: boolean;
};
const NewPostForm: React.FC<NewPostFormProps> = () => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>();
  const handleCreatePost = async (values: any) => {
    // crear post object

    // guardar post en firestore

    // comprobar si hay un archivo seleccionado
        // si hay, subir archivo a storage

  };
  const onSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (readerEvent) => {
        if (readerEvent.target?.result) {
          setSelectedFile(readerEvent.target.result as string);
        }
      };
    }
  };
  const onTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTextInputs({ ...textInputs, [e.target.name]: e.target.value });
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item) => (
          <TabItem
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Publicar" && (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            loading={loading}
            handleCreatePost={handleCreatePost}
          />
        )}
        {selectedTab === "Multimedia" && (
          <ImageUpload
            onSelectImage={onSelectImage}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
          />
        )}
      </Flex>
    </Flex>
  );
};
export default NewPostForm;
