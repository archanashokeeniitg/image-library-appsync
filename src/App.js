import React from "react";
import "./App.css";
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function App() {
  return <div className="App">Hello I'm clean!!</div>;
}

export default App;
