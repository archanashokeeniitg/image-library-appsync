import React, { useState, useEffect } from "react";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPictures } from "../graphql/queries";
import { Jumbotron, Button, Card } from "reactstrap";

import ReactBnbGallery from "react-bnb-gallery";
import "react-bnb-gallery/dist/style.css";

function Album(props) {
  const [images, setImages] = useState([]);
  const [picture] = useState("");
  const [myAlert, setMyAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    getAllImagesToState();
  }, [picture]);

  //retrieving response in json and formatting data in an array
  const getAllImagesToState = async () => {
    const result = await API.graphql(graphqlOperation(listPictures));
    let imageArray = await buildImageArray(result.data.listPictures.items);
    setImages(imageArray);
  };
  const buildImageArray = async (listPictures) => {
    return await getImagesFileList(listPictures);
  };
  const getImagesFileList = async (imageList) => {
    return Promise.all(
      imageList.map(async (i) => {
        return getOneFormatedImage(i);
      })
    );
  };
  const getOneFormatedImage = async (image) => {
    console.log("getOneFormatedImage", image);
    return {
      photo: await Storage.get(image.file.key),
      number: image.id,
      caption: image.tag,
      subcaption: image.labels ? image.labels.join(", ") : "",
    };
  };

  console.log(images);

  return (
    <div>
      <div class="jumbotron bg-transparent">
        <h1
          className="display-3"
          style={{
            color: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Album Gallery
        </h1>
        <br />
        <div class="col text-center">
          <button
            className="btn btn-primary btn-lg"
            type="submit"
            onClick={() => setIsOpen(true)}
          >
            Open gallery
          </button>
        </div>
        <ReactBnbGallery
          show={isOpen}
          photos={images}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </div>
  );
}

export default Album;
