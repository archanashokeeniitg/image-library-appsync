import React from "react";

//components
import Home from "../Home";
import Upload from "../Upload";
import Album from "../Album";
import Find from "../FindImage";

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
            Smart Gallery
          </NavbarBrand>
          <Nav>
            <NavItem>
              <NavLink className="text-white" href="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="text-white" href="/upload">
                Upload Image
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="text-white" href="/album">
                Albums
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="text-white" href="/findimage">
                Image Search By Web
              </NavLink>
            </NavItem>
          </Nav>
          <NavItem className="text-white ">
            <i className="fa fa-user " aria-hidden="true"></i>
            &nbsp;
            {props.user.username} &nbsp;
          </NavItem>
          <AmplifySignOut />
        </Navbar>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Home} />
        <Route path="/upload" exact component={Upload} />
        <Route path="/album" exact component={Album} />
        <Route path="/findimage" exact component={Find} />
      </Router>
    </div>
  );
};

export default Header;
