import Link from 'next/link';

import { LogoMark } from './icons';

const Navbar = () => {
  return (
    <header className="w-full absolute z-10">
      <nav className="max-w-360 mx-auto flex justify-between items-center sm:px-16 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-chalk">
          <LogoMark />
          <span translate="no" className="type-wide text-[17px] font-bold uppercase tracking-[0.12em]">
            Milemark
          </span>
        </Link>
        {/* This catalogue has no accounts, so the one control up here points
            at the thing a visitor can actually do next: read the code. */}
        <a
          href="https://github.com/RicketyMajor/car-showcase"
          target="_blank"
          rel="noreferrer"
          className="custom-btn type-label whitespace-nowrap rounded-full border border-chalk/25 text-chalk max-sm:px-4 transition-colors hover:bg-chalk hover:text-stage"
        >
          View source
        </a>
      </nav>
    </header>
  )
}

export default Navbar
