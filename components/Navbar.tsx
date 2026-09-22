import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <header className="w-full absolute z-10">
        <nav className="max-w-360 mx-auto
        flex justify-between items-center
        sm:px-16 px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
                <Image
                src="/car-logo.svg"
                alt=""
                width={26}
                height={26}
                className="object-contain"
                />
                <span translate="no" className="text-[22px] font-extrabold tracking-tight">
                    Milemark
                </span>
            </Link>
            {/* This catalogue has no accounts, so the one control up here points
                at the thing a visitor can actually do next: read the code. */}
            <a
              href="https://github.com/RicketyMajor/car-showcase"
              target="_blank"
              rel="noreferrer"
              className="custom-btn text-primary-blue rounded-full bg-white min-w-[130px] font-semibold"
            >
              View source
            </a>
        </nav>
    </header>
  )
}

export default Navbar