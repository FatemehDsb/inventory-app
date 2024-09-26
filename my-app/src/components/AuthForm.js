"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

export default function AuthForm() {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        ...(isLogin ? {} : {name}),
      }),
    });

    if (response.ok) {
      const data = await response.json();

      console.log("data", data);
      localStorage.setItem("token", data.token);
      auth.setToken(data.token);
      router.push("/items");
      
    } else {
      const errorData = await response.json();
      setError("Invalid credentials");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        {isLogin ? "Login" : "Register"} {/* Växlar rubrik mellan login/registrering */}
      </h2>
      {error && <p className="text-red-500">{error}</p>} {/* Visar felmeddelanden */}
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium">
          Email F
        </label>
        <input
          id="email" // Lagt till ett id för koppling mellan label och input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium">
          Password f
        </label>
        <input
          id="password" // Lagt till ett id för koppling mellan label och input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
          required
        />
      </div>

      {!isLogin && ( // Om användaren inte är på inloggningssidan (dvs. registreringsläge)
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name" // Lagt till ett id för koppling mellan label och input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>
      )}
      
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {isLogin ? "Login" : "Register"} {/* Växlar knapptext mellan login/registrering */}
      </button>
      
      <p className="mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"} {/* Växlar text mellan login/registrering */}
        <span
          onClick={() => setIsLogin(!isLogin)} // Växlar mellan login och registreringsläge
          className="text-blue-500 cursor-pointer"
        >
          {isLogin ? " Register" : " Login"} {/* Växlar länktext */}
        </span>
      </p>
    </form>
  );
}

