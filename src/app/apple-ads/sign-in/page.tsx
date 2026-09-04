import type { Metadata } from "next";
import { Wordmark } from "@/components/Wordmark";

/**
 * Sign-in for the Apple Ads guide.
 *
 * Deliberately contains no part of the guide. The middleware rewrites
 * /apple-ads here when there is no valid session, so an unauthenticated visitor
 * receives this page and nothing else — the document is a separate route that
 * never executes for them.
 *
 * A plain HTML form posting to a route handler, with no client JavaScript: it
 * works before hydration, with scripting disabled, and there is no state in the
 * browser that could be edited to fake a sign-in.
 */

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false, nocache: true },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  // Padding sits inside the min-height (border-box), so the card centres in the
  // space below the fixed site header without the page overflowing.
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-tint px-5 pb-16 pt-28">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Wordmark className="h-9 w-auto" />
        </div>

        {/* Heading and form only. The card used to explain that the page was
            restricted and name the two people who could open it, which told an
            unexpected visitor both that something worth seeing was here and
            which usernames were worth trying. */}
        <div className="mt-8 rounded-3xl bg-white p-7 shadow-soft ring-1 ring-line sm:p-8">
          <h1 className="text-[1.35rem] font-semibold text-ink">Apple Ads</h1>

          {/* Deliberately vague: naming which field was wrong tells someone
              probing whether a username exists. */}
          {error ? (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-[0.9rem] font-medium text-red-700 ring-1 ring-red-200"
            >
              Those details did not match. Please try again.
            </p>
          ) : null}

          <form method="post" action="/apple-ads/sign-in/submit" className="mt-6">
            <label htmlFor="user" className="block text-[0.85rem] font-semibold text-ink">
              Name
            </label>
            <input
              id="user"
              name="user"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              className="mt-1.5 block min-h-11 w-full rounded-xl bg-mist px-3.5 text-[0.95rem] text-ink
                         ring-1 ring-line transition-shadow placeholder:text-ink-3
                         focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />

            <label htmlFor="pass" className="mt-5 block text-[0.85rem] font-semibold text-ink">
              Password
            </label>
            <input
              id="pass"
              name="pass"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1.5 block min-h-11 w-full rounded-xl bg-mist px-3.5 text-[0.95rem] text-ink
                         ring-1 ring-line transition-shadow
                         focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />

            <button
              type="submit"
              className="brand-gradient mt-7 inline-flex min-h-11 w-full cursor-pointer items-center justify-center
                         rounded-full px-5 text-[0.95rem] font-semibold text-white
                         transition-transform duration-200 hover:-translate-y-0.5
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
            >
              Sign in
            </button>
          </form>

          {/* Below the form, not above it. It explains where you are without
              being the first thing read, and it names no one — the earlier
              version listed who had access, which told an unexpected visitor
              which usernames were worth trying. */}
          <p className="mt-6 border-t border-line pt-5 text-[0.85rem] leading-relaxed text-ink-3">
            This page is restricted. Sign in to continue.
          </p>
        </div>
      </div>
    </main>
  );
}
