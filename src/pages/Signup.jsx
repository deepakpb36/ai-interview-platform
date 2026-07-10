import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";

function Signup() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

        <Logo />

        <h2 className="text-3xl font-bold text-white mt-8">
          Create Account 🚀
        </h2>

        <p className="text-gray-400 mt-2 mb-8">
          Join AI Interview Prep and start preparing today.
        </p>

        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
        />

        <Button text="Create Account" />

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-slate-700"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-slate-700"></div>
        </div>

        <button className="w-full border border-slate-700 py-3 rounded-lg text-white hover:bg-slate-800 transition">
          Continue with Google
        </button>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-500 hover:underline"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;