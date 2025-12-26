const SignInForm = ({
  handleSignIn,
  error,
  loading,
  email,
  setEmail,
  password,
  setPassword,
}: {
  handleSignIn: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
  loading: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}) => {
  return (
    <form className="space-y-4" onSubmit={handleSignIn}>
      {error && (
        <div className="rounded-md bg-red-50 p-2 text-sm text-red-500 text-center">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          required
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 focus:border-black focus:outline-none text-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input
            required
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 focus:border-black focus:outline-none text-gray-700"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-black py-2 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
};

export default SignInForm;
