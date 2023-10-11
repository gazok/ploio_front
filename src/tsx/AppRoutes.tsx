//AppRoutes.tsx
//라우팅 수행

import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Summary from "./Summary";
import Notice from "./Notice";
import NOps from "./NOps";
import NSec from "./NSec";
import Profile from "./Profile";
import Setting from "./Setting";
import Security from "./Security";
import Operation from "./Operation";
import { Top, Menubar, Content } from "./App";
import "./App.css";

function AppRoutes() {
  return (
    <div className="app">
      <BrowserRouter>
        <Menubar />
        <Routes>
          <Route path="/Login" element={<div><Top /><Login /></div>} />
          <Route path="/Signup" element={<div><Top /><Signup /></div>} />
          <Route path="/Summary" element={<Summary />}>
            <Route index element={<Operation />} />
            <Route path="Operation" element={<Operation />} />
            <Route path="Security" element={<Security />} />
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
    </div>
  );
}

export default AppRoutes;
