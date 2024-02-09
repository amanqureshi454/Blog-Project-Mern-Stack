import {
  ClockIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import CommentUser from "../Components/CommentUser";
import PostUser from "../Components/PostUser";

const ProfilePage = () => {
  const navigator = useNavigate();
  const [user, setUser] = useState([]);
  const token = localStorage.getItem("token");

  // State for showing posts or comments
  const [showPosts, setShowPosts] = useState(true);

  // State for editing profile
  const [editProfile, setEditProfile] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [changesSaved, setChangesSaved] = useState(false);

  const initialProfileState = {
    username: "", // Initialize with the current username
    bio: "", // Initialize with the current bio
    newPassword: "", // Initialize with an empty string
    confirmPassword: "", // Initialize with an empty string
  };
  const [updatedProfile, setUpdatedProfile] = useState(initialProfileState);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  // Define updatedProfile state variable

  // Define change handlers for each input field
  const handleUsernameChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, username: e.target.value });
  };

  const handleBioChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, bio: e.target.value });
  };

  const handleNewPasswordChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, newPassword: e.target.value });
  };

  const handleConfirmPasswordChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, confirmPassword: e.target.value });
  };
  const saveChangesHandler = async () => {
    const dataToSend = new FormData();

    // Add profileImage to the FormData object
    if (profileImage) {
      dataToSend.append("profileImage", profileImage);
    }

    try {
      // Add other profile data to the dataToSend object
      dataToSend.append("username", updatedProfile.username);
      dataToSend.append("bio", updatedProfile.bio);
      dataToSend.append("newPassword", updatedProfile.newPassword);
      dataToSend.append("confirmPassword", updatedProfile.confirmPassword);
      console.log("Data to send:", dataToSend);

      const updateReq = await fetch(`${window.location.origin}/profileUpdate`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const updatedResult = await updateReq.json();
  

      // Show Swal alert for confirmation
      Swal.fire({
        background: "#000",
        color: "#fff",
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire({ title: "Saved!", background: "#000", color: "#fff" });
          setTimeout(() => {
            editProfileHandler();
            // Set changesSaved to true to trigger useEffect
            setChangesSaved(true);
          }, 800);
          // Perform further actions if the user confirms saving changes
        } else if (result.isDenied) {
          Swal.fire({
            title: "Changes are not saved",
            background: "#000",
            color: "#fff",
          });
          // Perform further actions if the user denies saving changes
        }
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle the error appropriately
    }
  };

  useEffect(() => {
    // Function to fetch user data and posts
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        // Fetch user data
        const userResponse = await fetch(`${window.location.origin}/getUser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the 'Authorization' header
          },
        });
        const getUserData = await userResponse.json();
        setUser(getUserData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, [changesSaved]);

  // Function to toggle between showing posts and comments
  const toggleSection = (section) => {
    if (section === "posts") {
      setShowPosts(true);
    } else if (section === "comments") {
      setShowPosts(false);
    }
  };

  // Function to handle profile edit
  var editProfileHandler = () => {
    setEditProfile((edit) => !edit);
  };
  const logOutHandler = () => {
    Swal.fire({
      background: "#000",
      color: "#fff",
      title: "Do you want to logout?",
      text: "Are you sure you want to log out of your account? Click 'Logout' to proceed.",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Logout",
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Logged out",
          background: "#000",
          color: "#fff",
          icon: "success",
          text: "You have been successfully logged out.",
        });
        localStorage.removeItem("token");
        setTimeout(() => {
          navigator("/");
        }, 1600);
      } else if (result.isDenied) {
        Swal.fire({
          title: "Action cancelled",
          background: "#000",
          color: "#fff",
          icon: "info",
          text: "Logout action has been cancelled.",
        });
      }
    });
  };

  const createdAtDate = new Date(user.createdAt);

  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formattedDate = createdAtDate.toLocaleDateString("en-GB", options);

  return (
    <>
      <Navbar />
      <div className="container h-screen mx-auto my-5 lg:p-5 p-1">
        <div className="md:flex h-full no-wrap md:-mx-2 ">
          {/* Left Side */}
          <div className="w-full md:w-3/12 md:mx-2">
            {/* Profile Card */}
            {!editProfile ? (
              <div className="bg-white p-3 border-t-4 border-black">
                <div className="image overflow-hidden">
                  <label htmlFor="profileImage" className="">
                    <img
                      className="h-28 w-28 rounded-full mx-auto"
                      src={user.profileImage}
                      alt=""
                    />
                  </label>
                </div>
                <div className="edit-btn flex justify-between items-center">
                  <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                    {user.name}
                  </h1>
                  <PencilIcon
                    className="w-5 h-5 inline cursor-pointer "
                    onClick={editProfileHandler}
                  />
                </div>
                <h3 className="text-gray-600 font-lg text-semibold leading-6">
                  Bio
                </h3>
                <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                  {user.bio}
                </p>
                <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                  <li className="flex items-center py-3">
                    <span>Status</span>
                    <span className="ml-auto">
                      <span className="bg-black py-1 px-2 rounded text-white text-sm">
                        Active
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>Member since</span>
                    <span className="ml-auto">{formattedDate}</span>
                  </li>
                </ul>
                <button
                  onClick={logOutHandler}
                  className="bg-gradient-to-r from-[#434343] to-[#434343] text-white w-36 mt-4 rounded-3xl px-4 py-2 hover:bg-slate-600"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="edit-profile">
                <div className="bg-white py-3 lg:px-0 md:px-0 px-3 border-t-4 border-black">
                  <div className="image overflow-hidden">
                    <label htmlFor="profileImage" className="cursor-pointer">
                      <img
                        className="h-28 w-28 rounded-full mx-auto"
                        src={user.profileImage}
                        alt=""
                      />
                      <input
                        type="file"
                        name="file"
                        id="profileImage"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <div className="edit-btn">
                    <div className="flex w-full justify-between items-center m-1">
                      <h3 className="text-gray-600 font-lg text-semibold leading-6">
                        UserName
                      </h3>
                      <XMarkIcon
                        onClick={editProfileHandler}
                        className="w-6 h-6 text-black cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={updatedProfile.username} // Bind value to updatedProfile.username
                      onChange={handleUsernameChange}
                      className="border border-gray-300  text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5 bg-[#f1f1f1] dark:border-gray-300 dark:placeholder-black text-black dark:focus:ring-white dark:focus:border-white"
                    />
                  </div>
                  <h3 className="text-gray-600 font-lg text-semibold leading-6">
                    Bio
                  </h3>
                  <input
                    type="text"
                    value={updatedProfile.bio} // Bind value to updatedProfile.bio
                    onChange={handleBioChange}
                    className="border border-gray-300  text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5 bg-[#f1f1f1] dark:border-gray-300 dark:placeholder-black text-black dark:focus:ring-white dark:focus:border-white"
                  />
                </div>
                <div className=" flex flex-col justify-center items-start gap-3 lg:px-0 md:px-0 px-3">
                  <h3 className="text-black font-lg text-semibold leading-6">
                    Change Password
                  </h3>
                  <input
                    type="password"
                    value={updatedProfile.newPassword}
                    onChange={handleNewPasswordChange}
                    placeholder="New Password"
                    className="border border-gray-300  text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5 bg-[#f1f1f1] dark:border-gray-300 dark:placeholder-black text-black dark:focus:ring-white dark:focus:border-white"
                  />
                  <input
                    type="password"
                    value={updatedProfile.confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Confirm Password"
                    className=" border border-gray-300  text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5 bg-[#f1f1f1] dark:border-gray-300 dark:placeholder-black text-black dark:focus:ring-white dark:focus:border-white"
                  />

                  <button
                    onClick={saveChangesHandler}
                    className="bg-gradient-to-r from-[#434343] to-[#434343] text-white rounded-3xl px-4 py-2 hover:bg-slate-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            {/* End of profile card */}
          </div>
          {/* Right Side */}
          <div className="w-full md:w-9/12 lg:mx-5 mx-0 h-64">
            <div className="bg-white p-1 shadow-sm lg:mt-0 mt-4 rounded-sm">
              <div className="flex lg:mb-16 mb-8 items-center justify-around space-x-2 font-semibold text-gray-900 leading-8">
                <h2
                  className={`lg:text-4xl text-2xl text-black text-center cursor-pointer ${
                    showPosts ? "text-black" : "text-gray-500"
                  }`}
                  onClick={() => toggleSection("posts")}
                >
                  Posts
                </h2>
                <h2
                  className={`lg:text-4xl text-2xl text-black text-center cursor-pointer  ${
                    !showPosts ? "text-black" : "text-gray-500"
                  }`}
                  onClick={() => toggleSection("comments")}
                >
                  Comments
                </h2>
              </div>

              {showPosts ? <PostUser /> : <CommentUser />}
            </div>
            {/* End of about section */}
            <div className="my-4" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
