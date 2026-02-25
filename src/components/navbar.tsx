'use client';

import { CreditCard, Home, LogIn, Menu, Puzzle, Rocket, X } from 'lucide-react';
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
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { data: subscription } = useQueryData(['user-subscription'], () =>
    getUserSubscription(),
  );

  // Lock body scroll when menu is open
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

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const navLinks = [
    { href: '/#home', label: 'Home', icon: Home },
    { href: '/#extension', label: 'Extension', icon: Puzzle },
    { href: '/#pricing', label: 'Pricing', icon: CreditCard },
  ];

  return (
    <header className='fixed top-0 w-full z-50 transition-all duration-300'>
      {/* Header Background */}
      <div
        className='absolute inset-0 -z-10'
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(10px)',
        }}
      />

      <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10'>
        {/* Logo */}
        <div className='flex items-center gap-2 relative z-50'>
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
              className='max-w-[110px] md:max-w-[120px]'
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!hideNavigation && (
          <nav className='hidden md:flex items-center gap-8'>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className='text-[17px] font-medium text-zinc-600 hover:text-brand-blue transition-colors'
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right Section / Actions */}
        <div className='flex items-center gap-2 sm:gap-4'>
          {/* Desktop Actions (and Mobile if hideNavigation is active) */}
          <div
            className={cn(
              'items-center gap-4',
              hideNavigation ? 'flex' : 'hidden md:flex',
            )}
          >
            {session ? (
              <UserNav user={session.user} subscription={subscription} />
            ) : (
              <>
                <Link href='/auth/sign-in'>
                  <Button
                    variant='outline'
                    className='border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue/10 hover:text-brand-blue transition-all font-medium py-2 px-4 h-10 w-auto'
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href='/auth/sign-up'>
                  <Button className='bg-brand-blue hover:bg-blue-500 rounded-lg text-white font-medium shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:-translate-y-0.5 py-2 px-4 h-10'>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          {!hideNavigation && (
            <button
              type='button'
              className='md:hidden relative z-50 p-2 -mr-2 text-zinc-600 hover:bg-gray-100 rounded-lg transition-colors'
              onClick={() => setIsOpen(!isOpen)}
              aria-label='Toggle menu'
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {!hideNavigation && (
        <>
          <button
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-300 ${
              isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            type='button'
            aria-label='Close navigation'
            onClick={() => setIsOpen(false)}
          />

          {/* Mobile Sidebar */}
          <div
            ref={sidebarRef}
            className={`fixed top-0 left-0 h-[100dvh] w-[280px] bg-white shadow-2xl z-[60] md:hidden transform transition-transform duration-300 ease-in-out flex flex-col ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Sidebar Header */}
            <div className='bg-gradient-to-br from-brand-blue to-blue-500 p-6 flex items-center justify-between shrink-0'>
              <h2 className='text-white font-bold text-xl'>Menu</h2>
              <button
                type='button'
                onClick={() => setIsOpen(false)}
                className='text-white hover:text-blue-50 transition-colors'
                aria-label='Close menu'
              >
                <X size={24} />
              </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className='py-6 flex flex-col overflow-y-auto'>
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className='flex items-center gap-4 px-6 py-4 text-zinc-700 hover:bg-gradient-to-r hover:from-brand-blue/10 hover:to-blue-500/10 hover:text-brand-blue transition-all duration-200 group border-b border-zinc-100 last:border-0'
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Icon className='text-2xl group-hover:scale-110 transition-transform duration-200 w-6 h-6' />
                    <span className='font-medium text-lg'>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className='p-6 border-t border-gray-200 bg-gray-50 mt-auto shrink-0'>
              {session ? (
                <div className='flex flex-col gap-4'>
                  <div className='flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm'>
                    <div className='flex items-center gap-3'>
                      <UserNav
                        user={session.user}
                        subscription={subscription}
                      />
                      <span className='font-medium text-gray-800'>
                        My Account
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col gap-3 mb-4'>
                  <Link
                    href='/auth/sign-in'
                    className='flex w-full items-center justify-center px-6 py-3 border border-brand-blue text-brand-blue hover:bg-brand-blue/5 text-base font-semibold rounded-lg transition-all'
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className='mr-2 h-5 w-5' />
                    Sign in
                  </Link>
                  <Link
                    href='/auth/sign-up'
                    className='flex w-full items-center justify-center px-6 py-3 bg-brand-blue hover:bg-blue-500 text-white text-base font-semibold rounded-lg transition-all shadow-md active:scale-95'
                    onClick={() => setIsOpen(false)}
                  >
                    <Rocket className='mr-2 h-5 w-5' />
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
