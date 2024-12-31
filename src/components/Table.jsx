import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";

const Table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState([]);

  // Fetch members asynchronously
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const resp = await invoke("get_members");
        setMembers(Array.from(resp)); // Ensure the response is an array
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    fetchMembers();
  }, []);

  console.log(searchTerm);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    try {
      const resp = await invoke("search_member", { search: term });
      setMembers(Array.from(resp)); // Ensure the response is an array
    } catch (error) {
      console.error("Failed to search member:", error);
    }
  };

  const filteredData = members.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleDelete = () => {
  return 'leee'
}
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
        <button
          onClick={handleDelete}
          className="self-end bg-green-600 px-5 py-2 rounded text-white mb-5"
        >
          Add Member
        </button>
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
        {filteredData.length > 0 ? (
          filteredData.map((member, index) => (
            <div
              key={index}
              className="grid grid-cols-7 w-full border py-2 items-center"
            >
              <div className="col-span-1 text-center p-2 font-bold">
                {member.member_id}
              </div>
              <div className="flex justify-center col-span-1 text-center p-2">
                <img
                  src={
                    convertFileSrc(member.image) || "../../public/images.png"
                  }
                  className="w-20 h-20 rounded object-cover"
                  alt="Member"
                />
              </div>
              <div className="col-span-1 text-center p-2">{member.name}</div>
              <div className="col-span-1 text-center p-2">
                {member.birthday}
              </div>
              <div className="col-span-1 text-center p-2">{member.address}</div>
              <div className="col-span-1 text-center p-2">{member.region}</div>
              <Link
                to="/print"
                state={member}
                className="col-span-1 flex justify-center items-center"
              >
                <div className="rounded transition duration-100 bg-yellow-300 hover:bg-yellow-400 text-center px-4 p-2">
                  Generate
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No members found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
