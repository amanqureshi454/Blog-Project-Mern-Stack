import React from "react";
import { useForm } from "react-hook-form";
import logo from "../assets/imgs/X-logo.png";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${window.location.origin}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to create user:", errorData.message);
        return;
      }

      const result = await res.json();
      localStorage.setItem("token", result.token);
      console.log(result);
      Swal.fire({
        position: "top-center",
        background: "#000",
        color: "#fff",
        icon: "success",
        title: "Account Created Successfully",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: "dark-mode", // Apply a class for dark mode styling
          content: "dark-mode-content", // Additional class for content if needed
        },
      });
      console.log("User created successfully:");
      setTimeout(() => {
        navigate("/");
      }, 1600);
    } catch (err) {
      console.error("Error in register:", err);
    }
  };
  return (
    <>
      <div className="flex h-screen flex-1 bg-black flex-col  justify-center px-6 py-12 lg:px-8 ">
        <div className=" sm:mx-auto bg-[#1a1a1a] rounded-xl sm:w-full sm:max-w-sm">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img className="w-16 h-16 m-auto mt-6" src={logo} alt="" />
          </div>
          <h2 className="mt-3 bg-[#1a1a1a] text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Register Your Account
          </h2>
          <form
            noValidate
            className="space-y-6  rounded-md p-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
              >
                User Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  type="name"
                  className="block w-full p-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.username && (
                  <p className="text-xm text-red-700">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
              >
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
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                      message:
                        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one digit.",
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
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmpassword"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmpassword"
                  {...register("confirmpassword", {
                    required: "confirm password is not matching",
                    validate: (value, formValues) =>
                      value === formValues.password ||
                      "password is not matching",
                  })}
                  type="password"
                  required
                  className="block w-full p-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.confirmpassword && (
                  <p className="text-xm text-red-700">
                    {errors.confirmpassword.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="bg-gradient-to-r w-full from-[#434343] to-[#434343] text-white rounded-3xl  border-none px-3 lg:px-4 py-2 hover:bg-slate-600 "

                // className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
