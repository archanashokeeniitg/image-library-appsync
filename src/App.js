import React, { useEffect, useState } from "react";
import "./App.css";

//amplify exports
import Amplify from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import awsExports from "./aws-exports";

//components imports
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

Amplify.configure(awsExports);

function App() {
  const [user, setUser] = useState("");
  useEffect(() => {
    document.body.style.background =
      "linear-gradient(45deg, #51547e 30%, #0a3f74 90%)";
  }, []);
  return (
    <AmplifyAuthenticator style={{ textAlign: "center" }}>
      <div className="App">
        <row>
          <Header />
        </row>
        Hello I'm clean!!
        <Footer />
      </div>
    </AmplifyAuthenticator>
  );
}

export default App;
