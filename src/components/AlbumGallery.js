import React, { Component, useState } from "react";
import { Card, CardImg, Row, Col, CardText } from "reactstrap";

import { API, graphqlOperation, label } from "aws-amplify";
import { updatePicture } from "../graphql/mutations";
import awsExports from "../aws-exports";
import "./Home.css";

function AlbumGallery(props) {
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
    <div className="container">
      <Row>
        {props.images.map((image) => (
          <Col key={image.id}>
            <div>
                <CardImg
                    className=""
                    src={image.src}
                    alt="Smiley face"
                    width="300"
                    height="400"
                />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default AlbumGallery;
