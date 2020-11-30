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
      celeb: image.celeb,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
      key: image.file.key,
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

  const downloadImage = async (image) => {
    console.log("image", image);
    await Storage.get(image.key, { download: true }).then((res) =>
      downloadBlob(res.Body, image.key)
    );
  };

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener("click", clickHandler);
      }, 150);
    };
    a.addEventListener("click", clickHandler, false);
    a.click();
    return a;
  }

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
          image Deleted successfully!!!
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
