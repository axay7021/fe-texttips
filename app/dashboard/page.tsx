import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/app/components/navbar";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] relative overflow-hidden">
      {/* Background Pattern */}
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

      <Navbar session={session} />

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-10 pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2 flex items-center gap-3">
            <span>🚀</span>
            <span>Dashboard</span>
          </h1>
          <p className="text-[#555] text-lg">
            Manage your account and settings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-[#333] mb-4">
              Welcome, {session.user?.name || session.user?.email}!
            </h3>
            <p className="text-[#666] mb-6 leading-relaxed">
              Your AI Assistant is ready to help you write better.
            </p>
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <p className="text-indigo-900 text-sm font-medium">
                💡 <span className="font-bold">Tip:</span> Press{" "}
                <strong className="text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-200 mx-1">
                  Alt+S
                </strong>{" "}
                (or configured shortcut) on any website to enhance text
                instantly.
              </p>
            </div>
          </div>

          {/* Account Details Card */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100">
            <h4 className="text-xl font-bold text-[#333] mb-6">
              Account Details
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-[#888] font-medium">Email</span>
                <span className="text-[#333] font-semibold">
                  {session.user?.email}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-[#888] font-medium">Status</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-[#888] font-medium">User ID</span>
                <span className="text-[#333] font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                  {session.user?.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
