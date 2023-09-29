import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./login";
import Main from "./App";
import { Appearance } from "./inputtest";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element = { <Appearance /> }></Route>
                <Route path="/login" element = { <Login /> }></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;