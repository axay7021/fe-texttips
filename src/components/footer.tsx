import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='bg-white border-t border-gray-100 mt-auto'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 pb-12'>
        {/* Top Section */}
        <div className='flex flex-row justify-between items-center gap-6'>
          <div className='shrink-0 flex items-center'>
            <Link href='/' className='flex items-center gap-2 group'>
              <Image
                src='/logo.png'
                alt='Logo'
                width={180}
                height={100}
                className='w-auto h-12 md:h-14 object-contain'
                priority
              />
            </Link>
          </div>
          {/* Social Links */}
          <div className='flex items-center space-x-6 text-[#333333]'>
            <Link href='https://www.instagram.com/softcolon/' target='_blank'>
              <FaInstagram
                size={24}
                className='hover:text-brand-blue transition-colors hover:scale-110 transform'
              />
            </Link>
            <Link
              href='https://www.linkedin.com/company/softcolon/'
              target='_blank'
            >
              <FaLinkedinIn
                size={24}
                className='hover:text-brand-blue transition-colors hover:scale-110 transform'
              />
            </Link>
          </div>
        </div>

        <hr className='border-gray-200 h-[1px] my-8' />

        {/* Bottom Section */}
        <div className='flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left text-sm text-gray-500'>
          <p className='shrink-0'>
            &copy; {new Date().getFullYear()} TextTips. All rights reserved.
          </p>

          <p className='text-gray-400 shrink-0'>
            Made by{' '}
            <Link
              href='https://www.softcolon.com/'
              target='_blank'
              className='font-semibold text-gray-600 hover:text-brand-blue transition-colors'
            >
              Softcolon
            </Link>
          </p>

          <div className='flex flex-wrap items-center justify-center gap-x-6 gap-y-2 shrink-0'>
            <Link
              href='/privacy-policy'
              className='hover:text-brand-blue transition-colors font-medium'
            >
              Privacy Policy
            </Link>
            <Link
              href='/terms-of-service'
              className='hover:text-brand-blue transition-colors font-medium'
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
