import { signUpAction } from "../../actions";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-black">
          Create Account
        </h1>

        <form className="space-y-4" action={signUpAction}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              required
              name="name"
              className="mt-1 w-full rounded-md border px-3 py-2 text-gray-700 focus:border-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              name="email"
              className="mt-1 w-full rounded-md border px-3 py-2 text-gray-700 focus:border-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              name="password"
              className="mt-1 w-full rounded-md border px-3 py-2 text-gray-700 focus:border-black focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-black py-2 text-white hover:bg-gray-800"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/sign-in" className="font-medium text-black underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
