import React, { ReactNode } from "react";
import Header from "./Header";
import "./MainLayout.css";
import Menu from "./Menu";

interface MainLayoutProps {
  title?: string;
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = (props) => {
  return (
    <div id="container">
      <Menu />
      <div id="main">
        <Header title={props.title || ""} />
        <div id="content">{props.children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
