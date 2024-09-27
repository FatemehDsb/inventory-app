"use client"; 
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("token");
    router.push("/");
  }, [router]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Logging out...</h2>
      <p>You will be redirected shortly.</p>
    </div>
  );
}