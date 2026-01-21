"use client";

import Link from "next/link";
import { UserNav } from "./user-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  session: any;
}

export function Navbar({ session }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-2 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 bg-white/80 backdrop-blur-md rounded-2xl lg:bg-transparent lg:backdrop-blur-none px-4 lg:px-0 shadow-sm lg:shadow-none border lg:border-none border-gray-100/50">
          <NavbarBrand />

          {/* Desktop Links */}
          <NavbarLinks className="hidden lg:flex" />

          {/* Desktop Actions */}
          <div className="hidden lg:block">
            <NavbarActions session={session} />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:hidden flex flex-col gap-6 animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-[#2A2A2A] hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-[#2A2A2A] hover:text-blue-600 transition-colors"
            >
              Extension
            </Link>
            <Link
              href="#"
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-[#2A2A2A] hover:text-blue-600 transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          <div className="flex flex-col gap-3">
            {session ? (
              <div className="flex justify-start">
                <UserNav user={session.user} />
              </div>
            ) : (
              <>
                <Link href="/auth/sign-in" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-brand-blue text-brand-blue rounded-[8px] hover:bg-brand-blue/10 justify-center h-12 text-lg"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/sign-up" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-brand-blue hover:bg-blue-400 text-white rounded-[8px] justify-center h-12 text-lg shadow-md">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavbarBrand() {
  return (
    <div className="flex-shrink-0 flex items-center gap-2">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <span className="text-2xl font-bold text-[#2A2A2A] tracking-tight group-hover:text-blue-600 transition-colors">
          TextEnhancer
        </span>
      </Link>
    </div>
  );
}

function NavbarLinks({ className }: { className?: string }) {
  const links = [
    { name: "Home", href: "/" },
    { name: "Extension", href: "#" },
    { name: "Pricing", href: "#" },
  ];

  return (
    <div className={cn("items-center justify-center flex-1 mx-8", className)}>
      <div className="flex items-center space-x-10">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-[20px] font-medium text-[#2A2A2A] hover:text-blue-600 transition-colors font-normal"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function NavbarActions({ session }: { session: any }) {
  return (
    <div className="flex items-center gap-5">
      {session ? (
        <UserNav user={session.user} />
      ) : (
        <>
          <Link href="/auth/sign-in">
            <Button
              variant="outline"
              className="border-brand-blue text-brand-blue rounded-[8px] hover:bg-brand-blue/10 hover:text-brand-blue transition-all font-normal py-[10px] px-[16px] h-[43px] text-lg w-auto cursor-pointer"
            >
              Sign in
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button className="bg-brand-blue hover:bg-blue-400 rounded-[8px] text-white font-normal shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:-translate-y-0.5 py-[10px] h-[43px] px-[16px] text-lg cursor-pointer">
              Get Started
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
