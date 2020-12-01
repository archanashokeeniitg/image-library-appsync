import React, { useState } from "react";

const SearchImage = (props) => {
  const [searchImage, setSearchImage] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    props.searchImage(searchImage);
  };
  const handleOnFileChangeByImage = (e) => {
    let selectedFile = e.target.files[0];
    setSelectedFile(selectedFile);
    console.log("handlefileschangeFor Seacrh", selectedFile);
  };

  const handleSearchSubmitByImage = (e) => {
    e.preventDefault();
    console.log("inside handleSearchSubmitByImage ", selectedFile);
    props.searchImageByImage2(selectedFile);
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit} className=" form-inline ">
        <input
          className="form-control"
          type="text"
          value={searchImage}
          onChange={({ target }) => setSearchImage(target.value)}
          placeholder="search Here..."
        />
        <br />
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>

      <form onSubmit={handleSearchSubmitByImage} className=" form-inline ">
        <input type="file" onChange={handleOnFileChangeByImage} />

        <button className="btn btn-primary" type="submit">
          Search by Image
        </button>
      </form>
    </div>
  );
};
export default SearchImage;
