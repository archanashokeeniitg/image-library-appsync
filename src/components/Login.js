import React, { useEffect, useState } from "react";
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

import Welcome from "./Welcome";
const Login = () => {
    const [user, setUser] = useState("");
    const [authState, setAuthState] = useState("");

    useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);

    return authState === AuthState.SignedIn && user ? (
        <div>
            <Welcome user={user}/>
        </div>
    ) : (
            <AmplifyAuthenticator style={{ textAlign: "center" }}/>
        );
}

export default Login;

