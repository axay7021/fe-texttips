import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
import { BsFacebook } from "react-icons/bs";
import { FaPinterestP } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  const links = [
    { name: "Home", href: "/" },
    { name: "Extension", href: "#" },
    { name: "Pricing", href: "#" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-brand-blue">
              TextEnhancer
            </span>
          </div>
          {/* Links */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-normal text-[#333333] hover:text-brand-blue transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex space-x-6 text-sm text-[#333333] font-normal">
            <Link href="">
              <FaInstagram size={24} />
            </Link>
            <Link href="">
              <BsFacebook size={24} />
            </Link>
            <Link href="">
              <FaPinterestP size={24} />
            </Link>
            <Link href="">
              <FaLinkedinIn size={24} />
            </Link>
          </div>
        </div>
        <hr className="border-[#333333] h-[1px] my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-sm text-[#333333]">
          <p>
            &copy; {new Date().getFullYear()} TextEnhancer. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="">Privacy Policy</Link>
            <Link href="">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
