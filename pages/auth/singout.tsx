// pages/auth/signout.tsx
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const SignOutPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      signOut({ redirect: false }).then(() => {
        router.push("/");
      });
    } else {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div>
      <p>Abmelden...</p>
    </div>
  );
};

export default SignOutPage;
