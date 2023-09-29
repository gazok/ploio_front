import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./login";
import Main from "./App";

function Router() {
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