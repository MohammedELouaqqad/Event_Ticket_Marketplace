
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiMail, CiLock } from "react-icons/ci";
import { type UserAuthenticate } from "../types/index";
import { UserContext } from "../context/UserContext";
import AuthLayout from "../Components/layout/AuthLayout";
import Input from "../Components/ui/Input";
import Button from "../Components/ui/Button";
import { saveAuth } from "../lib/auth";
import api from "../lib/api";

function Authenticate() {
  const [userAuthenticate, setUserAuthenticate] = useState<UserAuthenticate>({
    email: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const context = useContext(UserContext);
  if (!context) return null;

  const { setUserConnected } = context;
  const navigate = useNavigate();

  function authenticate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fetchAuthenticateUser = async () => {
      try {
        const response = await api.post(
          "/api/v1/auth/authenticate",
          userAuthenticate
        );
        if (response.status === 200) {
          const token = response.data.token;
          setUserConnected(response.data.user);
          saveAuth(token, response.data.user);
          navigate("/events");
        }
        console.log(response);
      } catch (error) {
        console.log(error);
        setError("Invalid email or password. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAuthenticateUser();
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <form
        onSubmit={authenticate}
        className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card"
      >
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<CiMail className="text-lg" />}
            value={userAuthenticate.email}
            onChange={(e) =>
              setUserAuthenticate({ ...userAuthenticate, email: e.target.value })
            }
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<CiLock className="text-lg" />}
            value={userAuthenticate.password}
            onChange={(e) =>
              setUserAuthenticate({ ...userAuthenticate, password: e.target.value })
            }
          />
        </div>

        <Button type="submit" loading={loading} className="mt-8 w-full" size="lg">
          Sign in
        </Button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-600 hover:text-brand-500 transition-colors"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Authenticate;
