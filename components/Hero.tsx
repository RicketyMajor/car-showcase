import Image from 'next/image';

const Hero = () => {
  return (
    <div className="hero">
      <div className="flex-1 pt-36 padding-x">
        <h1 className="hero__title">
          Know what a car really costs to run.
        </h1>
        <p className="hero__subtitle">
          Search thousands of models by manufacturer, fuel and year, and see the
          real fuel-economy figures behind each one.
        </p>

        {/* ponytail: a plain hash link, not scrollIntoView({behavior:"smooth"}).
            Smooth scrolling is off in some browsers and profiles, and there the
            JS version silently did nothing. Add smooth back via CSS only if it
            is verified not to swallow the jump. */}
        <a
          href="#discover"
          className="custom-btn inline-flex w-fit bg-primary-blue text-white rounded-full mt-10 font-bold"
        >
          Explore Cars
        </a>
      </div>
      <div className="hero__image-container">
        <div className="hero__image">
          <Image src="/hero.png" alt="hero" fill className="object-contain" />
        </div>

        <div className="hero__image-overlay" />
      </div>
    </div>
  )
}

export default Hero