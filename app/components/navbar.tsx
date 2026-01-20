import Link from "next/link";
import { FaChevronDown } from "react-icons/fa6";
import { UserNav } from "./user-nav";

interface NavbarProps {
  session: any; // Type strictly if possible, but 'any' allows flexibility with better-auth types
}

export function Navbar({ session }: NavbarProps) {
  return (
    <nav className="relative z-10 flex items-center justify-between px-8 py-4 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-[#3c3c3c] font-bold text-xl tracking-tight">
            TextEnhancer
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8 text-[#555555] font-medium text-sm">
        <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
          Features <FaChevronDown className="text-[10px]" />
        </div>
        <Link href="#" className="hover:text-indigo-600 transition-colors">
          Plans & pricing
        </Link>
        <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
          Learn <FaChevronDown className="text-[10px]" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {session ? (
          <UserNav user={session.user} />
        ) : (
          <>
            <Link
              href="/auth/sign-in"
              className="text-[#3c3c3c] font-medium text-sm hover:text-indigo-600"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="border-2 border-indigo-600 text-indigo-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-indigo-50 transition-all active:scale-95"
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
