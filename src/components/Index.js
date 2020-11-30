import React, { useEffect} from "react";
import bg from "./layout/Index.png";

import Footer from "./layout/Footer";
import SignIn from "./layout/SignIn";

const Index = (props) => {
    useEffect(() => {
        document.body.style.backgroundImage = `url(${bg})`
        document.body.style.backgroundSize = 'cover'
    }, []);
    return (
        <div>
            <SignIn />
            
            <Footer />
        </div>
    );
}

export default Index;