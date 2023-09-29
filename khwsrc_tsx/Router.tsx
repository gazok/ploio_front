import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./login";
import Main from "./App";
import { ContentBeforeAfter } from "./inputtest";
import React from "react";

const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element = { <Main /> }></Route>
                <Route path="/login" element = { <Login /> }></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;