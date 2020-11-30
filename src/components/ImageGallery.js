import React, { useState } from "react";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
} from "reactstrap";

import { API, graphqlOperation, label } from "aws-amplify";
import { updatePicture } from "../graphql/mutations";

import awsExports from "../aws-exports";
import "./Home.css";
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
        {props.images.map((image) => (
          <div className="card" key={image.id}>
            <Card>
              <CardImg
                top
                width="100%"
                className="card-image"
                alt="Happy Face"
                src={image.src}
              ></CardImg>
              <CardBody>
                <CardTitle tag="h6" className="text-center">
                  Owner : {image.owner}
                </CardTitle>
                <CardTitle tag="h6">
                  <Container>
                    <Row>
                      <Col xs="6" sm="4">
                        <i
                          className="fa fa-trash"
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                          aria-hidden="true"
                          onClick={(event) => {
                            props.deleteImage(image.id);
                          }}
                        ></i>
                      </Col>
                      <Col xs="6" sm="4">
                        <i
                          className="fa fa-download "
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "flex",
                            justifyContent: "center",
                          }}
                          download="download.png"
                          onClick={(event) => {
                            props.downloadImage(image);
                          }}
                        ></i>
                      </Col>
                      <Col sm="4">
                        <i
                          className="fa fa-edit"
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                          onClick={(event) => {
                            setImageID(image.id);
                            setToggle(true);
                          }}
                        ></i>
                      </Col>
                    </Row>
                  </Container>
                </CardTitle>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}

export default ImageGallery;
