import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      {error === "invalid_credentials" && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Invalid email or password. You can also use the 1-Click Demo Login below.
        </div>
      )}
      <AuthForm mode="login" />
      <p className="mt-4 text-center text-sm text-slate-600">
        New here?{" "}
        <Link className="font-semibold text-accent" href="/register">
          Create an account
        </Link>
      </p>
    </main>
  );
}
