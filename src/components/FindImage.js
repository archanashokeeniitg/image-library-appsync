import React, { useState, useEffect } from "react";
import { Storage, API, graphqlOperation, label } from "aws-amplify";
import { createPicture } from "../graphql/mutations";
import Unsplash, { toJson } from "unsplash-js";
import Predictions from "@aws-amplify/predictions";
import awsExports from "../aws-exports";
import "./FindImage.css";

function FindImage(props) {
    const [query, setQuery] = useState("");
    const [pics, setPics] = useState([]);
    console.log(query);

    const searchPhotos = async (e) => {
        e.preventDefault();
        unsplash.search
            .photos(query)
            .then(toJson)
            .then((json) => {
                setPics(json.results);
            });
    };

    const unsplash = new Unsplash({
        // accessKey: process.env.REACT_APP_ACCESS_KEY,
        accessKey: "uInUczpRVpZw67dsJn6gyvt62QuT7dI2ez9ydZadONs",
    });

    return (
        <>
            <form onSubmit={searchPhotos} className="form-inline">
                <div class="input-group">
                    <input
                        type="text"
                        name="query"
                        className="form-control"
                        placeholder={`Search Using Labels`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit">
                        Search
          </button>
                </div>
            </form>
            <div className="card-list">
                {pics.map((pic) => (
                    <div className="card" key={pic.id}>
                        <img
                            className="card-image"
                            alt={pic.alt_description}
                            src={pic.urls.full}
                            width="100%"
                            height="100%"
                        ></img>
                    </div>
                ))}
            </div>
        </>
    );
}
export default FindImage;