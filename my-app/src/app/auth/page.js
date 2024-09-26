"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

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
      // <div className="container mx-auto p-4">
      //   <h2 className="text-2xl font-bold">Register</h2>
      //   <form onSubmit={handleRegister} className="mt-4">
      //     <div className="mb-4">
      //       <label className="block">Name</label>
      //       <input
      //         type="text"
      //         value={name}
      //         onChange={(e) => setName(e.target.value)}
      //         className="border p-2 w-full"
      //         required 
      //       />
      //     </div>
      //     <div className="mb-4">
      //       <label className="block">Email</label>
      //       <input
      //         type="email"
      //         value={email}
      //         onChange={(e) => setEmail(e.target.value)}
      //         className="border p-2 w-full"
      //         required 
      //       />
      //     </div>
      //     <div className="mb-4">
      //       <label className="block">Password</label>
      //       <input
      //         type="password"
      //         value={password}
      //         onChange={(e) => setPassword(e.target.value)}
      //         className="border p-2 w-full"
      //         required 
      //       />
      //     </div>
      //     {error && <p className="text-red-500">{error}</p>} {/* Visar felmeddelandet */}
      //     <button
      //       type="submit"
      //       className="bg-blue-500 text-white py-2 px-4"
      //       disabled={loading} 
      //     >
      //       {loading ? "Registering..." : "Register"} 
      //     </button>
      //   </form>
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