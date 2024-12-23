import React, { useState } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";

const Table = () => {
  const [searchTerm, setSearchTerm] = useState("");

  console.log(searchTerm);

  const data = [
    {
      photo: "../../public/images.png",
      name: "John Doe",
      birthday: "01/01/1990",
      address: "123 Main St",
      region: "North",
    },
    {
      photo: "../../public/images.png",
      name: "Jane Smith",
      birthday: "02/02/1991",
      address: "456 Elm St",
      region: "South",
    },
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col justify-center items-center p-10">
      <div className="flex justify-between items-center w-full ">
        <Search handleSearch={handleSearch} />
        <Link
          to="/create"
          className="self-end bg-green-600 px-5 py-2 rounded text-white mb-5"
        >
          Add Member
        </Link>
      </div>
      <div className="grid grid-cols-7 w-full ">
        <div className="col-span-1 border text-center p-2 font-bold text-lg">
          No.
        </div>
        <div className="col-span-1 border text-center p-2 font-bold text-lg">
          Photo
        </div>
        <div className="col-span-1 border text-center p-2 font-bold text-lg">
          Name
        </div>
        <div className="col-span-1 border text-center p-2 font-bold text-lg">
          Birthday
        </div>
        <div className="col-span-1 border text-center p-2 font-bold text-lg">
          Address
        </div>
        <div className="col-span-1 border text-center p-2 font-bold text-lg">
          Region
        </div>
        <div className="col-span-1 border text-center p-2 font-bold text-lg">
          Action
        </div>
      </div>
      <div className="h-[75vh] overflow-y-scroll w-full">
        {filteredData.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-7 w-full border py-2 items-center"
          >
            <div className="col-span-1 text-center p-2 font-bold">
              {index + 1}
            </div>
            <div className="flex justify-center col-span-1 text-center p-2">
              <img
                src={item.photo}
                className="w-20 h-20 rounded object-cover"
                alt=""
              />
            </div>
            <div className="col-span-1 text-center p-2">{item.name}</div>
            <div className="col-span-1 text-center p-2">{item.birthday}</div>
            <div className="col-span-1 text-center p-2">{item.address}</div>
            <div className="col-span-1 text-center p-2">{item.region}</div>
            <Link
              to="/print"
              className="col-span-1 flex justify-center items-center"
            >
              <div className="rounded transition duration-100 bg-yellow-300 hover:bg-yellow-400 text-center px-4 p-2">
                Generate
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
