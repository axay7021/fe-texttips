'use client';

import { LogOut, Sparkles, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';

interface UserNavProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  subscription?: any;
}

import { useState } from 'react';
import { AccountModal } from './modals/account-modal';

// ... existing code ...

export function UserNav({ user, subscription }: UserNavProps) {
  const router = useRouter();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/auth/sign-in');
          router.refresh();
        },
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='relative h-10 w-10 rounded-full cursor-pointer'
          >
            <Avatar className='h-10 w-10 border border-gray-200'>
              <AvatarImage src={user.image || ''} alt={user.name} />
              <AvatarFallback className='bg-indigo-100 text-indigo-700 font-bold'>
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>{user.name}</p>
              <p className='text-xs leading-none text-muted-foreground'>
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={() => setIsAccountOpen(true)}
            >
              <User className='mr-2 h-4 w-4' />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer' asChild>
              <Link
                href='/dashboard/upgrade'
                className='flex items-center w-full'
              >
                <Sparkles className='mr-2 h-4 w-4 text-brand-blue' />
                <span>Upgrade</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className='cursor-pointer text-red-600 focus:text-red-600'
          >
            <LogOut className='mr-2 h-4 w-4' />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        subscription={subscription}
      />
    </>
  );
}
