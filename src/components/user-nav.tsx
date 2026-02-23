'use client';

import { LogOut, Sparkles, User } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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

interface UserNavProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  subscription?: any;
}

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { AccountModal } from './modals/account-modal';

export function UserNav({ user, subscription }: UserNavProps) {
  const { handleLogout } = useAuth();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

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
              <AvatarFallback
                delayMs={600}
                className='bg-indigo-100 text-indigo-700 font-bold'
              >
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
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={() => {
                window.location.href =
                  'mailto:sales@softcolon.com?subject=Upgrade Inquiry';
              }}
            >
              <Sparkles className='mr-2 h-4 w-4 text-brand-blue' />
              <span>Contact Sales</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setIsLogoutOpen(true);
            }}
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

      <AlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <AlertDialogContent onOverlayClick={() => setIsLogoutOpen(false)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will end your current session. You will need to log in
              again to access the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='cursor-pointer'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                setIsLogoutOpen(false);
                handleLogout();
              }}
              className='bg-red-600 text-white hover:bg-red-700 cursor-pointer'
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
