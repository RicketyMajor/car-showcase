import Link from 'next/link';
import Image from 'next/image';

import CustomButton from './CustomButton';

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
                <span className="text-[22px] font-extrabold tracking-tight">
                    Milemark
                </span>
            </Link>
            <CustomButton 
            title="Sign In"
            btnType="button"
            containerStyles="text-primary-blue
            rounded-full bg-white min-w-[130px]"
            />
        </nav>
    </header>
  )
}

export default Navbar