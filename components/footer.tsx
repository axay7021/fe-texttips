import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-brand-blue">TextTips</span>
          </div>
          {/* Links */}
          <div className="flex space-x-6 text-sm text-[#333333] font-normal">
            <Link href="https://www.instagram.com/softcolon/" target="_blank">
              <FaInstagram size={24} />
            </Link>
            <Link
              href="https://www.linkedin.com/company/softcolon/"
              target="_blank"
            >
              <FaLinkedinIn size={24} />
            </Link>
          </div>
        </div>
        <hr className="border-[#333333] h-[1px] my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-sm text-[#333333]">
          <p>
            &copy; {new Date().getFullYear()} TextTips. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/privacy-policy"
              className="hover:text-brand-blue transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-brand-blue transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
