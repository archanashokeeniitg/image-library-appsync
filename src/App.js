import React, { useEffect, useState } from "react";
import './App.css';

//amplify exports
import Amplify, { Auth, Hub } from "aws-amplify";
import awsExports from "./aws-exports";
import { AmazonAIPredictionsProvider } from "@aws-amplify/predictions";

//components imports
import Index from "./components/Index";
import Welcome from "./components/Welcome";

Amplify.configure(awsExports);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

function App() {
  const [user, setUser] = useState("");
  useEffect(() => {
    //finding and setting loggedin User
    let updateUser = async (authState) => {
      try {
        let user = await Auth.currentAuthenticatedUser();
        setUser(user);
      } catch {
        setUser(null);
      }
    };
    Hub.listen("auth", updateUser); // listen for login/signup events
    updateUser(); // check manually the first time because we won't get a Hub event
    return () => Hub.remove("auth", updateUser); // cleanup
  }, []);
  return (
    <div className="App">
      {user ? <Welcome user={user}/> : <Index />}
    </div>
  );
}

export default App;

