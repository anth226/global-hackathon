import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { Router } from "react-router-dom";
import thunk from "redux-thunk";
import cookie from "react-cookies";
import Routes from "./routes";
import reducers from "./reducers/index";

import * as serviceWorker from "./serviceWorker";
import { AUTH_USER } from "./actions/types";
import history from "./history";
// import stylesheets
import "./styles/index.scss";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "suneditor/dist/css/suneditor.min.css";
import { configureSocket } from "./utils/socket";

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancer(applyMiddleware(thunk)));

const token = cookie.load("token");

if (token) {
  // Update application state. User has token and is probably authenticated
  store.dispatch({ type: AUTH_USER });
}

configureSocket(store.dispatch, store.getState);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
