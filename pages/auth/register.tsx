import { useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); // Reset errors

    if (!emailRegex.test(email)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError(
        "Das Passwort muss 6 bis 20 Zeichen lang sein und mindestens eine Zahl, einen Klein- und Großbuchstaben enthalten."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    try {
      await axios.post("/api/auth/register", { email, password });
      router.push("/auth/signin"); // Redirect to sign-in page on successful registration
    } catch (error: any) {
      // Check for the email already exists error
      if (error.response && error.response.status === 409) {
        setError("Diese E-Mail-Adresse ist bereits vergeben.");
      } else {
        setError(
          error.response?.data.message ??
            "Ein unbekannter Fehler ist aufgetreten"
        );
      }
    }
  };

  return (
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
      <div>
        <label htmlFor="confirmPassword">Passwort bestätigen</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit">Registrieren</button>
    </form>
  );
}
