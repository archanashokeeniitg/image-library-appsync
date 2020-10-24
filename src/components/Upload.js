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
      alert: false,
    };
  }

  sendImageToDB = async (image) => {
    try {
      await API.graphql(graphqlOperation(createPicture, { input: image }));
    } catch (err) {}
  };

  handleChange(e) {
    const file = e.target.files[0];
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
          key: file.name,
        },
      };
      this.setState({ alert: true });
      this.sendImageToDB(image);
    });
  }

  render() {
    return (
      <div className="container text-center">
        {this.state.alert ? (
          <div className="alert alert-success" role="alert">
            image sucessfully uploaded!!!
          </div>
        ) : null}

        <div className="info jumbotron ">
          <p> Please Select an image to Upload</p>
          <input type="file" onChange={(e) => this.handleChange(e)} />
        </div>
        {this.state.file ? (
          <div>
            <img
              className="jumbotron"
              src={this.state.file}
              alt=" uploading area..."
              width="300"
              height="450"
            />
          </div>
        ) : null}
      </div>
    );
  }
}
export default Upload;
