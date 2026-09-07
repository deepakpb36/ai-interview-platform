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
  const [loading, setLoading] = useState(false);

  // Save user information in localStorage
  const saveUserToLocalStorage = (user) => {
    if (!user || !user.uid) return;

    try {
      const users =
        JSON.parse(localStorage.getItem("users")) || [];

      const now = new Date().toISOString();

      const userData = {
        uid: user.uid,
        displayName: user.displayName || name.trim() || "User",
        email: user.email || email.trim(),
        photoURL: user.photoURL || "",
        createdAt: now,
        lastLogin: now,
        status: "active",
      };

      const existingUserIndex = users.findIndex(
        (item) => item && item.uid === user.uid
      );

      if (existingUserIndex !== -1) {
        users[existingUserIndex] = {
          ...users[existingUserIndex],
          ...userData,
        };
      } else {
        users.push(userData);
      }

      localStorage.setItem(
        "users",
        JSON.stringify(users)
      );

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          uid: user.uid,
          displayName:
            user.displayName || name.trim() || "User",
          email: user.email || email.trim(),
          photoURL: user.photoURL || "",
        })
      );
    } catch (error) {
      console.error(
        "Unable to save user to localStorage:",
        error
      );
    }
  };

  const handleSignup = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check empty fields
    if (
      !cleanName ||
      !cleanEmail ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Firebase requires at least 6 characters
    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters long."
      );
      return;
    }

    try {
      setLoading(true);

      // Create Firebase Authentication account
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      const user = userCredential.user;

      // Add user's name to Firebase Authentication profile
      await updateProfile(user, {
        displayName: cleanName,
      });

      // Save user information locally
      saveUserToLocalStorage({
        ...user,
        displayName: cleanName,
      });

      // Success message stays until user clicks OK
      alert("Account Created Successfully ✅");

      // Navigate only after OK is clicked
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Signup error:", error);

      let message = "Unable to create account.";

      switch (error.code) {
        case "auth/email-already-in-use":
          message =
            "An account already exists with this email.";
          break;

        case "auth/invalid-email":
          message =
            "Please enter a valid email address.";
          break;

        case "auth/weak-password":
          message =
            "Password is too weak. Please use a stronger password.";
          break;

        case "auth/operation-not-allowed":
          message =
            "Email/Password authentication is not enabled in Firebase.";
          break;

        case "auth/network-request-failed":
          message =
            "Network error. Please check your internet connection.";
          break;

        case "auth/too-many-requests":
          message =
            "Too many requests. Please try again later.";
          break;

        default:
          message =
            error.message ||
            "Account creation failed.";
      }

      alert(message);
    } finally {
      setLoading(false);
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

        <div
          onClick={
            loading
              ? undefined
              : handleSignup
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
                ? "Creating Account..."
                : "Create Account"
            }
          />
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
            type="button"
            disabled={loading}
            className="w-full py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Already have an account? Sign In
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Signup;