import React, { useEffect} from "react";
import bg from "./layout/Welcome.png";

import Footer from "./layout/Footer";
import Header from "./layout/Header";

const Welcome = (props) => {
    useEffect(() => {
        document.body.style.backgroundImage = `url(${bg})`
        document.body.style.backgroundSize = 'cover'
    }, []);
    return (
        <div>
            <Header user={props.user} />
            <Footer />
        </div>
    );
}

export default Welcome;