import { motion } from 'framer-motion';
import { CheckCircle, ImagePlus, Loader2, Pencil, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authClient } from '@/lib/auth/auth-client';

interface ProfileTabProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function ProfileTab({ user: initialUser }: ProfileTabProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Maintain active synced user state for local display
  const [currentUser, setCurrentUser] = useState({
    name: initialUser.name || '',
    image: initialUser.image || '',
  });

  const [name, setName] = useState(currentUser.name);
  const [imageUrl, setImageUrl] = useState(currentUser.image);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: imageUrl.trim() || undefined,
      });

      if (error) {
        toast.error(error.message || 'Failed to update profile');
      } else {
        toast.success('Profile updated successfully');
        // Update local display state
        setCurrentUser({
          name: name.trim(),
          image: imageUrl.trim() || '',
        });
        setIsEditing(false);
        // Refresh server components to synchronize globally (e.g. Navbar)
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(currentUser.name);
    setImageUrl(currentUser.image);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-8'
    >
      {/* Avatar Section */}
      <div className='flex items-center flex-col gap-4 pb-8 border-b border-gray-100 relative'>
        <div className='relative'>
          <Avatar className='w-[80px] h-[80px] ring-4 ring-gray-50/80 shadow-sm'>
            <AvatarImage src={isEditing ? imageUrl : currentUser.image} />
            <AvatarFallback
              delayMs={600}
              className='bg-brand-blue text-white text-3xl font-medium'
            >
              {(isEditing ? name : currentUser.name).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {isEditing && (
            <label
              htmlFor='image-upload'
              className='absolute bottom-0 right-0 p-1.5 bg-brand-blue text-white rounded-full cursor-pointer hover:bg-blue-600 shadow-md transition-colors'
            >
              <ImagePlus className='w-4 h-4' />
              <input
                id='image-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleImageUpload}
                disabled={isLoading}
              />
            </label>
          )}
        </div>
        <div className='flex flex-col items-center gap-1 text-center'>
          <div className='font-semibold text-gray-900'>Profile Picture</div>
          {isEditing && (
            <p className='text-xs text-gray-500 max-w-[200px]'>
              Click the specific icon on the avatar right corner to replace
              image
            </p>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className='space-y-6 pt-2'>
        <div className='flex items-center justify-between'>
          <h4 className='text-lg font-medium text-gray-900'>
            Personal Information
          </h4>
          {!isEditing ? (
            <button
              type='button'
              onClick={() => setIsEditing(true)}
              className='flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:text-blue-700 bg-brand-blue/10 hover:bg-brand-blue/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer'
            >
              <Pencil className='w-4 h-4' />
              Edit Profile
            </button>
          ) : (
            <div className='flex items-center gap-2'>
              <button
                type='button'
                disabled={isLoading}
                onClick={handleCancel}
                className='flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50'
              >
                <X className='w-4 h-4' />
                Cancel
              </button>
              <button
                type='button'
                disabled={isLoading}
                onClick={handleSave}
                className='flex items-center gap-1.5 text-sm font-medium text-white bg-brand-blue hover:bg-blue-600 px-4 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50'
              >
                {isLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Save className='w-4 h-4' />
                )}
                Save
              </button>
            </div>
          )}
        </div>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <label
              htmlFor='display-name'
              className='text-sm font-medium text-gray-700'
            >
              Display Name
            </label>
            {isEditing ? (
              <input
                id='display-name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue bg-white transition-all text-gray-900 shadow-sm'
                placeholder='Enter display name'
                disabled={isLoading}
              />
            ) : (
              <div className='flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50/50'>
                <span className='text-gray-900 font-medium break-all'>
                  {currentUser.name}
                </span>
              </div>
            )}
          </div>

          {/* Removed the old Profile Image URL input field */}

          <div className='space-y-2'>
            <span className='text-sm font-medium text-gray-700 block'>
              Email Address
            </span>
            {isEditing ? (
              <div className='relative w-full'>
                <input
                  type='email'
                  value={initialUser.email}
                  disabled
                  className='w-full p-3 pr-28 rounded-xl border border-gray-200 bg-gray-100/80 text-gray-500 cursor-not-allowed shadow-sm focus:outline-none'
                />
                <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full text-[10px] font-semibold pointer-events-none'>
                  <CheckCircle className='w-3.5 h-3.5' />
                  Verified
                </div>
              </div>
            ) : (
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50'>
                <span className='text-gray-900 font-medium break-all'>
                  {initialUser.email}
                </span>
                <div className='flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1.5 rounded-full text-xs font-semibold shrink-0'>
                  <CheckCircle className='w-3.5 h-3.5' />
                  Verified
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
