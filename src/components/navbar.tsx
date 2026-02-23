'use client';

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getUserSubscription } from '@/app/actions/subscription';
import { Button } from '@/components/ui/button';
import { useQueryData } from '@/hooks/useQueryData';
import { cn } from '@/lib/utils';
import { UserNav } from './user-nav';

interface NavbarProps {
  session: any;
  hideNavigation?: boolean;
}

export function Navbar({ session, hideNavigation }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { data: subscription } = useQueryData(['user-subscription'], () =>
    getUserSubscription(),
  );

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
            'flex items-center justify-between h-20 rounded-2xl px-4 lg:px-0 transition-all duration-300',
            isScrolled
              ? 'bg-white/50 backdrop-blur-xl shadow-sm border border-gray-100/50 lg:px-6' // Scrolled state
              : 'bg-white/30 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none shadow-sm lg:shadow-none border border-gray-100/50 lg:border-none', // Initial state
          )}
        >
          <NavbarBrand />

          {/* Desktop Links */}
          {!hideNavigation && <NavbarLinks className='hidden lg:flex' />}

          {/* Right Section / Actions */}
          <div className='flex items-center gap-2 sm:gap-4'>
            {/* Desktop Actions (and Mobile if hideNavigation is active) */}
            <div className={cn(hideNavigation ? 'block' : 'hidden lg:block')}>
              <NavbarActions session={session} subscription={subscription} />
            </div>

            {/* Mobile Menu Button - Only show if we actually have navigation links to toggle */}
            {!hideNavigation && (
              <div className='lg:hidden'>
                <button
                  type='button'
                  ref={buttonRef}
                  onClick={() => setIsOpen(!isOpen)}
                  className='p-2 text-gray-700 hover:text-blue-600 transition-colors bg-white/50 hover:bg-gray-100/80 rounded-lg shadow-sm backdrop-blur-md'
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && !hideNavigation && (
        <div
          ref={menuRef}
          className='absolute top-24 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/60 p-6 lg:hidden flex flex-col gap-6 animate-in slide-in-from-top-5 duration-200 z-50'
        >
          <div className='flex flex-col gap-4'>
            <Link
              href='/#home'
              onClick={() => setIsOpen(false)}
              className='text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors'
            >
              Home
            </Link>
            <Link
              href='/#extension'
              onClick={() => setIsOpen(false)}
              className='text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors'
            >
              Extension
            </Link>
            <Link
              href='/#pricing'
              onClick={() => setIsOpen(false)}
              className='text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors'
            >
              Pricing
            </Link>
          </div>

          <div className='h-px bg-gray-200 w-full' />

          <div className='flex flex-col gap-3'>
            {session ? (
              <div className='flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100'>
                <div className='flex items-center gap-3'>
                  <UserNav user={session.user} subscription={subscription} />
                  <span className='font-medium text-gray-800'>My Account</span>
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-3'>
                <Link href='/auth/sign-in' onClick={() => setIsOpen(false)}>
                  <Button
                    variant='outline'
                    className='w-full border-brand-blue text-brand-blue rounded-xl hover:bg-brand-blue/10 justify-center h-12 text-lg font-medium'
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href='/auth/sign-up' onClick={() => setIsOpen(false)}>
                  <Button className='w-full bg-brand-blue hover:bg-blue-500 text-white rounded-xl shadow-md justify-center h-12 text-lg font-medium'>
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavbarBrand() {
  return (
    <div className='shrink-0 flex items-center gap-2'>
      <Link
        href='/'
        onClick={(e) => {
          e.preventDefault();
          window.location.href = '/';
        }}
        className='flex items-center gap-2 group'
      >
        <Image
          src='/logo.png'
          alt='Logo'
          width={180}
          height={100}
          className='max-w-[60%]'
        />
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
            className='text-[20px]  text-[#2A2A2A] hover:text-blue-600 transition-colors font-normal'
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
