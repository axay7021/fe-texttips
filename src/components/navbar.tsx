'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserNav } from './user-nav';

interface NavbarProps {
  session: any;
  hideNavigation?: boolean;
  subscription?: any;
}

export function Navbar({ session, hideNavigation, subscription }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav className='fixed w-full top-2 z-50'>
      <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div
          className={cn(
            'flex items-center justify-between h-16 rounded-2xl px-4 lg:px-0 transition-all duration-300',
            isScrolled
              ? 'bg-white/30 backdrop-blur-md shadow-sm border border-gray-100/50 lg:px-6' // Scrolled state
              : 'bg-white/30 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none shadow-sm lg:shadow-none border border-gray-100/50 lg:border-none', // Initial state
          )}
        >
          <NavbarBrand />

          {/* Desktop Links */}
          {!hideNavigation && <NavbarLinks className='hidden lg:flex' />}

          {/* Desktop Actions */}
          <div className='hidden lg:block'>
            <NavbarActions session={session} subscription={subscription} />
          </div>

          {/* Mobile Menu Button */}
          <div className='lg:hidden'>
            <button
              type='button'
              ref={buttonRef}
              onClick={() => setIsOpen(!isOpen)}
              className='p-2 text-gray-600 hover:text-blue-600 transition-colors'
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          ref={menuRef}
          className='absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:hidden flex flex-col gap-6 animate-in slide-in-from-top-5 duration-200'
        >
          {!hideNavigation && (
            <div className='flex flex-col gap-4'>
              <Link
                href='/#home'
                onClick={() => setIsOpen(false)}
                className='text-lg font-medium text-[#2A2A2A] hover:text-blue-600 transition-colors'
              >
                Home
              </Link>
              <Link
                href='/#extension'
                onClick={() => setIsOpen(false)}
                className='text-lg font-medium text-[#2A2A2A] hover:text-blue-600 transition-colors'
              >
                Extension
              </Link>
              <Link
                href='/#pricing'
                onClick={() => setIsOpen(false)}
                className='text-lg font-medium text-[#2A2A2A] hover:text-blue-600 transition-colors'
              >
                Pricing
              </Link>
            </div>
          )}

          <div className='h-px bg-gray-100 w-full' />

          <div className='flex flex-col gap-3'>
            {session ? (
              <div className='flex justify-start'>
                <UserNav user={session.user} subscription={subscription} />
              </div>
            ) : (
              <>
                <Link href='/auth/sign-in' onClick={() => setIsOpen(false)}>
                  <Button
                    variant='outline'
                    className='w-full border-brand-blue text-brand-blue rounded-[8px] hover:bg-brand-blue/10 justify-center h-12 text-lg'
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href='/auth/sign-up' onClick={() => setIsOpen(false)}>
                  <Button className='w-full bg-brand-blue hover:bg-blue-400 text-white rounded-[8px] justify-center h-12 text-lg shadow-md'>
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
    <div className='flex-shrink-0 flex items-center gap-2'>
      <Link href='/' className='flex items-center gap-2 group'>
        <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center transition-transform group-hover:scale-105'>
          <span className='text-white font-bold text-lg'>T</span>
        </div>
        <span className='text-2xl font-bold text-[#2A2A2A] tracking-tight group-hover:text-blue-600 transition-colors'>
          TextTips
        </span>
      </Link>
    </div>
  );
}

export function NavbarLinks({ className }: { className?: string }) {
  const links = [
    { name: 'Home', href: '/#home' },
    { name: 'Extension', href: '/#extension' },
    { name: 'Pricing', href: '/#pricing' },
  ];

  return (
    <div className={cn('items-center justify-center flex-1 mx-8', className)}>
      <div className='flex items-center space-x-10'>
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className='text-[20px] font-medium text-[#2A2A2A] hover:text-blue-600 transition-colors font-normal'
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function NavbarActions({
  session,
  subscription,
}: {
  session: any;
  subscription?: any;
}) {
  return (
    <div className='flex items-center gap-5'>
      {session ? (
        <UserNav user={session.user} subscription={subscription} />
      ) : (
        <>
          <Link href='/auth/sign-in'>
            <Button
              variant='outline'
              className='border-brand-blue text-brand-blue rounded-[8px] hover:bg-brand-blue/10 hover:text-brand-blue transition-all font-normal py-[10px] px-[16px] h-[43px] text-lg w-auto cursor-pointer'
            >
              Sign in
            </Button>
          </Link>
          <Link href='/auth/sign-up'>
            <Button className='bg-brand-blue hover:bg-blue-400 rounded-[8px] text-white font-normal shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:-translate-y-0.5 py-[10px] h-[43px] px-[16px] text-lg cursor-pointer'>
              Get Started
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
