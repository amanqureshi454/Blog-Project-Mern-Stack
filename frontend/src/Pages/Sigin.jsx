import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import logo from "../assets/imgs/X-logo.png";
import Swal from "sweetalert2/dist/sweetalert2.js";
// import "sweetalert2/src/sweetalert2.scss";

const Signin = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${window.location.origin}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      // console.log(result);

      if (res.ok) {
        localStorage.setItem("token", result.token);
        console.log("Login");
        Swal.fire({
          position: "top-center",
          background: "#000",
          color: "#fff",
          icon: "success",
          title: "Login Successful",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: "dark-mode", // Apply a class for dark mode styling
            content: "dark-mode-content", // Additional class for content if needed
          },
        });
        setTimeout(() => {
          navigate("/");
        }, 1600);
      } else {
        console.error("Failed to login:");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    } catch (err) {
      console.log(err + "error in login");
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-black flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-[#1a1a1a] rounded-lg">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img className="w-16 h-16 m-auto mt-6" src={logo} alt="" />
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
              Sign in to your account
            </h2>
          </div>
          <form
            noValidate
            className="space-y-3 rounded-md p-6 pb-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
              >
                {/* <MailIcon className="w-5 h-5 mr-2" /> */}
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /@/,
                      message: "Email Is Not Valid",
                    },
                  })}
                  type="email"
                  className="block w-full p-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.email && (
                  <p className="text-xm text-red-700">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {/* <KeyIcon className="w-5 h-5 mr-2" /> */}
                  Password
                </label>
                {/* <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                      message: "Wrong Password ",
                    },
                  })}
                  type="password"
                  className="block w-full p-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.password && (
                  <p className="text-xm text-red-700">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="">
              <button
                type="submit"
                className="bg-gradient-to-r w-full from-[#434343] to-[#434343] text-white rounded-3xl mt-3  border-none px-3 lg:px-4 py-2 hover:bg-slate-600 "
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mb-4 text-center text-sm text-gray-500">
            Create a new
            <Link
              to="/register"
              className="font-semibold leading-6 m-1 text-gray-300 hover:text-gray-500"
            >
              account ?
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signin;
