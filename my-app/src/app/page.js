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

    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0" }}>
    <div style={{ backgroundColor: "#fff", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", width: "300px", textAlign: "center" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
      Welcome to Inventory App
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={() => router.push("/auth/register")}
          style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          REGISTER
        </button>

        {token ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={() => router.push("/items")}
              style={{ width: "100%", padding: "10px", backgroundColor: "#6610f2", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              ITEMS
            </button>

            <button
              onClick={handleLogout}
              style={{ width: "100%", padding: "10px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              LOG OUT
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/auth/login")}
            style={{ width: "100%", padding: "10px", backgroundColor: "#fd7e14", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            LOGIN
          </button>
        )}
      </div>
    </div>
  </div>




  );
}
