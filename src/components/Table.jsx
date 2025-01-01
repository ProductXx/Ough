import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";

const Table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

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

  const handleDelete = (member) => {
    setMemberToDelete(member);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await invoke("delete_member", { id: memberToDelete.member_id });
      setMembers((prevMembers) =>
        prevMembers.filter(
          (member) => member.member_id !== memberToDelete.member_id
        )
      );
      setShowModal(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error("Failed to delete member:", error);
    }
  };

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
      <div className="grid grid-cols-8 w-full ">
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
          National ID
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
              className="grid grid-cols-8 w-full border py-2 items-center"
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
              <div className="col-span-1 text-center p-2">
                {member.nationalId}
              </div>
              <div className="col-span-1 flex justify-center items-center">
                <Link to="/print" state={member}>
                  <div className="rounded transition duration-100 bg-yellow-300 hover:bg-yellow-400 text-center px-4 p-2">
                    Generate
                  </div>
                </Link>
                <button onClick={() => handleDelete(member)}>
                  <div className="rounded transition duration-100 bg-red-300 hover:bg-red-400 text-center px-4 p-2">
                    Delete Member
                  </div>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No members found.
          </div>
        )}
      </div>
      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Table;

const ConfirmModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete this member?</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
