import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/app/components/logout-button";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth/sign-in");
  }
  console.log(session);

  return (
    <div>
      <h1>surprise, surprise, it works!</h1>
      <p>name : {session.user?.name}</p>
      <p>email : {session.user?.email}</p>
      <p>verified : {session.user?.emailVerified ? "yes" : "no"}</p>
      <LogoutButton />
    </div>
  );
}
