import React, { Component, useState } from "react";
import { Card, CardImg, Row, Col, CardText } from "reactstrap";

import { API, graphqlOperation, label } from "aws-amplify";
import { updatePicture } from "../graphql/mutations";
// import awsExports from "../aws-exports";
import "./Home.css";

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
    <div className="container">
      <Row>
        {props.images.map((image) => (
          <Col key={image.id}>
            <Card className=" jumbotron ">
              <div>
                <i
                  className="fa fa-trash pull-left "
                  aria-hidden="true"
                  onClick={(event) => {
                    props.deleteImage(image.id);
                  }}
                ></i>
                <i
                  className="fa fa-download "
                  onClick={(event) => {
                    props.downloadImage(image)
                  }}
                ></i>
                <i
                  className="fa fa-edit pull-right "
                  onClick={(event) => {
                    setImageID(image.id);
                    setToggle(true);
                  }}
                ></i>

                <CardImg
                  className=""
                  src={image.src}
                  alt="Smiley face"
                  width="100"
                  height="200"
                />
                <br />
                <div className="align-items-start">
                  <CardText>owner : {image.owner}</CardText>

                  {toggle ? (
                    <input
                      type="text"
                      defaultValue={image.tag}
                      onChange={(e) =>
                        handleOnTagChange(e.target.value, image.id)
                      }
                    />
                  ) : (
                      <CardText> Tag : {image.tag}</CardText>
                    )}

                  <CardText> Dated: {image.updatedAt.toString()}</CardText>

                  <CardText className="img-label">
                    <b>** Labels using Rekognition</b>
                    <br />
                    {image.lables.join(", ")}
                  </CardText>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ImageGallery;
