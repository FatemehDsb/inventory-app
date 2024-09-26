// app/page.js
"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

export default function Home() {
  const { token, logout } = useAuth() || {};
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-600">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-md">
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-8">
          Fatemeh Inventory App
        </h1>

        <div className="space-y-5">
          <button
            onClick={() => router.push("/auth/register")}
            className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-3 rounded-md transition duration-300 shadow-md"
          >
            REGISTER
          </button>

          {token ? (
            <div className="flex flex-col space-y-5">
              <button
                onClick={() => router.push("/items")}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-md transition duration-300 shadow-md"
              >
                ITEMS
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-400 text-white font-semibold py-3 rounded-md transition duration-300 shadow-md"
              >
                LOG OUT
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 rounded-md transition duration-300 shadow-md"
            >
              LOGIN
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
