import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-2">
      <Link
        href="/"
        className="font-extrabold text-indigo-600 text-xl tracking-tight"
      >
        DreamWay
      </Link>

      {/* Links (hidden on mobile, flex on md+) */}
      <div className="md:flex gap-6 text-gray-700 font-medium">
        <Link href="/service" className="hover:text-indigo-600 transition">
          Service
        </Link>
        <Link href="/signup" className="hover:text-indigo-600 transition">
          Sign up
        </Link>
        <Link href="/contact" className="hover:text-indigo-600 transition">
          Contact
        </Link>
        <Link href="/login" className="hover:text-indigo-600 transition">
          Login
        </Link>
      </div>

      {/* Call to Action */}
      <Button className="rounded-full px-6 bg-indigo-600 hover:bg-indigo-700">
        Get Started!
      </Button>
    </nav>
  );
}
