import React, { useState, useEffect } from "react";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPictures, getPicture, searchPictures } from "../graphql/queries";
import { updatePicture, deletePicture } from "../graphql/mutations";

//components
import Home from "../../Home";
import Upload from "../../Upload";
import Album from "../../Album";
import Find from "../../FindImage";
import SearchImage from "../SearchImage";

import { Router, Route } from "react-router-dom";
import { createBrowserHistory as createHistory } from "history";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
const history = createHistory();

const HomeNav = (props) => {
  const [images, setImages] = useState([]);
  const [picture] = useState("");
  const [myAlert, setMyAlert] = useState(false);
  // const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    getAllImagesToState();
  }, [picture]);

  //retrieving response in json and formatting data in an array
  const getAllImagesToState = async () => {
    const result = await API.graphql(graphqlOperation(listPictures));
    let imageArray = await buildImageArray(result.data.listPictures.items);
    setImages(imageArray);
  };
  const buildImageArray = async (listPictures) => {
    return await getImagesFileList(listPictures);
  };
  const getImagesFileList = async (imageList) => {
    return Promise.all(
      imageList.map(async (i) => {
        return getOneFormatedImage(i);
      })
    );
  };

  const getOneFormatedImage = async (image) => {
    console.log("getOneFormatedImage", image);
    return {
      src: await Storage.get(image.file.key),
      id: image.id,
      owner: image.owner,
      tag: image.tag,
      lables: image.labels,
      celeb: image.celeb,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  };

  //for deleting image
  const deleteImage = async (imageId) => {
    const id = {
      id: imageId,
    };
    try {
      await API.graphql(graphqlOperation(deletePicture, { input: id }));

      const i = images.filter((value, index, arr) => {
        return value.id !== imageId;
      });
      setImages(i);
      setMyAlert(true);
    } catch (error) {
      console.log(error);
      alert("Cannot delete: User doesn't own this image");
    }
  };

  const downloadImage = async (image) => {
    console.log("image", image);
    const data = await Storage.get(image.key, { download: true }).then((res) =>
      downloadBlob(res.Body, image.key)
    );
  };

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener("click", clickHandler);
      }, 150);
    };
    a.addEventListener("click", clickHandler, false);
    a.click();
    return a;
  }

  const manualLabels = async (imageId, tagValue) => {
    const image = images.filter((value, index, arr) => {
      return value.id === imageId;
    });

    let labels = image[0].labels;
    labels.push(tagValue);

    const input = {
      id: imageId,
      labels: labels,
    };

    try {
      await API.graphql(graphqlOperation(updatePicture, { input: input }));

      //Then I need to refresh the state with the new tag
      await getAllImagesToState();
    } catch (error) {
      console.log(error);
      alert("Cannot edit: Authentication Failed");
    }
  }

  const searchImage = async (searchLabel) => {
    var result;
    console.log("searchLabel", searchLabel);

    // when no search filter is passed, revert back to full list
    if (searchLabel.tag === "") {
      await getAllImagesToState();
    } else {
      const filter = {
        tag: {
          match: {
            tag: searchLabel,
          },
        },
      };
      result = await API.graphql(
        graphqlOperation(searchPictures, { filter: filter })
      );

      if (result.data.searchPictures.items.length > 0) {
        let imageArray = await buildImageArray(
          result.data.searchPictures.items
        );
        console.log(" imageArray", imageArray);
        setImages(imageArray);
      } else {
        alert(" Sorry! nothing matches your search");
      }
    }
  };
  
  return (
    <div>
      <Router history={history}>
        <Navbar color="dark">
          <NavbarBrand href="/" className="text-white">
            Smart Gallery
          </NavbarBrand>
          <Nav>
            <NavItem>
              <NavLink className="text-white" href="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="text-white" href="/upload">
                Upload Image
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="text-white" href="/Album">
                Albums
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="text-white" href="/FindImage">
                Image Search
              </NavLink>
            </NavItem>
            <NavItem>
                <SearchImage searchImage={searchImage} />
            </NavItem>
          </Nav>
          <NavItem className="text-white " style={{ paddingLeft: "40%" }}>
            <i className="fa fa-user " aria-hidden="true"></i>
            &nbsp;
            {props.user.username} &nbsp;
          </NavItem>
          <AmplifySignOut />
        </Navbar>
        <Route path="/" exact component={Home} />
        <Route path="/upload" exact component={Upload} />
        <Route path="/Album" exact component={Album} />
        <Route path="/FindImage" exact component={Find} />
      </Router>
    </div>
  );
};

export default HomeNav;
