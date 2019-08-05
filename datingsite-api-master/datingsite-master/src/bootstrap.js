import React from "react";
import ReactDOM from "react-dom";
import { useRoutes, A } from "hookrouter";

import App from "./components/app";
import MemeForm from "./components/meme-form.js";

import "./style/main.scss";
const routes = {
  "/": () => <App />,
  "/form": () => <MemeForm />,
  "/form/:id": ({ id }) => <MemeForm id={id} editMode={true} />
};

function Main() {
  return (
    <div className="main">
      <div className="navbar">
        <A href="/">HOME</A>
        <A href="/form">FORM</A>
      </div>
      {useRoutes(routes)}
    </div>
  );
}
ReactDOM.render(<Main />, document.querySelector(".app-wrapper"));
