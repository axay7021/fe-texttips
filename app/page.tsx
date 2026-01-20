import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa6";
import { Navbar } from "@/app/components/navbar";

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] relative overflow-hidden">
      {/* Background Pattern - Subtle Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Hero Background Gradient Overlay */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/50 blur-[120px] rounded-full -mr-64 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 blur-[120px] rounded-full -ml-64 -mb-32"></div>

      {/* Navbar */}
      <Navbar session={session} />

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center pt-20 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-[#1a1a1a] tracking-tight mb-6">
          Enhance: <span className="font-serif italic font-medium">Polish</span>{" "}
          <br className="hidden md:block" />
          your writing for free
        </h1>

        <p className="text-[#555555] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-medium">
          Instantly rewrite paragraphs, reword sentences,{" "}
          <br className="hidden md:block" />
          or humanize AI content with TextEnhancer.
        </p>

        <div className="flex flex-col items-center gap-3">
          <Link
            href="/auth/sign-up"
            className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0"
          >
            Get TextEnhancer for free
          </Link>
          <span className="text-[#777777] text-xs font-medium">
            No credit card required.
          </span>
        </div>

        {/* Features Grid */}
        <div className="mt-20 w-full max-w-6xl px-4 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:translate-y-[-4px] transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Smart Rewriting
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Rephrase your sentences to be clear, compelling, and authentic.
                Keep your original meaning while improving the flow.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:translate-y-[-4px] transition-all duration-300">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12h10" />
                  <path d="M9 4v16" />
                  <path d="m3 9 3 3-3 3" />
                  <path d="M14 8V7c0-1.1.9-2 2-2h6" />
                  <path d="M14 12v11" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Tone Adjustment
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Switch between casual, professional, and creative tones
                instantly to match your audience and context.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:translate-y-[-4px] transition-all duration-300">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-6 text-pink-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Concise Summaries
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Turn long paragraphs into bite-sized summaries. Get to the point
                faster without losing key information.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
