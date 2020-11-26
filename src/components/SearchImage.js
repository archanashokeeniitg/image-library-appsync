import React, { useState } from "react";

const SearchImage = (props) => {
  const [searchImage, setSearchImage] = useState("");
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    props.searchImage(searchImage);
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
    </div>
  );
};
export default SearchImage;
