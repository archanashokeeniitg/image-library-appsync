import React, { useState, useEffect } from "react";
import ImageGallery from "./ImageGallery";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPictures, getPicture } from "../graphql/queries";
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
      tag: image.tag,
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

  const downloadImage = async (src) => {
    console.log("src", src);
    // const response = await API.graphql(
    //   graphqlOperation(getPicture, { id: id })
    // );
    // const signedURL = await Storage.get(formData.image);
    // formData.image = signedURL;

    // console.log("id download", id);
    // const signedURL = await Storage.get();
    // console.log("signed Url", signedURL);
    //console.log("signeddd url", response.data.getPicture.file);
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
