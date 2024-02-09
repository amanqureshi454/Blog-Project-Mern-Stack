import React, { useEffect, useState } from "react";
import {
  Bars3CenterLeftIcon,
  BellIcon,
  XMarkIcon,
  ShoppingCartIcon,
  PencilSquareIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import logo from "../assets/imgs/X-logo.png";
// import { isAuthenticated } from "../auth/auth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState([]);
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  useEffect(() => {
    const fetchUser = async () => {
      const userResponse = await fetch(`${window.location.origin}/getUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the 'Authorization' header
        },
      });
      const getUserData = await userResponse.json();
      setUser(getUserData.data);
    };
    fetchUser();
  }, []);
  return (
    <>
      <div className="container-fluid lg:px-32 bg-black ">
        <div className="row">
          <nav className="flex justify-between items-center lg:p-5 p-3">
            <Link to="/" className="logo">
              <img className="w-16 h-16" src={logo} alt="" />
            </Link>
            <div className="bts-links flex justify-center items-center gap-4">
              {isAuthenticated ? (
                <Link to="/createpost">
                  <button className="flex items-center bg-gradient-to-r from-[#434343] to-[#434343] text-white rounded-3xl w-24 border-none px-3 lg:px-4 py-2 hover:bg-slate-600  ">
                    <PencilSquareIcon className="w-6 h-5 mr-1 " />
                    Write
                  </button>
                </Link>
              ) : (
                ""
              )}
              {isAuthenticated ? (
                <Link to="/profile">
                  <button>
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.profileImage}
                      alt=""
                    />
                  </button>
                </Link>
              ) : (
                ""
              )}
              {isAuthenticated ? (
                " "
              ) : (
                <Link to="/login">
                  <button className="bg-gradient-to-r from-[#434343] to-[#434343] text-white rounded-3xl w-24 border-none px-3 lg:px-4 py-2 hover:bg-slate-600  ">
                    Login
                  </button>
                </Link>
              )}
              {isAuthenticated ? (
                ""
              ) : (
                <Link to="/register">
                  <button className=" bg-gradient-to-r from-[#f1f1f1] to-[#f1f1f1]  text-black rounded-3xl w-24 border-gray-200 px-3 lg:px-4 py-2  hover:text-black ">
                    Register
                  </button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
