import React from "react";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { createPicture } from "../graphql/mutations";
import awsExports from "../aws-exports";
import "./Upload.css";

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
    };
  }
  sendImageToDB = async (image) => {
    console.log("inside DB opertaion", image);
    try {
      await API.graphql(graphqlOperation(createPicture, { input: image }));
    } catch (err) {
      console.log("db write error", err);
    }
  };

  handleChange(e) {
    const file = e.target.files[0];
    console.log("file chosen is:", file);
    // storing image in S3
    Storage.put(file.name, file, {
      contentType: "image/png",
    }).then((result) => {
      this.setState({ file: URL.createObjectURL(file) });

      const image = {
        name: file.name,
        file: {
          bucket: awsExports.aws_user_files_s3_bucket,
          region: awsExports.aws_user_files_s3_bucket_region,
          key: "public/" + file.name,
        },
      };
      console.log("image stored in s3 is:", image);

      this.sendImageToDB(image);
      console.log("DB writing completed");
    });
  }

  render() {
    return (
      <div className="container text-center">
        <div className="info jumbotron ">
          <p> Please Select an image to Upload</p>
          <input type="file" onChange={(e) => this.handleChange(e)} />
        </div>
        <div className=" container card">
          <img src={this.state.file} />
        </div>
      </div>
    );
  }
}
export default Upload;
