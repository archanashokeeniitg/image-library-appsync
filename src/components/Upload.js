import React, { useState, useEffect } from "react";
import { Storage, API, graphqlOperation, label } from "aws-amplify";
import { createPicture } from "../graphql/mutations";
import Predictions from "@aws-amplify/predictions";
import awsExports from "../aws-exports";
import "./Upload.css";
import aws from "aws-sdk";
const rekognition = new aws.Rekognition();
function Upload(props) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [alert, setAlert] = useState(false);
  const [tag, setTag] = useState("");
  const [labels, setLabels] = useState([]);

  aws.config.setPromisesDependency();
  const rekognition = new aws.Rekognition();
  aws.config.update({
    accessKeyId: "AKIAXBVPOBMBXZTRG66Y",
    //accessKeyId: "AKIAJEWM2L4HYT5CO6RQ",
    secretAccessKey: "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",
    //secretAccessKey: "z4F2isKJ6ONeNwIv/Ya+OtqKVSSvjAz/Ng2EO2l7",
    region: "us-east-1",
  });

  const listFaces = function (req, res) {
    console.log("listfaces successful");
    var params = {
      CollectionId: "youtubers",
      MaxResults: "50",
    };
    rekognition.listFaces(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log("face indexed baby!!!", data);
    });
  };

  const getFaceIndexed = async function (image, dynamoId) {
    console.log("inside getFacedIndex", image);
    var params = {
      CollectionId: "youtubers",
      DetectionAttributes: [],
      ExternalImageId: image.file.key,
      Image: {
        S3Object: {
          Bucket: image.file.bucket,
          Name: "public/" + image.file.key,
        },
      },
    };
    console.log("params bayyyy", params);
    rekognition.indexFaces(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log("rekogggggg", data);
    });
    listFaces();
  };
  const findImageLabels = async (file) => {
    console.log("inside Label");
    return Predictions.identify({
      labels: {
        source: {
          file,
        },
        type: "LABELS",
      },
    })
      .then((response) => {
        console.log("labels", response.labels);
        let labels = response.labels.map((label) => {
          if (label.metadata.confidence > 70) return label.name;
        });
        return labels.filter(Boolean);
      })

      .catch((err) => console.log({ err }));
  };

  const sendImageToDB = async (image) => {
    console.log("inside db write", image);
    try {
      const data = await API.graphql(
        graphqlOperation(createPicture, { input: image })
      ).then((data) => console.log("id is", data.data.createPicture.id));
    } catch (err) {
      console.log("db write error");
    }
  };
  const handleOnFileChange = (e) => {
    let selectedFile = e.target.files[0];
    setSelectedFile(selectedFile);
    console.log("handlefileschangexxxxx", selectedFile);
  };

  const handleChange = (e) => {
    console.log("inside handlechange");
    e.preventDefault();
    const imageFaces = async function (selectedFile) {
      console.log("inside ImageFaces function", selectedFile);
    };

    //storing image in S3
    Storage.put(selectedFile.name, selectedFile, {
      contentType: "image/png",
    }).then((result) => {
      findImageLabels(selectedFile).then((labels) => {
        console.log("inside findLabels", labels);
        setLabels(labels);

        const image = {
          name: selectedFile.name,
          tag: tag,
          labels: labels,
          file: {
            bucket: awsExports.aws_user_files_s3_bucket,
            region: awsExports.aws_user_files_s3_bucket_region,
            key: selectedFile.name,
          },
        };
        getFaceIndexed(image);
        console.log("image payload", image);
        setAlert(true);
        sendImageToDB(image);
      });
    });
  };

  return (
    <div className="container">
      {alert ? (
        <div className="alert alert-success" role="alert">
          image sucessfully uploaded!!!
        </div>
      ) : null}
      <form className="jumbotron" onSubmit={handleChange}>
        <input type="file" onChange={handleOnFileChange} />
        <input
          type="text"
          value={tag}
          placeholder="Enter image Tag Here before uploading your file"
          onChange={({ target }) => setTag(target.value)}
        />

        <button type="submit">Add</button>
      </form>
    </div>

    // {alert ? (
    //   <div>
    //     <img
    //       className="jumbotron"
    //       src={selectedFile}
    //       alt=" uploading area..."
    //       width="300"
    //       height="450"
    //     />
    //   </div>
    // ) : null}
  );
}
export default Upload;
