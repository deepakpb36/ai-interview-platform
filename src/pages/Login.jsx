import { Link } from "react-router-dom";

import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";

function Login() {
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
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
        />

        <div className="flex justify-end mb-6">
          <a
            href="#"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        <Button text="Sign In" />

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-slate-700"></div>

          <span className="px-3 text-gray-400 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-slate-700"></div>
        </div>

        <button className="w-full border border-slate-700 py-3 rounded-lg text-white hover:bg-slate-800 transition">
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