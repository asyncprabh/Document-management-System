import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const res = await loginUser({ email, password });

      // ✅ Save token
      localStorage.setItem("token", res.token);

      // ✅ Decode JWT to get role
      const payload = JSON.parse(atob(res.token.split(".")[1]));

      let role =
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      // optional mapping
      if (role === "Admin") role = "TenantAdmin";

      localStorage.setItem("role", role);

      // save user if exists
      if (res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
      }

      // redirect
      navigate("/dashboard");

    } catch (err) {

      console.error(err);

      setError(err?.response?.data?.message || "Login failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">

      <div className="bg-white p-10 rounded-xl shadow-xl w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          DMS Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            className="border p-3 w-full mb-4 rounded"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            className="border p-3 w-full mb-4 rounded"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="bg-blue-600 text-white w-full p-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>

  );
}