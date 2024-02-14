// pages/auth/signin.tsx
import { useState, FormEvent } from "react";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter } from "next/router";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result: SignInResponse | undefined = await signIn<"credentials">(
      "credentials",
      {
        redirect: false,
        email,
        password,
      }
    );

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Passwort</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div>{error}</div>}
        <button type="submit">Anmelden</button>
      </form>
    </div>
  );
};

export default SignIn;
