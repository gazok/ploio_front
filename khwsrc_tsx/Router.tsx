import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./login";
import { Signup, SignupPage1, SignupPage2, SignupPage3, SignupPage4 } from "./signup";
import React, { useEffect, useState } from "react";
import { Timer } from "./test";
import Summary from "./summary";
import { Content, Menubar, Top } from "./background";
import Operation from "./Operating";
//import Security from "./Security";
import Notice from "./Notice";
import NOps from "./NOps";
import NSec from "./NSec";
import Profile from "./Profile";
import Setting from "./Setting";

// Security 수정하기.
const Router: React.FC = () => {

    return (
        <BrowserRouter>
            <Menubar />
            <Routes>
                <Route path="/login" element={<div><Top /><Login /></div>} />
                <Route path="/signup" element={<div><Top /><Signup /></div>} />
                <Route path="/signup/su1" element = { <SignupPage1 /> }></Route>
                <Route path="/signup/su2" element = { <SignupPage2 /> }></Route>
                <Route path="/signup/su3" element = { <SignupPage3 /> }></Route>
                <Route path="/signup/su4" element = { <SignupPage4 /> }></Route>
                <Route path="/test" element = { <Timer time={10}/> }></Route>
                <Route path="/summary" element={<Summary />}>
                    <Route index element={<Operation />} />
                    <Route path="Operation" element={<Operation />} />
                    <Route path="Security" element={<Operation />} />
                </Route>
                <Route path="/Notice" element={<Notice />}>
                    <Route index element={<NOps />} />
                    <Route path="NOps" element={<NOps />} />
                    <Route path="NSec" element={<NSec />} />
                </Route>
                <Route path="/Profile" element={<div><Top /><Profile /></div>} />
                <Route path="/Setting" element={<div><Top /><Setting /></div>} />
                <Route path="/" element={<div><Top /><Content /></div>} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;