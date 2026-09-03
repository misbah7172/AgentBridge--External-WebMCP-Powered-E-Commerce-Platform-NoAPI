import { signOutAction } from "@/app/actions";

export function SignOutButton() {
  return <form action={signOutAction}><button data-agentbridge-action="sign-out" className="rounded-md bg-ink px-3 py-2 text-white hover:bg-slate-700">Sign out</button></form>;
}
