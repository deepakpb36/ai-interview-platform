import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth, provider } from "../firebase";

import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ======================================
  // Save User in LocalStorage
  // ======================================

  const saveUserToLocalStorage = (user) => {
    if (!user || !user.uid) {
      return;
    }

    try {
      const users =
        JSON.parse(localStorage.getItem("users")) || [];

      const userData = {
        uid: user.uid,
        displayName:
          user.displayName || "User",
        email:
          user.email || "",
        photoURL:
          user.photoURL || "",
        lastLogin:
          new Date().toISOString(),
      };

      const existingUserIndex =
        users.findIndex(
          (item) =>
            item &&
            item.uid === user.uid
        );

      if (existingUserIndex !== -1) {
        users[existingUserIndex] = {
          ...users[existingUserIndex],
          ...userData,

          createdAt:
            users[existingUserIndex].createdAt ||
            new Date().toISOString(),

          status:
            users[existingUserIndex].status ||
            "active",
        };
      } else {
        users.push({
          ...userData,

          createdAt:
            new Date().toISOString(),

          status: "active",
        });
      }

      localStorage.setItem(
        "users",
        JSON.stringify(users)
      );

      // Current user
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          uid: user.uid,
          displayName:
            user.displayName || "User",
          email:
            user.email || "",
          photoURL:
            user.photoURL || "",
        })
      );

    } catch (error) {
      console.error(
        "Unable to save user:",
        error
      );
    }
  };

  // ======================================
  // Email & Password Login
  // ======================================

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const user =
        userCredential.user;

      saveUserToLocalStorage(user);

      // IMPORTANT:
      // Dashboard navigation happens ONLY
      // after clicking OK on this alert.
      alert("Login Successful ✅");

      navigate("/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Email login error:",
        error
      );

      let message =
        "Unable to login.";

      switch (error.code) {
        case "auth/invalid-email":
          message =
            "Please enter a valid email address.";
          break;

        case "auth/user-not-found":
          message =
            "No account found with this email.";
          break;

        case "auth/wrong-password":
          message =
            "Incorrect password.";
          break;

        case "auth/invalid-credential":
          message =
            "Invalid email or password.";
          break;

        case "auth/user-disabled":
          message =
            "This account has been disabled.";
          break;

        case "auth/too-many-requests":
          message =
            "Too many login attempts. Please try again later.";
          break;

        default:
          message =
            error.message ||
            "Login failed.";
      }

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // Google Login
  // ======================================

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      const user = result.user;

      console.log(
        "Google login successful:",
        user
      );

      // Save Google user in LocalStorage
      saveUserToLocalStorage(user);

      // IMPORTANT:
      // Dashboard navigation happens ONLY
      // after clicking OK on this alert.
      alert("Google Login Successful ✅");

      navigate("/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      let message =
        "Google login failed.";

      switch (error.code) {
        case "auth/popup-closed-by-user":
          message =
            "Google login window was closed.";
          break;

        case "auth/popup-blocked":
          message =
            "Your browser blocked the Google login popup.";
          break;

        case "auth/unauthorized-domain":
          message =
            "This website domain is not authorized in Firebase.";
          break;

        case "auth/operation-not-allowed":
          message =
            "Google Sign-In is not enabled in Firebase.";
          break;

        case "auth/cancelled-popup-request":
          message =
            "Another Google login popup is already open.";
          break;

        default:
          message =
            error.message ||
            "Google login failed.";
      }

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // Forgot Password
  // ======================================

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      alert(
        "Please enter your email address first."
      );
      return;
    }

    try {
      await sendPasswordResetEmail(
        auth,
        email.trim()
      );

      alert(
        "Password reset email has been sent. Please check your inbox."
      );

    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      let message =
        "Unable to send password reset email.";

      switch (error.code) {
        case "auth/invalid-email":
          message =
            "Please enter a valid email address.";
          break;

        case "auth/user-not-found":
          message =
            "No account found with this email.";
          break;

        default:
          message =
            error.message ||
            message;
      }

      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300">

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-lg p-6 sm:p-8 transition">

        {/* Logo */}

        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Heading */}

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-6 text-center">
          Welcome Back 👋
        </h2>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 mb-8 text-center">
          Sign in to continue your AI Interview Preparation.
        </p>

        {/* Email */}

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {/* Password */}

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {/* Forgot Password */}

        <div className="flex justify-end mb-6">

          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={loading}
            className="text-sm text-blue-600 dark:text-blue-500 hover:underline font-medium disabled:opacity-50"
          >
            Forgot Password?
          </button>

        </div>

        {/* Sign In */}

        <div
          onClick={
            loading
              ? undefined
              : handleLogin
          }
          className={
            loading
              ? "opacity-60 cursor-not-allowed"
              : ""
          }
        >
          <Button
            text={
              loading
                ? "Signing In..."
                : "Sign In"
            }
          />
        </div>

        {/* Divider */}

        <div className="flex items-center my-6">

          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700"></div>

          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
            OR
          </span>

          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700"></div>

        </div>

        {/* Google Login */}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? "Connecting to Google..."
            : "Continue with Google"}
        </button>

        {/* Sign Up */}

        <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-8">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-blue-600 dark:text-blue-500 hover:underline font-semibold"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;