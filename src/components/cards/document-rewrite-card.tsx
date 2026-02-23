import ellipseCircle from '@public/ellipse-circle.png';
import heroBgPattern from '@public/hero-bg-pattern.png';
import extensionPic2 from '@public/workflow.png';
import Image from 'next/image';

const DocumentRewriteCard = () => {
  return (
    <div
      className='bg-white rounded-[30px] px-4 md:px-12 py-6 md:py-5 flex flex-col min-[1080px]:flex-row items-center justify-between relative'
      style={{
        background: 'linear-gradient(270deg, #DDEEFF 0%, #FFFFFF 100%)',
      }}
    >
      {/* Mobile Image - Only extensionPic */}
      <div className='relative w-full flex justify-center mb-6 min-[1080px]:hidden'>
        <Image
          src={extensionPic2}
          alt='Extension Picture'
          width={300}
          height={380}
          className='w-full max-w-[320px] h-auto rounded-2xl'
        />
      </div>
      {/* Desktop Images - All images */}
      <div className='relative hidden min-[1080px]:block'>
        <Image
          src={heroBgPattern}
          alt='Extension Picture'
          width={273}
          height={273}
          className='max-w-[273] w-full absolute -left-[60%] -bottom-[25%] hidden xl:block rotate-25'
        />
        <Image
          src={ellipseCircle}
          alt='Extension Picture'
          width={318}
          height={273}
          className='max-w-[318] w-full absolute -right-[45%] -top-1/2 hidden lg:block'
        />
        <Image
          src={extensionPic2}
          alt='Extension Picture'
          width={300}
          height={380}
          className='w-[300px] h-auto max-w-[300px] rounded-2xl scale-130 '
        />
      </div>

      <div className='space-y-3 max-w-full min-[1080px]:max-w-[533px] w-full min-[1080px]:w-auto z-10'>
        <p className='text-brand-blue font-bold tracking-wider text-sm uppercase'>
          Seamless Workflow
        </p>
        <h1 className='text-2xl min-[1080px]:text-[36px] font-bold text-heading'>
          Rewrite instantly with a shortcut
        </h1>
        <p className='text-paragraph text-base min-[1080px]:text-[20px] font-normal'>
          Select any text in your browser, press the ⌘ + R shortcut, and let our
          AI enhance your writing right where you are.
        </p>
        <p className='text-paragraph text-base min-[1080px]:text-[20px] font-normal'>
          No need to switch tabs or open a new window. Unlock powerful AI
          writing tools in seconds!
        </p>
      </div>
    </div>
  );
};

export default DocumentRewriteCard;
