import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

const links = [
  ["Products", "/products"],
  ["Wishlist", "/wishlist"],
  ["Cart", "/cart"],
] as const;

export async function SiteHeader() {
  const user = await currentUser();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-6 px-5">
        <Link className="font-semibold tracking-tight text-xl" href="/">AgentBridge <span className="text-accent">NoAPI</span></Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          {links.map(([label, href]) => <Link key={href} className="hover:text-ink" href={href}>{label}</Link>)}
          {user ? <><Link className="hover:text-ink" href="/account">Account</Link><SignOutButton /></> : <Link className="rounded-md bg-ink px-3 py-2 text-white hover:bg-slate-700" href="/login">Sign in</Link>}
        </nav>
      </div>
    </header>
  );
}
