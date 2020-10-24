import React, { useState, useEffect } from "react";
import ImageGallery from "./ImageGallery";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPictures } from "../graphql/queries";
import { deletePicture } from "../graphql/mutations";

function Home(props) {
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
    };
  };

  //for deleting image
  const deleteImage = async (imageId) => {
    const id = {
      id: imageId,
    };
    try {
      await API.graphql(graphqlOperation(deletePicture, { input: id }));

      const i = images.filter((value, index, arr) => {
        return value.id !== imageId;
      });
      setImages(i);
      setMyAlert(true);
    } catch (error) {
      console.log(error);
      alert("Cannot delete: User doesn't own this image");
    }
  };

  const downloadImage = async (imgSrc) => {
    console.log("imgSrc", imgSrc);
  };

  return (
    <div>
      {myAlert ? (
        <div id="success-alert" className="alert alert-danger" role="alert">
          image deleted successfully!!!
        </div>
      ) : null}

      <ImageGallery
        images={images}
        deleteImage={deleteImage}
        downloadImage={downloadImage}
      />
    </div>
  );
}

export default Home;
