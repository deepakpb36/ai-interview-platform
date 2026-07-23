import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "../firebase";

import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      alert("Account Created Successfully ✅");

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300">

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-lg p-6 sm:p-8 transition">

        <div className="flex justify-center">
          <Logo />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-6 text-center">
          Create Account 🚀
        </h2>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 mb-8 text-center">
          Join AI Interview Prep and start preparing today.
        </p>

        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <div onClick={handleSignup}>

          <Button text="Create Account" />

        </div>

        <div className="flex items-center my-6">

          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700"></div>

          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
            OR
          </span>

          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700"></div>

        </div>

        <Link to="/">

          <button
            className="w-full py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-white font-semibold transition"
          >
            Already have an account? Sign In
          </button>

        </Link>

      </div>

    </div>
  );
}

export default Signup;