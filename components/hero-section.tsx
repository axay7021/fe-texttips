import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextEnhancerUI } from "./text-enhancer-ui";
import { FiArrowUpRight } from "react-icons/fi";
import { HeroBadges } from "./hero-badges";

export function HeroSection() {
  return (
    <section className="relative pt-30 px-4 text-center z-10 min-h-screen h-auto flex flex-col justify-center items-center">
      <HeroBadges />
      <div className="w-full mx-auto h-full flex flex-col justify-center items-center relative z-10">
        <div className="max-w-[806px] mx-auto flex flex-col items-center space-y-[18px]">
          <h2 className="text-brand-blue font-normal tracking-wide uppercase text-xs md:text-[26px]">
            <span className="lowercase">TextEnhancer.ai</span> makes content
            fast & easy
          </h2>
          <h1 className="text-[clamp(40px,9vw,100px)] font-bold text-heading leading-[0.9] md:leading-[1] tracking-tight">
            Rewrite content 10x faster
          </h1>
          <p className="text-paragraph text-base md:text-[20px] font-normal leading-tight">
            Give customers a structural experience they'll love and come back.{" "}
            <br />
            Join #1 app to enhance your writing.
          </p>

          <Link href="/auth/sign-in" className="mb-12">
            <Button className="bg-black hover:bg-black text-white rounded-full px-[20px]! h-[46px] text-[20px] font-medium group transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer">
              Sign In Now
              <FiArrowUpRight className="size-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-[1120px] mx-auto pt-20">
          <TextEnhancerUI />
        </div>
      </div>
    </section>
  );
}
