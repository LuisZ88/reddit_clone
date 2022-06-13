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
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
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
import { Post } from "../../../atoms/postsAtom";
import { Timestamp } from "@google-cloud/firestore";

type NewPostFormProps = {
  onSubmit: (values: any) => void;
  user: User;
  communityImageURL?: string;
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
const NewPostForm: React.FC<NewPostFormProps> = ({ user }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>();
  const [error, setError] = useState(false);
  const handleCreatePost = async () => {
    const { communityId } = router.query;
    // crear post object
    const newPost: Post = {
      communityId: communityId as string,
      creatorId: user?.uid,
      creatorDisplayName: user.email!.split("@")[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      votesStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };
    // guardar post en firestore
    setLoading(true);
    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      // comprobar si hay un archivo seleccionado
     

      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        // si hay, subir archivo a storage y guardar url en post
        await uploadString(imageRef, selectedFile, "data_url");
        // actualizar el post con la url de la imagen
        const downloadUrl = await getDownloadURL(imageRef);
        await updateDoc(postDocRef, { imageUrl: downloadUrl });
      }
       // redirecionar a la comunidad
     router.back();
    } catch (error: any) {
      console.log("handleCreatePost error", error);
      setError(true);
    }
    setLoading(false);
    

   
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
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error creando la publicación</AlertTitle>
        </Alert>
      )}
    </Flex>
  );
};
export default NewPostForm;
