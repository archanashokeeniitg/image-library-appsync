import React, { Component } from "react";

class ImageGallery extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("inside Imagegallery", this.props.images);
    return (
      <div className="container">
        {this.props.images.map((image) => (
          <div key={image.id} className="jumbotron">
            <i
              className="fa fa-trash col-lg-2"
              aria-hidden="true"
              onClick={(event) => {
                this.props.deleteImage(image.id);
              }}
            ></i>
            <img
              className=" col-lg-8"
              src={image.src}
              alt="Smiley face"
              width="300"
            />

            <i
              className="fa fa-download col-lg-2"
              onClick={(event) => {
                this.props.downloadImage(image.src);
              }}
            ></i>
          </div>
        ))}
      </div>
    );
  }
}

export default ImageGallery;
