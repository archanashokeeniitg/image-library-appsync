import React from "react";

import Login from "../Login"

import { Router, Route } from "react-router-dom";
import { createBrowserHistory as createHistory } from "history";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, NavbarBrand, NavLink } from "reactstrap";
const history = createHistory();

const SignIn = (props) => {
    return (
        <div>
            <Router history={history}>
                <Navbar color="dark">
                    <NavbarBrand className="text-white" href="/">Smart Gallery</NavbarBrand>
                    <NavLink className="text-white" href="/login">Sign in / Sign up</NavLink>
                </Navbar>
                <Route path="/login" exact component={Login} />
            </Router>
        </div>
    );
};

export default SignIn;
