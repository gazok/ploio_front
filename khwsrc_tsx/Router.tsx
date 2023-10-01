import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./login";
import { Signup, SignupPage1, SignupPage2, SignupPage3, SignupPage4 } from "./signup";
import {MainBeforeLogIn} from "./App";
import React from "react";
import { Selectable } from "./test";

const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element = { <MainBeforeLogIn /> }></Route>
                <Route path="/login" element = { <Login /> }></Route>
                <Route path="/signup" element = { <Signup /> }></Route>
                <Route path="/signup/su1" element = { <SignupPage1 /> }></Route>
                <Route path="/signup/su2" element = { <SignupPage2 /> }></Route>
                <Route path="/signup/su3" element = { <SignupPage3 /> }></Route>
                <Route path="/signup/su4" element = { <SignupPage4 /> }></Route>
                <Route path="/card" element = { <Selectable /> }></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;