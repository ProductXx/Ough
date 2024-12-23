import React, { useState } from "react";
import { useForm } from "react-hook-form";

const AddMember = () => {
  const [imageName, setImageName] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
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
            minLength: { value: 6, message: "Minimum length is 6" },
            maxLength: { value: 16, message: "Maximum length is 16" },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message:
                "Username must contain only letters, numbers, and underscores",
            },
          })}
          className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
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
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
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
          type="date"
          {...register("birthday", { required: "Birthday is required" })}
          className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.birthday && (
          <p className="text-red-500 text-sm mt-1">{errors.birthday.message}</p>
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
  );
};

export default AddMember;
