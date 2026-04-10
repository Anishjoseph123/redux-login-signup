import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password regex:
  // min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const checkPasswordStrength = (pwd) => {
    let score = 0;

    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;

    if (score <= 2) return "Weak";
    if (score === 3 || score === 4) return "Medium";
    return "Strong";
  };

  // 🔹 Live validation
  useEffect(() => {
    let newErrors = {};

    if (email && !emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (password && !passwordRegex.test(password)) {
      newErrors.password =
        "Must include uppercase, lowercase, number & special character";
    }

    setErrors(newErrors);
    setStrength(password ? checkPasswordStrength(password) : "");
  }, [email, password]);

  // const handleLogin = () => {
  //   if (!validate()) return;

  //   dispatch(login({ email, password }));
  //   navigate("/dashboard");
  // };
  const handleLogin = () => {
    let newErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(login({ email, password }));
    navigate("/dashboard");
  };

  // 🔹 Strength color
  const strengthColor = {
    Weak: "bg-red-500",
    Medium: "bg-yellow-500",
    Strong: "bg-green-500",
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-300">
      <div className="bg-white p-6 rounded-[10px] shadow-xl w-100">
        <h2 className="text-xl text-center mb-4 font-bold">Login and explore our services.</h2>

        {/* Email */}
        <input
          className="w-full mb-1 p-2 border rounded"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}

        {/* Password with eye icon */}
        <div className="relative mb-1 mt-2">
          <input
            className="w-full p-2 border rounded pr-10"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-gray-500 p-1">
            Must be 8+ characters with uppercase, lowercase, number & special
            character
          </p>
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>
        )}

        {/* 🔥 Strength Meter */}
        {password && (
          <div className="mb-2">
            <div className="h-2 w-full bg-gray-200 rounded">
              <div
                className={`h-2 rounded ${strengthColor[strength]} ${
                  strength === "Weak"
                    ? "w-1/3"
                    : strength === "Medium"
                      ? "w-2/3"
                      : "w-full"
                }`}
              ></div>
            </div>
            <p className="text-xs mt-1">
              Strength: <span className="font-semibold">{strength}</span>
            </p>
          </div>
        )}
        <button
          onClick={handleLogin}
          className="uppercase cursor-pointer w-full bg-blue-700 text-white p-2 rounded-xl mt-2 hover:bg-blue-500 hover:text-black"
        >
          Login
        </button>

        <p className="mt-3 text-sm font-semibold">
          Create an account?
          <Link to="/signup" className="text-blue-700 ml-1">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
