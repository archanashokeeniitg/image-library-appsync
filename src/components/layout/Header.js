import React from "react";

//components
import Home from "../Home";
import Upload from "../Upload";

import { Router, Route } from "react-router-dom";
import { createBrowserHistory as createHistory } from "history";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
const history = createHistory();

const Header = (props) => {
  return (
    <div>
      <Router history={history}>
        <Navbar color="dark">
          <NavbarBrand href="/" className="text-white">
            Image Gallery
          </NavbarBrand>
          <Nav>
            <NavItem>
              <NavLink className="text-white" href="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="text-white" href="/upload">
                upload Image
              </NavLink>
            </NavItem>
          </Nav>
          <NavItem className="text-white " style={{ paddingLeft: "40%" }}>
            <i className="fa fa-user " aria-hidden="true"></i>
            &nbsp;
            {props.user.username} &nbsp;
          </NavItem>
          <AmplifySignOut />
        </Navbar>
        <Route path="/" exact component={Home} />
        <Route path="/upload" exact component={Upload} />
      </Router>
    </div>
  );
};

export default Header;
