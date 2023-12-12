//AppRoutes.tsx
//라우팅 수행

import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./login.tsx";
import { Signup } from "./signup.tsx";
import Summary from "./summary.tsx";
import { Notice, NoticeM } from "./Notice.tsx";
// import NOps from "./NOps.tsx";
// import NSec from "./NSec.tsx";
import Profile from "./Profile.tsx";
import Setting from "./Setting.tsx";
//import Security from "./Security";
import {Operation, OperationM} from "./Operation.tsx";
import { Management, ManagementM } from "./Management.tsx";
import { Top, Menubar, Content } from "./background.tsx";
import "../css/App.css";
import { createTheme, ThemeProvider } from '@fluentui/react';

const myTheme = createTheme({ //폰트 설정, 수정
  defaultFontStyle: { fontFamily: 'Segoe UI', fontWeight: 'regular' },
  fonts: {
    medium: {
      fontFamily: 'Segoe UI',
      fontWeight: 'regular',
      fontSize: '15px',
    },
  },
});

//            <Route path="Security" element={<Security />} />
function AppRoutes() {
  return (
    <ThemeProvider theme={myTheme}>
    <div className="app">
      <BrowserRouter>
        <Menubar />
        <Routes>
          <Route path="/Signin" element={<div><Top /><Login /></div>} />
          <Route path="/Signup" element={<div><Top /><Signup /></div>} />
          <Route path="/Summary" element={<Summary />}>
            <Route index element={<div><OperationM /></div>} />
            <Route path="Operation" element={<div><OperationM /></div>} />

          </Route>
          <Route path="/Notice" element={<NoticeM />} /> {/*수정*/}
            {/* <Route index element={<NOps />} />
            <Route path="NOps" element={<NOps />} />
            <Route path="NSec" element={<NSec />} /> */}
          {/* </Route> */}
          <Route path="/Management" element={<div><ManagementM /></div>} />

          <Route path="/Profile" element={<div><Top /><Profile /></div>} />
          <Route path="/Setting" element={<div><Top /><Setting /></div>} />
          <Route path="/" element={<div><Top /><Content /></div>} />
        </Routes>
      </BrowserRouter>
    </div>
    </ThemeProvider>
  );
}

export default AppRoutes;
