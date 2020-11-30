import React, { useState, useEffect } from "react";
import SearchImage from "./SearchImage";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPictures, getPicture, searchPictures } from "../graphql/queries";
import { updatePicture, deletePicture } from "../graphql/mutations";

// import Lightbox from "react-awesome-lightbox";
// You need to import the CSS only once
//import "react-awesome-lightbox/build/style.css";

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
    };
  };

  const searchImage = async (searchLabel) => {
    var result;
    console.log("searchLabel", searchLabel);

    // when no search filter is passed, revert back to full list
    if (searchLabel.title === "") {
      await getAllImagesToState();
    } else {
      const filter = {
        title: {
          match: {
            title: searchLabel,
          },
        },
      };
      result = await API.graphql(
        graphqlOperation(searchPictures, { filter: filter })
      );

      if (result.data.searchPictures.items.length > 0) {
        let imageArray = await buildImageArray(
          result.data.searchPictures.items
        );
        console.log("imageArray", imageArray);
        setImages(imageArray);
      } else {
        alert(" Sorry! nothing matches your search");
      }
    }
  };

  console.log(images);

  return (
    <div>
      <div className="row d-flex justify-content-center">
        <button
          className="btn btn-primary"
          type="submit"
          onClick={() => setIsOpen(true)}
        >
          Open gallery
        </button>
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