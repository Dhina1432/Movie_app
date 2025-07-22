import React from "react";

const Search = ({ searchList, setSearchList }) => {
  return (
    <div className="search">
      <div className="text-white text-3xl">
        <img src="search.svg" alt="search" />
        <input
          type="text"
          onChange={(e) => setSearchList(e.target.value)}
          value={searchList}
          placeholder="Search Your Favorite Movies"
        />
      </div>
    </div>
  );
};

export default Search;
