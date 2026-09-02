import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function LoginPage() { return <main className="mx-auto max-w-md px-5 py-16"><AuthForm mode="login" /><p className="mt-4 text-center text-sm text-slate-600">New here? <Link className="font-semibold text-accent" href="/register">Create an account</Link></p></main>; }
