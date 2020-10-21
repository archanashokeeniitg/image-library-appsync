import React, { useState, useEffect } from "react";
import ImageGallery from "./ImageGallery";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPictures } from "../graphql/queries";
import { deletePicture } from "../graphql/mutations";

function Home(props) {
  const [images, setImages] = useState([]);
  const [picture, setPicture] = useState("");

  useEffect(() => {
    getAllImagesToState();
  }, [picture]);

  //retrieving response in json and formatting data in an array
  const getAllImagesToState = async () => {
    const result = await API.graphql(graphqlOperation(listPictures));
    let imageArray = await buildImageArray(result.data.listPictures.items);
    console.log("imageARrya", imageArray);
    setImages(imageArray);
  };
  const buildImageArray = async (listPictures) => {
    return await getImagesFileList(listPictures);
  };
  const getImagesFileList = async (imageList) => {
    return Promise.all(
      imageList.map(async (i) => {
        console.log("getImagesFileList", i);
        return getOneFormatedImage(i);
      })
    );
  };
  const getOneFormatedImage = async (image) => {
    console.log("getOneFormatedImage", image);
    return {
      src: await Storage.get(image.file.key),
      id: image.id,
    };
  };

  //for deleting image
  const deleteImage = async (imageId) => {
    const id = {
      id: imageId,
    };
    console.log("imageid", id);
    try {
      await API.graphql(graphqlOperation(deletePicture, { input: id }));
      console.log(images);

      const i = images.filter((value, index, arr) => {
        return value.id !== imageId;
      });
      setImages(i);
      alert("image deleted!!!");
    } catch (error) {
      console.log(error);

      alert("Cannot delete: User doesn't own this image");
    }
  };

  const downloadImage = async (imgSrc) => {
    const src = {
      src: imgSrc,
    };
    alert(imgSrc);
    console.log("imgSrc", imgSrc);
  };

  return (
    <div>
      Home Page
      <ImageGallery
        images={images}
        deleteImage={deleteImage}
        downloadImage={downloadImage}
      />
    </div>
  );
}

export default Home;
