import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, provider } from "../firebase";

import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Email & Password Login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login Successful ✅");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);

      alert("Google Login Successful ✅");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">

        <Logo />

        <h2 className="text-white text-3xl font-bold mt-8">
          Welcome Back 👋
        </h2>

        <p className="text-gray-400 mt-2 mb-8">
          Sign in to continue your interview preparation.
        </p>

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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end mb-6">
          <a
            href="#"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        <div onClick={handleLogin}>
          <Button text="Sign In" />
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-slate-700"></div>

          <span className="px-3 text-gray-400 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-slate-700"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-slate-700 py-3 rounded-lg text-white hover:bg-slate-800 transition"
        >
          Continue with Google
        </button>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:underline"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;