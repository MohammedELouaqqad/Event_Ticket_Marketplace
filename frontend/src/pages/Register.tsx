import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiMail, CiLock, CiUser } from "react-icons/ci";
import { type UserRegister } from "../types/index";
import AuthLayout from "../Components/layout/AuthLayout";
import Input from "../Components/ui/Input";
import Button from "../Components/ui/Button";
import api from "../lib/api";

function Register() {
  const [user, setUser] = useState<UserRegister>({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log(user);

    const fetchRegisterUser = async () => {
      try {
        const response = await api.post(
          "/api/v1/auth/register",
          user
        );
        if (response.status === 200) {
          navigate("/");
        }
        console.log(response);
      } catch (error) {
        console.log(error);
        setError("Registration failed. Please check your details and try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRegisterUser();
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join TRICKER and start booking amazing events"
    >
      <form
        onSubmit={register}
        className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card"
      >
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <Input
            label="Full name"
            type="text"
            placeholder="John Doe"
            leftIcon={<CiUser className="text-lg" />}
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<CiMail className="text-lg" />}
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<CiLock className="text-lg" />}
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>

        <Button type="submit" loading={loading} className="mt-8 w-full" size="lg">
          Create account
        </Button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-semibold text-brand-600 hover:text-brand-500 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;
