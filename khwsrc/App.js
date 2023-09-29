import "./App.css";
import { Menubar, Top } from "./background";

//create content frame
export function Maintext(props) {
  return (
    <main className="content">Welcome to your dashboard</main>
  );
}

function Main(props) {
  return (
    <div className="app">
      <Menubar />
      <Top />
      <Maintext />
    </div>
  );
}

export default Main;
