import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, provider, db } from "../firebase";

import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  // ==========================
  // Email & Password Login
  // ==========================

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // ==========================
      // Firestore User Update
      // ==========================

      const userRef = doc(db, "users", user.uid);

      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          displayName:
            user.displayName || "User",
          email: user.email,
          lastLogin: serverTimestamp(),
        });
      } else {
        await setDoc(userRef, {
          uid: user.uid,
          displayName:
            user.displayName || "User",
          email: user.email,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
      }

      // ==========================
      // Local Storage Users
      // ==========================

      const users =
        JSON.parse(localStorage.getItem("users")) || [];

      const existingUser = users.find(
        (item) => item.uid === user.uid
      );

      if (!existingUser) {
        users.push({
          uid: user.uid,
          displayName:
            user.displayName || "User",
          email: user.email,
          createdAt: new Date().toISOString(),
        });

        localStorage.setItem(
          "users",
          JSON.stringify(users)
        );
      }

      // ==========================
      // Current User
      // ==========================

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          uid: user.uid,
          displayName:
            user.displayName || "User",
          email: user.email,
        })
      );

      alert("Login Successful ✅");

      navigate("/dashboard");

    } catch (error) {
      alert(error.message);
    }
  };

  // ==========================
  // Google Login
  // ==========================

  const handleGoogleLogin = async () => {
    try {
      const result =
        await signInWithPopup(
          auth,
          provider
        );

      const user = result.user;

      // ==========================
      // Firestore User
      // ==========================

      const userRef = doc(db, "users", user.uid);

      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          displayName:
            user.displayName || "User",
          email: user.email,
          photoURL:
            user.photoURL || "",
          lastLogin: serverTimestamp(),
        });
      } else {
        await setDoc(userRef, {
          uid: user.uid,
          displayName:
            user.displayName || "User",
          email: user.email,
          photoURL:
            user.photoURL || "",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
      }

      // ==========================
      // Local Storage Users
      // ==========================

      const users =
        JSON.parse(localStorage.getItem("users")) || [];

      const existingUser = users.find(
        (item) => item.uid === user.uid
      );

      if (!existingUser) {
        users.push({
          uid: user.uid,
          displayName:
            user.displayName || "User",
          email: user.email,
          createdAt: new Date().toISOString(),
        });

        localStorage.setItem(
          "users",
          JSON.stringify(users)
        );
      }

      // ==========================
      // Current User
      // ==========================

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          uid: user.uid,
          displayName:
            user.displayName || "User",
          email: user.email,
        })
      );

      alert("Google Login Successful ✅");

      navigate("/dashboard");

    } catch (error) {
      alert(error.message);
    }
  };

  // ==========================
  // Forgot Password
  // ==========================

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email address first.");
      return;
    }

    try {
      await sendPasswordResetEmail(
        auth,
        email
      );

      alert(
        "Password reset email has been sent. Please check your inbox."
      );

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
          Welcome Back 👋
        </h2>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 mb-8 text-center">
          Sign in to continue your AI Interview Preparation.
        </p>

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
          placeholder="Enter your password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 dark:text-blue-500 hover:underline font-medium"
          >
            Forgot Password?
          </button>
        </div>

        <div onClick={handleLogin}>
          <Button text="Sign In" />
        </div>

        <div className="flex items-center my-6">

          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700"></div>

          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
            OR
          </span>

          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700"></div>

        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-white font-semibold transition"
        >
          Continue with Google
        </button>

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