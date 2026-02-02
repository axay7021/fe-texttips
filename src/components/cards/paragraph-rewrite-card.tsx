import ellipseCircle from '@public/ellipse-circle.png';
import extensionPic from '@public/extension-pic.png';
import whiteArrow from '@public/white-arrow.png';
import Image from 'next/image';

const ParagraphRewriteCard = () => {
  return (
    <div
      className='bg-white rounded-[30px] px-4 md:px-12 py-6 md:py-5 flex flex-col-reverse min-[1080px]:flex-row items-center justify-between relative'
      style={{
        background:
          'linear-gradient(260deg,rgba(221, 238, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)',
      }}
    >
      <div className='space-y-3 max-w-full min-[1080px]:max-w-[533px] w-full min-[1080px]:w-auto z-10'>
        <h1 className='text-2xl min-[1080px]:text-[36px] font-bold text-heading'>
          Rewrite individual paragraphs
        </h1>
        <p className='text-paragraph text-base min-[1080px]:text-[20px] font-normal'>
          With the Scribbr Paragraph Rewriter, you can easily rewrite individual
          paragraphs.
        </p>
        <ul className='list-disc list-inside text-paragraph text-base min-[1080px]:text-[20px] ml-5 mt-5'>
          <li>Create diverse headlines</li>
          <li>Rewrite an email</li>
          <li>Create unique social media captions</li>
        </ul>
      </div>
      {/* Mobile Image - Only extensionPic */}
      <div className='relative w-full flex justify-center mb-6 min-[1080px]:hidden'>
        <Image
          src={extensionPic}
          alt='Extension Picture'
          width={360}
          height={280}
          className='w-full max-w-[280px] h-auto rounded-2xl'
        />
      </div>
      {/* Desktop Images - All images */}
      <div className='relative hidden min-[1080px]:block'>
        <Image
          src={ellipseCircle}
          alt='Extension Picture'
          width={273}
          height={273}
          className='max-w-[273] w-full absolute -left-1/2 -bottom-1/2 hidden lg:block'
        />
        <Image
          src={whiteArrow}
          alt='Extension Picture'
          width={228}
          height={110}
          className='max-w-[228] w-full absolute -right-[40%] -top-[35%] hidden xl:block'
        />
        <Image
          src={extensionPic}
          alt='Extension Picture'
          width={360}
          height={280}
          className='w-[360px] h-auto max-w-[360px] rounded-2xl scale-130'
        />
      </div>
    </div>
  );
};

export default ParagraphRewriteCard;
