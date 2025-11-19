"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) setLoggedIn(true);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">MLMS</h1>
      <ul className="flex gap-6">
        <Link href="/">Dashboard</Link>
        <Link href="/clients">Clients</Link>
        <Link href="/loans">Loans</Link>
        <Link href="/installments">Installments</Link>

        {loggedIn ? (
          <button onClick={logout} className="text-red-600 font-semibold">
            Logout
          </button>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </ul>
    </nav>
  );
}
