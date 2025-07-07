import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import UserContext from "../contexts/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

export default function SignUpForm() {
  const [error, setError] = useState(null);

  const { setUser } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ mode: 'onChange',});

  const navigate = useNavigate();

  const onSubmit = async (formData) => {
  try {
    const { data: response } = await axios.post(
      `${API_URL}/users/signup`,
      formData,
      { withCredentials: true }
    );

    toast.success("User created successfully", {
      position: "bottom-right",
      autoClose: 2000,
      style: { background: "#161D2F", color: "#FFFFFF" },
      hideProgressBar: true,
    });

    setUser(response.data);
    setError(null);
    setTimeout(() => navigate("/"), 2000);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessages = error.response.data.message
          .split("; ")
          .filter((msg, index, self) => self.indexOf(msg) === index)
          .join("; ");

        toast.error(errorMessages, {
          position: "bottom-right",
          autoClose: 3000,
          style: { background: "#161D2F", color: "#FFFFFF" },
          hideProgressBar: true,
        });
      } else if (error.request) {
        toast.error("No response from server. Check your internet connection.", {
          position: "bottom-right",
          autoClose: 3000,
          style: { background: "#161D2F", color: "#FFFFFF" },
          hideProgressBar: true,
        });
      } else {
        toast.error("Something went wrong. Please try again.", {
          position: "bottom-right",
          autoClose: 3000,
          style: { background: "#161D2F", color: "#FFFFFF" },
          hideProgressBar: true,
        });
      }
    } else {
      toast.error("An unexpected error occurred.", {
        position: "bottom-right",
        autoClose: 3000,
        style: { background: "#161D2F", color: "#FFFFFF" },
        hideProgressBar: true,
      });
    }
  }
};

  return (
    <div className="flex items-center justify-center h-screen">
       <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-lg  px-8 p-16 rounded-lg"
      >
        <div>
          <label htmlFor="name" className="block text-md font-medium">
            Username
          </label>
          <input
            id="name"
            type="text"
            {...register("name",{ 
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters long",
              },
              maxLength: {
                value: 30,
                message: "Username must be at most 30 characters long",
              },
            })}
            className="mt-1  input input-bordered w-full border border-b-blue-950 rounded-md p-1"
            placeholder="Enter your username"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-md font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { 
              required: "Email is required", 
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              }
              
              
            
            })}
            className="mt-1  input input-bordered w-full border border-b-blue-950 rounded-md p-1"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-md font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { 
              required: "Password is required", 
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              validate: {
                strongPassword: (value) =>
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value) ||
                  "Password must be at least 8 characters long, one lowercase, one uppercase, one number and one special character",
              },
            })}
            className="mt-1  input input-bordered w-full border border-b-blue-950 rounded-md p-1"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-md font-medium"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === getValues("password") || "Passwords do not match", 
            })}
            className="mt-1  input input-bordered w-full border border-b-blue-950 rounded-md p-1"
            placeholder="Confirm your password"
          />

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-1/3  bg-blue-950 rounded-xl text-white py-2"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
