import React, { useState, useEffect } from "react";
import ImageGallery from "./ImageGallery";
import SearchImage from "./SearchImage";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPictures, getPicture, searchPictures } from "../graphql/queries";
import { deletePicture } from "../graphql/mutations";

function Home(props) {
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
      src: await Storage.get(image.file.key),
      id: image.id,
      owner: image.owner,
      tag: image.tag,
      lables: image.labels,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
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
    // const signedURL = await Storage.get(key);
    // console.log("signedURL", signedURL);
    // <a href={signedURL} target="_blank">{fileName}</a>

    // inside your template or JSX code. Note <a download> doesn't work here because it is not same origin
    // <a href={signedURL} target="_blank">{fileName}</a>

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

  const searchImage = async (searchLabel) => {
    var result;
    console.log("searchLabel", searchLabel);

    // when no search filter is passed, revert back to full list
    if (searchLabel.label == "") {
      await getAllImagesToState();
    } else {
      const filter = {
        labels: {
          match: {
            labels: searchLabel,
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

      {myAlert ? (
        <div id="success-alert" className="alert alert-danger" role="alert">
          image deleted successfully!!!
        </div>
      ) : null}
      <br />

      <ImageGallery
        images={images}
        deleteImage={deleteImage}
        downloadImage={downloadImage}
      />
    </div>
  );
}

export default Home;
