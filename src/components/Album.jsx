import React, { useState, useEffect } from "react";
import AlbumGallery from "./AlbumGallery";
import SearchImage from "./SearchImage";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPictures, getPicture, searchPictures } from "../graphql/queries";
import { updatePicture, deletePicture } from "../graphql/mutations";

function Album(props) {
  const [images, setImages] = useState([]);
  const [picture] = useState("");
  const [myAlert, setMyAlert] = useState(false);

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
      src: await Storage.get(image.file.key),
      id: image.id,
      owner: image.owner,
      tag: image.tag,
      lables: image.labels,
      celeb: image.celeb,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  };

  const searchImage = async (searchTag) => {
    var result;
    console.log("searchTag", searchTag);

    // when no search filter is passed, revert back to full list
    if (searchTag.tag == "") {
      await getAllImagesToState();
    } else {
      const filter = {
        tag: {
          match: {
            tag: searchTag,
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

  return (
    <div>
      <div className="row d-flex justify-content-center">
        <SearchImage searchImage={searchImage} />
      </div>

      <AlbumGallery
        images={images}
      />
    </div>
  );
}

export default Album;
