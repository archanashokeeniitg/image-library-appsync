import React, { useState, useEffect } from "react";
import ImageGallery from "./ImageGallery";
import SearchImage from "./SearchImage";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPictures, getPicture, searchPictures } from "../graphql/queries";
import { deletePicture } from "../graphql/mutations";
import aws from "aws-sdk";
import awsExports from "../aws-exports";

//aws.config.setPromisesDependency();

// aws.config.update({ region: "us-east-1" });
// aws.config.setPromisesDependency();
// aws.config.update({ region: "us-east-1" });
aws.config.update({
  accessKeyId: "AKIAXBVPOBMBXZTRG66Y",
  //accessKeyId: "AKIAJEWM2L4HYT5CO6RQ",
  secretAccessKey: "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",
  //secretAccessKey: "z4F2isKJ6ONeNwIv/Ya+OtqKVSSvjAz/Ng2EO2l7",
  region: "us-east-1",
});
const rekognition = new aws.Rekognition();
function Home(props) {
  aws.config.update({ region: "us-east-1" });
  const [images, setImages] = useState([]);
  const [picture] = useState("");
  const [myAlert, setMyAlert] = useState(false);
  const [searchedImage, setSearchedImage] = useState([]);

  useEffect(() => {
    aws.config.update({ region: "us-east-1" });
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
    //console.log("getOneFormatedImage", image);
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
  };

  const searchImage = async (searchLabel) => {
    var result;
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

  const searchUsingImage = async (imageName) => {
    console.log("inside searchUsingImage 1111", imageName);
    var result;
    if (imageName == "") {
      await getAllImagesToState();
    } else {
      const filter = {
        name: {
          // match: imageName,
          match: "chris1.jpg",
        },
      };
      console.log("Filter @ 555555", filter);
      result = await API.graphql(
        graphqlOperation(searchPictures, { filter: filter })
      );
      console.log("inside searchUsingImage222", result);

      if (result.data.searchPictures.items.length > 0) {
        let imageArray = await buildImageArray(
          result.data.searchPictures.items
        );
        console.log(" imageArray 333333", imageArray);
        setImages(imageArray);
      } else {
        alert(" Sorry! nothing matches your search");
      }
    }
  };

  const searchImageByImage2 = async (searchImageByImage) => {
    console.log(
      "inside home client's searchImageByImage2 succesfully ",
      searchImageByImage
    );
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
    console.log("params @@@@ 4444", params);
    rekognition.searchFacesByImage(params, async function (err, data) {
      if (err) {
        console.log(err, err.stack);
        // cb([]);
      } else {
        console.log(data);
        const imageMatches = data.FaceMatches.filter(function (
          match,
          searchUsingImage
        ) {
          console.log("match.Face.ExternalImageId", match);
          return match.Face.ExternalImageId !== "undefined";
        }).map(function (image) {
          // return image.Face.ExternalImageId;
          searchUsingImage(image.Face.ExternalImageId);
        });
      }
    });
  };

  // const searchImageByImage = async (searchImageByImage, cb) => {
  //   console.log("inside home client succesfully", searchImageByImage);
  //   var params = {
  //     CollectionId: "youtubers",
  //     FaceMatchThreshold: 90,
  //     Image: {
  //       S3Object: {
  //         Bucket: awsExports.aws_user_files_s3_bucket,
  //         Name: "public/" + searchImageByImage.name,
  //       },
  //     },
  //     MaxFaces: 5,
  //   };
  //   rekognition.searchFacesByImage(params, function (err, data) {
  //     if (err) {
  //       console.log(err, err.stack);
  //       cb([]);
  //     } else {
  //       console.log(data);
  //       const imageMatches = data.FaceMatches.filter(function (match) {
  //         console.log("match.Face.ExternalImageId", match);
  //         return match.Face.ExternalImageId !== "undefined";
  //       })
  //         .map(function (image) {
  //           return image.Face.ExternalImageId;
  //         })
  //         .map(function (s3ObjectKey) {
  //           console.log(
  //             "https://imagelibraryamplify151016-dev.s3.amazonaws.com/public/" +
  //               s3ObjectKey
  //           );
  //           return (
  //             "https://imagelibraryamplify151016-dev.s3.amazonaws.com/public/" +
  //             s3ObjectKey
  //           );
  //         });
  //       //cb(imageMatches);
  //     }
  //   });
  // };

  // });

  // if (data && data.FaceMatches.length > "0") {
  //   console.log("data.FaceMatches", data.FaceMatches);
  //   setSearchedImage(data.FaceMatches);
  //   console.log("searchedImage 2222", searchedImage);
  //   return data.FaceMatches;
  // } else {
  //   console.log(err, err.stack);
  // }
  // });
  // } catch (error) {
  //   console.log("errrrr bhaisab");
  // }
  //}

  // const findImageById = async (id) => {
  //   const filter = {
  //     name: {
  //       match: id,
  //       //match: "424a2209-922c-4139-8abf-3f9083c50c70",
  //     },
  //   };
  //   console.log("filter", filter);
  //   const result = await API.graphql(
  //     graphqlOperation(searchPictures, { filter: filter })
  //   );

  //   let imageArray = await buildImageArray(result.data.searchPictures.items);
  //   console.log("newImageArray", imageArray);
  //   setImages(imageArray);
  //};

  // if (searchedImage) {
  //   console.log(" now after validtion", searchedImage);
  //   // searchedImage.forEach((item) => findImageById(item.Face.ExternalImageId));
  // }
  //};

  return (
    <div>
      <div className="row d-flex justify-content-center">
        <SearchImage
          searchImage={searchImage}
          searchImageByImage2={searchImageByImage2}
        />
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
