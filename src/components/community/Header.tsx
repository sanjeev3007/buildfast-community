import React from 'react'

export default function Header() {
  return (
    <header className="mb-24 flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <span className="block text-[0.625rem] font-extrabold uppercase tracking-[0.4em] text-neutral-500">Public Journal</span>
        <div className="h-px flex-1 bg-neutral-900" />
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.8] tracking-[-0.025em] text-white">
          BUILD
          <br />
          FAST.
        </h1>
        <p className="max-w-[42rem] text-lg font-light leading-relaxed text-neutral-500 md:text-xl">
          A curated intelligence feed for engineers, founders, and designers building the
          future with AI.
        </p>
      </div>
    </header>
  )
}
