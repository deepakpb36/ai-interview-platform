import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
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
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Account Created Successfully ✅");

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    /* Responsive Light/Dark layout background wrapper wrapper */
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors duration-300">

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl transition">

        <Logo />

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-8">
          Create Account 🚀
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">
          Join AI Interview Prep and start preparing today.
        </p>

        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div onClick={handleSignup}>
          <Button text="Create Account" />
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700"></div>

          <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700"></div>
        </div>

        <Link to="/">
          <button className="w-full border border-gray-300 dark:border-slate-700 py-3 rounded-lg text-gray-750 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition font-medium">
            Already have an account? Sign In
          </button>
        </Link>

      </div>

    </div>
  );
}

export default Signup;