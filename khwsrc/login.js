import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Menubar, Top } from './background';

function Login() {
  return (
    <div className="app">
      <Menubar />
      <Top />
      <main className="content">
      <h2>Login</h2>
        <form method="post" action="#" id="login-form">
            <input type="text" placeholder="userid"></input>
            <input type="password" placeholder="password"></input>
            <label></label>
        </form>
      </main>
    </div>
);
}

export default Login;