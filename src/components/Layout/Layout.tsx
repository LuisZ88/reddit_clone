import NavBar from "../NavBar/NavBar";
import React, {ReactNode} from "react";
interface LayoutProps {
    children: ReactNode;
  }

const Layout: React.FC<LayoutProps>  = ({ children }) => {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
};
export default Layout;
