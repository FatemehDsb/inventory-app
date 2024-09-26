// app/register/page.js
//hfh
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to register");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-600">
    //   <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-md">
    //     <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">Create Account</h2>
    //     <form onSubmit={handleRegister} className="space-y-5">
    //       <div>
    //         <label className="block text-gray-700 font-semibold mb-2">Name</label>
    //         <input
    //           type="text"
    //           value={name}
    //           onChange={(e) => setName(e.target.value)}
    //           className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
    //           required
    //         />
    //       </div>
    //       <div>
    //         <label className="block text-gray-700 font-semibold mb-2">Email</label>
    //         <input
    //           type="email"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
    //           required
    //         />
    //       </div>
    //       <div>
    //         <label className="block text-gray-700 font-semibold mb-2">Password</label>
    //         <input
    //           type="password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
    //           required
    //         />
    //       </div>
    //       {error && <p className="text-red-500 text-center">{error}</p>}
    //       <button
    //         type="submit"
    //         className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-md font-semibold transition duration-300 shadow-md"
    //         disabled={loading}
    //       >
    //         {loading ? "Registering..." : "Register"}
    //       </button>
    //     </form>
    //   </div>
    // </div>


    <div className="min-h-screen flex items-center justify-center bg-gray-200">
  <div className="bg-white p-6 border border-gray-300 rounded w-80">
    <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>
    <form onSubmit={handleRegister} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      {error && <p className="text-red-600 text-center">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  </div>
</div>

  );
}
