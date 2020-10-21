import React, { Component } from "react";
import { Card, CardImg, Row, Col } from "reactstrap";

class ImageGallery extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("inside Imagegallery", this.props.images);
    return (
      <div className="container">
        <Row>
          {this.props.images.map((image) => (
            <Col>
              <Card key={image.id} className="  jumbotron ">
                <div>
                  <i
                    className="fa fa-trash pull-left "
                    aria-hidden="true"
                    onClick={(event) => {
                      this.props.deleteImage(image.id);
                    }}
                  ></i>
                  <i
                    className="fa fa-download   pull-right "
                    onClick={(event) => {
                      this.props.downloadImage(image.src);
                    }}
                  ></i>
                  <CardImg
                    className=""
                    src={image.src}
                    alt="Smiley face"
                    width="100"
                    height="200"
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default ImageGallery;
