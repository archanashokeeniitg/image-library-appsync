import React, { useEffect } from "react";
import "./App.css";

//amplify exports
import Amplify from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

function App() {
  useEffect(() => {
    document.body.style.background =
      "linear-gradient(45deg, #51547e 30%, #0a3f74 90%)";
  }, []);
  return (
    <AmplifyAuthenticator style={{ textAlign: "center" }}>
      <div className="App">Hello I'm clean!!</div>
    </AmplifyAuthenticator>
  );
}

export default App;
