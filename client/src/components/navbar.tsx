"use client";
import { getToken } from "@/services/token";
import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname,useRouter } from 'next/navigation'


export default function Navbar() {
    const  token = getToken();
    const pathname = usePathname();
    const router = useRouter();
    const handleLogout = () => {
        Cookies.remove("authToken");
       window.location.href = "/";
    }
    const linkClass = (path: string) =>
        `hover:underline ${pathname === path ? "text-blue-400" : "text-white"}`;
    console.log("pathname",pathname)
    return (
    <header className="bg-gray-800 text-white p-4">
    <nav className="container mx-auto flex justify-between items-center">
      <div className="text-xl font-bold">MyApp</div>
      <ul className="flex space-x-6">
        <li>
          <Link href="/" className={linkClass("/")}>Home</Link>
        </li>
        {token ? (
          <li>
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link href="/login" className={linkClass("/login")}>Login</Link>
            </li>
            <li>
              <Link href="/register" className={linkClass("/register")}>Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  </header>
    )
}