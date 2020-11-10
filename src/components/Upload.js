import React, { useState, useEffect } from "react";
import { Storage, API, graphqlOperation, label } from "aws-amplify";
import { createPicture } from "../graphql/mutations";
import Predictions from "@aws-amplify/predictions";
import awsExports from "../aws-exports";
import "./Upload.css";
function Upload(props) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [alert, setAlert] = useState(false);
  const [tag, setTag] = useState("");
  const [labels, setLabels] = useState([]);

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
        console.log("lables 1", response);
        let labels = response.labels.map((label) => {
          if (label.metadata.confidence > 70) return label.name;
        });
        console.log("lables are", labels);
        console.log("inside 3", labels.filter(Boolean));
        return labels.filter(Boolean);
      })

      .catch((err) => console.log({ err }));
  };

  const sendImageToDB = async (image) => {
    console.log("inside db write", image);
    try {
      await API.graphql(graphqlOperation(createPicture, { input: image }));
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
    console.log("{tag}", { tag });
    console.log("{selectedFile}", selectedFile);

    //storing image in S3
    Storage.put(selectedFile.name, selectedFile, {
      contentType: "image/png",
    }).then((result) => {
      findImageLabels(selectedFile).then((labels) => {
        console.log("m retuenddd", labels);
        setLabels(labels);

        // this.selectedFileState({ file: URL.createObjectURL(selectedFile) });

        //this.selectedFileState({ file: URL.createObjectURL(selectedFile) });
        //console.log("srccccc", this.selectedFile);
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
