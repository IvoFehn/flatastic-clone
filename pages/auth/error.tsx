import { useRouter } from "next/router";

const ErrorPage = () => {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div>
      <h1>Ein Fehler ist aufgetreten</h1>
      <p>{error || "Unbekannter Fehler"}</p>
      <button onClick={() => router.push("/auth/signin")}>
        Zurück zur Anmeldung
      </button>
    </div>
  );
};

export default ErrorPage;
