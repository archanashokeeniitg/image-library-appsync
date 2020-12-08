import React, { useState, useEffect } from "react";

import ImageGallery from "./ImageGallery";
import SearchImage from "./SearchImage";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPictures, getPicture, searchPictures } from "../graphql/queries";
import { updatePicture, deletePicture } from "../graphql/mutations";

import aws from "aws-sdk";
import awsExports from "../aws-exports";
aws.config.update({
  accessKeyId: "AKIAXBVPOBMBXZTRG66Y",
  secretAccessKey: "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",
  region: "us-east-1",
});
// aws.config.update({
//   accessKeyId: process.env.AWS_ACESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
//   region: "us-east-1",
// });
const rekognition = new aws.Rekognition();

function Home(props) {
  const [images, setImages] = useState([]);
  const [picture] = useState("");
  const [myAlert, setMyAlert] = useState(false);
  const [matchedData, setMatchedData] = useState([]);
  // const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    getAllImagesToState();
  }, [picture]);

  //retrieving response in json and formatting data in an array
  const getAllImagesToState = async () => {
    const result = await API.graphql(graphqlOperation(listPictures));
    console.log("inside before build 1", result);
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
    // console.log("getOneFormatedImage", image);
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
    const data = await Storage.get(image.key, { download: true }).then((res) =>
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

  const manualLabels = async (imageId, tagValue) => {
    const image = images.filter((value, index, arr) => {
      return value.id === imageId;
    });

    let labels = image[0].labels;
    labels.push(tagValue);

    const input = {
      id: imageId,
      labels: labels,
    };

    try {
      await API.graphql(graphqlOperation(updatePicture, { input: input }));

      //Then I need to refresh the state with the new tag
      await getAllImagesToState();
    } catch (error) {
      console.log(error);
      alert("Cannot edit: Authentication Failed");
    }
  };

  const searchImage = async (searchLabel) => {
    var result;
    console.log("searchLabel", searchLabel);

    // when no search filter is passed, revert back to full list
    if (searchLabel.tag === "") {
      await getAllImagesToState();
    } else {
      const filter = {
        labels: {
          match: {
            labels: searchLabel,
          },
        },
      };
      console.log("new filter is", filter);
      result = await API.graphql(
        graphqlOperation(searchPictures, { filter: filter })
      );

      if (result.data.searchPictures.items.length > 0) {
        console.log("before build 2", result);
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

  const searchUsingImage = async (matchedImages) => {
    var resultArray = [];

    if (matchedImages == "") {
      await getAllImagesToState();
    } else {
      setTimeout(async function () {
        matchedImages.forEach((image) => {
          const filter = {
            name: {
              eq: image.Face.ExternalImageId,
            },
          };
          const result = API.graphql(
            graphqlOperation(searchPictures, { filter: filter })
          ).then((result) => {
            return resultArray.push(result);
          });
        });
      }, 2000);
      setTimeout(async function () {
        //let imageArray = resultArray;
        console.log("resultArray is ", resultArray);
        // const newResultArray =
        let imageArray = await buildImageArray(
          resultArray.map((item, i) => {
            return item.data.searchPictures.items[0];
          })
        );
        console.log("baba image array is ", imageArray);
        setImages(imageArray);
      }, 4000);
    }
  };

  const searchImageByImage = async (searchImageByImage) => {
    var params = {
      CollectionId: "youtubers",
      FaceMatchThreshold: 90,
      Image: {
        S3Object: {
          Bucket: awsExports.aws_user_files_s3_bucket,
          Name: "public/" + searchImageByImage.name,
        },
      },
      MaxFaces: 5,
    };
    rekognition.searchFacesByImage(params, async function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        setMatchedData(data.FaceMatches.length);
        const imageMatches = data.FaceMatches.filter(async function (match) {
          // console.log("match.Face.ExternalImageId", match);
          return match.Face.ExternalImageId !== "undefined";
        });
        searchUsingImage(imageMatches);
      }
    });
  };

  // const searchImageByImage = async (searchImageByImage, rekogFunction) => {
  //   console.log("rekoggg func is ", rekogFunction);
  //   // const filter = {
  //   //   name: {
  //   //     // match: imageName,
  //   //     eq: rekogFunction.Face.ExternalImageId,
  //   //   },
  //   // };
  //   // console.log("Filter @ 555555", filter);
  //   // const result = await API.graphql(
  //   //   graphqlOperation(searchPictures, { filter: filter })
  //   // );
  //   // console.log("inside searchUsingImage222", result);

  //   rekogFunction = (searchImageByImage) => {
  //     console.log("insidecallback ", searchImageByImage);
  //     var params = {
  //       CollectionId: "youtubers",
  //       FaceMatchThreshold: 90,
  //       Image: {
  //         S3Object: {
  //           Bucket: awsExports.aws_user_files_s3_bucket,
  //           Name: "public/" + searchImageByImage.name,
  //         },
  //       },
  //       MaxFaces: 5,
  //     };
  //     console.log("params @@@@ 4444", params);
  //     rekognition.searchFacesByImage(params, async function (err, data) {
  //       console.log("dattta new is ", data.FaceMatches);
  //       if (err) {
  //         console.log(err, err.stack);
  //       } else {
  //         console.log("datttts------", data.FaceMatches.length);
  //         setMatchedData(data.FaceMatches.length);
  //         const imageMatches = data.FaceMatches.filter(async function (match) {
  //           console.log("match.Face.ExternalImageId", match);
  //           // searchUsingImage(match.Face.ExternalImageId);
  //           return match.Face.ExternalImageId !== "undefined";
  //         });
  //         console.log("image matches", imageMatches);
  //       }
  //     });
  //   };
  // };

  return (
    <div>
      {myAlert ? (
        <div
          id="success-alert"
          className="alert alert-danger text-center"
          role="alert"
        >
          Image Deleted successfully!!!
        </div>
      ) : null}
      {matchedData >= 1 ? (
        <div
          id="success-alert"
          className="alert alert-success text-center"
          role="alert"
        >
          Yes! {matchedData} same faces detected!!!
        </div>
      ) : null}

      <div className="row d-flex mt-30  justify-content-center">
        <SearchImage
          searchImage={searchImage}
          searchImageByImage={searchImageByImage}
        />
      </div>
      <br />
      <div className="  container">
        <ImageGallery
          images={images}
          deleteImage={deleteImage}
          downloadImage={downloadImage}
        />
      </div>
    </div>
  );
}

export default Home;
