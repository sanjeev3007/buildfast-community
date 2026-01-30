import { notFound } from 'next/navigation';
import { getTextPostBySlug } from '@/actions/text-posts.actions';
import Navbar from '@/components/community/navbar';
import TextPostDetail from '@/app/(main)/community/posts/_components/text-post-detail';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface TextPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TextPostPage({ params }: TextPostPageProps) {
  const { slug } = await params;

  if (!slug || slug.trim() === "") {
    notFound();
  }

  const result = await getTextPostBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-16 md:py-20">
        <Link
          href="/community"
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Community
        </Link>

        <TextPostDetail post={result.data} />

        <footer className="mt-32 flex flex-col items-center justify-between gap-8 border-t border-neutral-800 py-12 sm:flex-row">
          <div className="text-[0.625rem] font-extrabold uppercase tracking-[0.3em] text-neutral-400">
            BuildFastWithAI &copy; {new Date().getFullYear()}
          </div>
          <div className="flex gap-8 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-neutral-500">
            <a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm transition-colors hover:text-white">
              Twitter
            </a>
            <a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm transition-colors hover:text-white">
              GitHub
            </a>
            <a
              href="mailto:hello@buildfastwithai.com"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm transition-colors hover:text-white"
            >
              Email
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
