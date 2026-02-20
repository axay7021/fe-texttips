import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='relative flex flex-col items-center justify-center min-h-screen px-6 py-24 bg-zinc-50 dark:bg-zinc-950 sm:py-32 lg:px-8 overflow-hidden'>
      {/* Decorative background blobs */}
      <div className='absolute inset-0 -z-10 overflow-hidden opacity-40 dark:opacity-20 pointer-events-none'>
        <div className='absolute -top-1/2 left-1/2 -translate-x-1/2 translate-y-0 h-[600px] w-[600px] sm:h-[800px] sm:w-[800px] rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 blur-[100px] sm:blur-[120px]'></div>
      </div>

      <div className='text-center z-10'>
        <p className='text-base font-semibold text-blue-600 dark:text-blue-500'>
          404
        </p>
        <h1 className='mt-4 text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-500 sm:text-7xl'>
          Page not found
        </h1>
        <p className='mt-6 text-lg font-medium text-zinc-600 dark:text-zinc-400 sm:text-xl/8 max-w-lg mx-auto'>
          Sorry, we couldn’t find the page you’re looking for. Please check the
          URL and try again.
        </p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <Link
            href='/'
            className='rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5'
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
