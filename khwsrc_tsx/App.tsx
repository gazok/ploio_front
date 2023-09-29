import React from "react";
import "./App.css";
import { Menubar, Top } from "./background";

//create content frame
const Maintext: React.FC = () => {
  return (
    <main className="content">Welcome to your dashboard</main>
  );
}

const Main: React.FC = () => {
  return (
    <div className="app">
      <Menubar />
      <Top />
      <Maintext />
    </div>
  );
}

export default Main;
