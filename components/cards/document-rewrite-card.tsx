import Image from "next/image";
import extensionPic2 from "@/public/extension-pic-2.png";
import ellipseCircle from "@/public/ellipse-circle.png";
import whiteArrow from "@/public/white-arrow.png";
import heroBgPattern from "@/public/hero-bg-pattern.png";

const DocumentRewriteCard = () => {
  return (
    <div
      className="bg-white rounded-[30px] px-4 md:px-12 py-6 md:py-5 flex flex-col min-[1080px]:flex-row items-center justify-between relative"
      style={{
        background: "linear-gradient(270deg, #DDEEFF 0%, #FFFFFF 100%)",
      }}
    >
      {/* Mobile Image - Only extensionPic */}
      <div className="relative w-full flex justify-center mb-6 min-[1080px]:hidden">
        <Image
          src={extensionPic2}
          alt="Extension Picture"
          width={300}
          height={380}
          className="w-full max-w-[320px] h-auto rounded-2xl"
        />
      </div>
      {/* Desktop Images - All images */}
      <div className="relative hidden min-[1080px]:block">
        <Image
          src={heroBgPattern}
          alt="Extension Picture"
          width={273}
          height={273}
          className="max-w-[273] w-full absolute -left-[60%] -bottom-[25%] hidden xl:block rotate-25"
        />
        <Image
          src={ellipseCircle}
          alt="Extension Picture"
          width={318}
          height={273}
          className="max-w-[318] w-full absolute -right-[45%] -top-1/2 hidden lg:block"
        />
        <Image
          src={extensionPic2}
          alt="Extension Picture"
          width={300}
          height={380}
          className="w-[300px] h-auto max-w-[300px] rounded-2xl scale-130 "
        />
      </div>

      <div className="space-y-3 max-w-full min-[1080px]:max-w-[533px] w-full min-[1080px]:w-auto z-10">
        <h1 className="text-2xl min-[1080px]:text-[36px] font-bold text-heading">
          Rewrite an Entire Document
        </h1>
        <p className="text-paragraph text-base min-[1080px]:text-[20px] font-normal">
          Our Paragraph Rewriter is designed to handle up to 125 words per
          paragraph. Simply upload your file or paste the content in the
          provided input box.
        </p>
        <p className="text-paragraph text-base min-[1080px]:text-[20px] font-normal">
          At the click of a button, you can alter the whole paragraph to your
          preference.
        </p>
      </div>
    </div>
  );
};

export default DocumentRewriteCard;
