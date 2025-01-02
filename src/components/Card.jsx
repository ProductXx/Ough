import React, { useState } from "react";
import { QRCode } from "react-qr-code"; // Import QRCode from react-qr-code
import img from "../../public/idk.svg";
import mm from "../../public/images.png";
import { useLocation, useParams } from "react-router-dom";
import { convertFileSrc } from "@tauri-apps/api/core";

const Card = () => {
  const location = useLocation();
  const member = location.state;
  const qrdata = {
    member_id: member.member_id,
    name: member.name,
    address: member.address,
    birthday: member.birthday,
  };

  const [signImage, setSignImage] = useState(null); // State for storing the signature image

  const handleSignChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignImage(URL.createObjectURL(file)); // Create a URL for the uploaded file
    }
  };

  const printCard = () => {
    window.print(); // Trigger print dialog
  };

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="flex flex-col border" id="printCard">
        <div className="flex gap-2 flex-col bg-[rgb(254,250,161)] text-blue-950 p-3">
          <div className="flex gap-8 items-center ">
            <img className="w-20 h-20" src={img} alt="Myanmar Buddhist Logo" />
            <div className="text-center text-xl flex flex-col gap-1">
              <p>မြန်မာဗုဒ္ဓဘာသာဝင်များအဖွဲ့</p>
              <p>Myanmar Buddhist ID Card</p>
            </div>
            <img className="shadow-lg h-20" src={mm} alt="ID Card Logo" />
          </div>
          <p>Identification Number : {member.member_id}</p>
        </div>
        <div className="flex justify-between p-5 gap-10 text-red-800">
          <div className="flex flex-col gap-5 justify-between items-start">
            <div className="text-md">
              <p>Name (အမည်) : {member.name}</p>
              <p>Date of Birth (မွေးရပ်) : {member.birthday}</p>
              <p>Address (လိပ်စာ) : {member.address}</p>
            </div>
            <div className="flex flex-col">
              {/* Signature file input */}
              {!signImage ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignChange}
                  className="input-class"
                />
              ) : (
                <div className="flex justify-start items-center">
                  <img src={signImage} alt="Signature" className=" h-16 " />
                </div>
              )}
              <div className="flex self-start text-[12px] gap-5">
                <p>Initiator Monk</p>
                <p>Date of Issue {member.issue_date}</p>
                <p>National Id {member.nationalid}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-between items-center">
            {/* photo of data */}
            <div className="w-24 h-24">
              <img
                className=" object-cover w-full h-full "
                src={convertFileSrc(member.image)}
                alt="User Image"
              />
            </div>
            <QRCode value={JSON.stringify(qrdata)} size={50} />
          </div>
        </div>
        {/* Print button */}
        {signImage && (
          <button
            onClick={printCard}
            className="mt-4 bg-blue-500 text-white p-2 rounded"
          >
            Print Card
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
