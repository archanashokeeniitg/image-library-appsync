import React, { Component, useState } from "react";
import {Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from "reactstrap";

import { API, graphqlOperation, label } from "aws-amplify";
import { updatePicture } from "../graphql/mutations";
import awsExports from "../aws-exports";
import "./Home.css"
import "./FindImage.css";

function ImageGallery(props) {
  const [editedTag, setEditedTag] = useState("");
  const [imageID, setImageID] = useState("");
  const [toggle, setToggle] = useState(false);
  //const [imageLabels, setImageLabels] = useState(undefined);
  console.log("inside Imagegallery", props);

  const updateDB = async (payload) => {
    console.log("inside db updateDB", payload);
    try {
      await API.graphql(graphqlOperation(updatePicture, { input: payload }));
    } catch (err) {
      console.log("db write error while updateing");
    }
  };

  const handleOnTagChange = (newTag, imageID) => {
    console.log("inside handleachange", newTag, imageID);
    setEditedTag(newTag);
    console.log("editedTag", editedTag);
    const payload = {
      id: imageID,
      tag: editedTag,
    };
    updateDB(payload);
  };

  // class ImageGallery extends Component {


return (
  <>
    <div className="card-list">
      {
        props.images.map((image) =>
          <div className="card" key={image.id}>
            <Card>
              <CardImg 
                  top width="100%"
                  className="card-image"
                  alt="Happy Face"
                  src={image.src}
              ></CardImg> 
              <CardBody>
                <CardTitle tag="h6">Owner : {image.owner}</CardTitle>
                <CardTitle tag="h6">
                  <i
                    className="fa fa-trash pull-left "
                    aria-hidden="true"
                    onClick={(event) => {
                      props.deleteImage(image.id);
                    }}
                  ></i>
                  <a
                    style={{ textDecoration: "none", color: "inherit" }}
                    href={image.src}
                    download="download.png"
                  >
                    <i className="fa fa-download "></i>
                  </a>
                  <i
                    className="fa fa-edit pull-right "
                    onClick={(event) => {
                      setImageID(image.id);
                      setToggle(true);
                    }}
                  ></i>
                </CardTitle>
              </CardBody>
            </Card>
          </div>)}
    </div>
  </>
);
}

export default ImageGallery;