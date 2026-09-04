import { loginAction, registerAction, demoLoginAction } from "@/app/actions";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const action = mode === "login" ? loginAction : registerAction;
  return (
    <form
      action={action}
      data-agentbridge-form={mode}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h1 className="text-2xl font-semibold">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>

      {mode === "register" && (
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-medium">
            First name
            <input
              required
              name="firstName"
              data-agentbridge-field="firstName"
              className="mt-1 w-full rounded border p-2"
            />
          </label>
          <label className="text-sm font-medium">
            Last name
            <input
              required
              name="lastName"
              data-agentbridge-field="lastName"
              className="mt-1 w-full rounded border p-2"
            />
          </label>
        </div>
      )}

      <label className="block text-sm font-medium">
        Email
        <input
          required
          type="email"
          name="email"
          data-agentbridge-field="email"
          className="mt-1 w-full rounded border p-2"
        />
      </label>

      <label className="block text-sm font-medium">
        Password
        <input
          required
          minLength={mode === "register" ? 8 : 1}
          type="password"
          name="password"
          data-agentbridge-field="password"
          className="mt-1 w-full rounded border p-2"
        />
      </label>

      <button
        data-agentbridge-action={mode}
        className="w-full rounded bg-ink py-3 font-semibold text-white transition hover:bg-slate-800"
      >
        {mode === "login" ? "Sign in" : "Create account"}
      </button>

      {mode === "login" && (
        <>
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="bg-white px-3 text-xs font-medium uppercase tracking-wider text-slate-400">
              or quick demo access
            </span>
          </div>

          <button
            type="submit"
            formAction={demoLoginAction}
            formNoValidate
            data-agentbridge-action="demo-login"
            className="group flex w-full items-center justify-center gap-2 rounded-lg border-2 border-accent bg-accent/5 py-3 font-semibold text-accent transition hover:bg-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
          >
            <svg
              className="h-4 w-4 transition group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            1-Click Demo Login
          </button>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Demo Account Credentials:</span>
              <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                Seeded
              </span>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-700">
              <div className="rounded border border-slate-200/60 bg-white p-1.5">
                <span className="block font-sans text-[10px] text-slate-400">Email</span>
                demo@agentbridge.local
              </div>
              <div className="rounded border border-slate-200/60 bg-white p-1.5">
                <span className="block font-sans text-[10px] text-slate-400">Password</span>
                DemoPass123!
              </div>
            </div>
          </div>
        </>
      )}
    </form>
  );
}
