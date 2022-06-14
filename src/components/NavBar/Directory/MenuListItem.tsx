import { MenuItem } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

type MenuListItemProps = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageUrl?: string;
};

const MenuListItem: React.FC<MenuListItemProps> = ({
  displayText,
  link,
  icon,
  iconColor,
  imageUrl,
}) => {
  return <MenuItem width="100%" fontSize="10pt"></MenuItem>;
};
export default MenuListItem;
