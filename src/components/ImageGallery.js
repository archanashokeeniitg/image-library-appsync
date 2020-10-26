import React, { Component, useState } from "react";
import { Card, CardImg, Row, Col, CardText } from "reactstrap";

import { API, graphqlOperation } from "aws-amplify";
import { updatePicture } from "../graphql/mutations";
// import awsExports from "../aws-exports";

function ImageGallery(props) {
  const [editedTag, setEditedTag] = useState("");
  const [imageID, setImageID] = useState("");
  const [toggle, setToggle] = useState(false);
  console.log("inside Imagegallery", props);
  console.log("inside selected ", imageID);

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
                <CardText>owned by {image.owner}</CardText>
                <CardImg
                  className=""
                  src={image.src}
                  alt="Smiley face"
                  width="100"
                  height="200"
                />
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

                {toggle ? (
                  <input
                    type="text"
                    // value={editedTag}
                    defaultValue={image.tag}
                    // placeholder="Enter image Tag Here before uploading your file"
                    onChange={(e) =>
                      handleOnTagChange(e.target.value, image.id)
                    }
                    // onChange={({ target }) => setEditedTag(target.value)}
                  />
                ) : (
                  <CardText>{image.tag}</CardText>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ImageGallery;
