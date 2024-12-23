import React, { useState } from "react";

const Search = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const onSearch = () => {
    handleSearch(searchTerm);
  };

  return (
    <div className="font-bold">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter ID..."
        className="p-2 border border-gray-300 rounded"
      />
      <button
        onClick={onSearch}
        className="ml-2 p-2 bg-green-600 text-white rounded"
      >
        Search
      </button>
    </div>
  );
};

export default Search;
