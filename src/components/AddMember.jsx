
import { invoke } from "@tauri-apps/api/core";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const AddMember = () => {
  const [imageName, setImageName] = useState("");
  const [imageData, setImageData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const Data = {
      name: data.username,
      address: data.address,
      birthday: data.birthday,
      region: data.region,
      nationalid: data.nationalid,
    };
    console.log(data);
    try {
      console.log(imageData);
      console.log({ content: Data, bytes: imageData, img_name: imageName });
      const resp = await invoke("add_member", {
        content: Data,
        imgbytes: Array.from(imageData),
        imgname: imageName,
      });
      console.log(resp);
      reset();
      setImageName("");
      setImageData(null);
      setImagePreview(null);
      nav("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      setImagePreview(URL.createObjectURL(file));

      const reader = new FileReader();

      // Use ArrayBuffer for better efficiency
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);

        // Send file as binary arrayBuffer

        setImageData(uint8Array);
        console.log(uint8Array);
      };

      reader.readAsArrayBuffer(file); // Read file as binary buffer
    }
  };

  return (
    <div>
      <div className="flex justify-start mx-10 m-1">
        <button
          onClick={() => nav("/")}
          className="bg-gray-200 px-5 py-2 font-bold rounded-lg"
        >
          Back
        </button>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6"
      >
        {/* Image Upload */}
        <div>
          <label
            htmlFor="image"
            className="block text-lg font-medium text-gray-700"
          >
            Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            {...register("image", {
              required: "Image is required",
            })}
            onChange={handleImageChange}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
          )}

          {imagePreview && (
            <div className="mt-4">
              <strong className="text-gray-700">Uploaded Image:</strong>
              <img
                src={imagePreview}
                alt="Uploaded"
                className="mt-2 w-full h-auto rounded-md border border-gray-300 shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-lg font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register("username", {
              required: "Username is required",
            })}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-lg font-medium text-gray-700"
          >
            Address
          </label>
          <input
            id="address"
            type="text"
            {...register("address", {
              required: "Address is required",
              maxLength: { value: 255, message: "Address is too long" },
            })}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Birthday */}
        <div>
          <label
            htmlFor="birthday"
            className="block text-lg font-medium text-gray-700"
          >
            Birthday
          </label>
          <input
            id="birthday"
            type="text"
            {...register("birthday", { required: "Birthday is required" })}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.birthday && (
            <p className="text-red-500 text-sm mt-1">
              {errors.birthday.message}
            </p>
          )}
        </div>

        {/* Region */}
        <div>
          <label
            htmlFor="region"
            className="block text-lg font-medium text-gray-700"
          >
            Region
          </label>
          <input
            id="region"
            type="text"
            {...register("region", {
              required: "Region is required",
              maxLength: { value: 100, message: "Region is too long" },
            })}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.region && (
            <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>
          )}
        </div>

        {/* National ID */}
        <div>
          <label
            htmlFor="nationalid"
            className="block text-lg font-medium text-gray-700"
          >
            National ID
          </label>
          <input
            id="nationalid"
            type="text"
            {...register("nationalid", {
              required: "National ID is required",
            })}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.nationalid && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nationalid.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddMember;

