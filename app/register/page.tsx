import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function RegisterPage() { return <main className="mx-auto max-w-md px-5 py-16"><AuthForm mode="register" /><p className="mt-4 text-center text-sm text-slate-600">Already have an account? <Link className="font-semibold text-accent" href="/login">Sign in</Link></p></main>; }
