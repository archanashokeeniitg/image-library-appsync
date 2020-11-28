import React, { useState, useEffect } from "react";
import ImageGallery from "./AlbumGallery";
import SearchImage from "./SearchImage";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPictures, getPicture, searchPictures } from "../graphql/queries";
import { updatePicture, deletePicture } from "../graphql/mutations";

import Lightbox from "react-awesome-lightbox";
// You need to import the CSS only once
import "react-awesome-lightbox/build/style.css";

function Album(props) {
  const [images, setImages] = useState([]);
  const [picture] = useState("");
  const [myAlert, setMyAlert] = useState(false);
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
      url: await Storage.get(image.file.key),
      id: image.id,
      owner: image.owner,
      title: image.tag,
      lables: image.labels,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  };

  const searchImage = async (searchLabel) => {
    var result;
    console.log("searchLabel", searchLabel);

    // when no search filter is passed, revert back to full list
    if (searchLabel.title == "") {
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
        console.log(" imageArray", imageArray);
        setImages(imageArray);
      } else {
        alert(" Sorry! nothing matches your search");
      }
    }
  };

  console.log(images)

  return (
    <div>
      <div className="row d-flex justify-content-center">
        <SearchImage searchImage={searchImage} />
      </div>

      <Lightbox
        images={images}
      />
    </div>
  );
}

export default Album;
