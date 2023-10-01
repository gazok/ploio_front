//Summary.js

import React, { useState } from "react";
import "./App.css";
import "./Summary.css";
import Security from "./Security";
import Operating from "./Operating";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

function SummaryTop() {
  return (
    <div className="summary-top">
      <Link to="Operating">
        <svg
          fill="full"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          viewBox="-1 -8 30 30"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14 12h-4v-12h4v12zm4.213-10.246l-1.213 1.599c2.984 1.732 5 4.955 5 8.647 0 5.514-4.486 10-10 10s-10-4.486-10-10c0-1.915.553-3.694 1.496-5.211l2.166 2.167 1.353-7.014-7.015 1.35 2.042 2.042c-1.287 1.904-2.042 4.193-2.042 6.666 0 6.627 5.373 12 12 12s12-5.373 12-12c0-4.349-2.322-8.143-5.787-10.246z"/>
        </svg>
        Operating
      </Link>
      <Link to="/Security">
        <svg
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          viewBox="2 -9 30 30"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0c-3.371 2.866-5.484 3-9 3v11.535c0 4.603 3.203 5.804 9 9.465 5.797-3.661 9-4.862 9-9.465v-11.535c-3.516 0-5.629-.134-9-3zm0 1.292c2.942 2.31 5.12 2.655 8 2.701v10.542c0 3.891-2.638 4.943-8 8.284-5.375-3.35-8-4.414-8-8.284v-10.542c2.88-.046 5.058-.391 8-2.701zm5 7.739l-5.992 6.623-3.672-3.931.701-.683 3.008 3.184 5.227-5.878.728.685z"/>
        </svg>
        Security
      </Link>
      <div className="search">
        <input type="text" placeholder="Search..." />
        <button>
          <svg
             fill="none"
             height="10"
             stroke="currentColor"
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth="2"
             viewBox="0 0 20 20"
             width="15"
             xmlns="http://www.w3.org/2000/svg"
           >
             <path
               d="M21 21l-4.577-4.578M10 18a8 8 0 100-16 8 8 0 000 16z"
             />
           </svg>
         </button>
         <button>
           <svg
             fill="full"
             height="10"
             stroke="currentColor"
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth="1"
             viewBox="0 0 25 25"
             width="15"
             xmlns="http://www.w3.org/2000/svg"
           >
            <path d="M13 10h-8v-2h8v2zm8.172 14l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z"/>
           </svg>
           Min
         </button>
       </div>
    </div>
  );
}

function Summary() {
  return (
      <Router>
        <SummaryTop /> 
        <Switch>
          <Route path="/Security" component={Security} />
          <Route path="/" component={Operating} />
        </Switch>
      </Router>
  );
}

export default Summary;
