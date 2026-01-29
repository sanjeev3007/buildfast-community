import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 text-white">
      <p className="text-neutral-400">Sign-in failed. Please try again.</p>
      <Link href="/" className="text-sm underline underline-offset-2 hover:text-neutral-300">
        Back to home
      </Link>
    </div>
  );
}
