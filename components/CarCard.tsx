"use client";

import { useState } from 'react'
import Image from 'next/image';

import { CarProps } from '@/types';

import { calculateCarRent } from '@/utils';
import { mpgFillPercent, type MpgRange } from '@/utils/catalogue';
import CarDetails from './CarDetails';
import CarSchematic from './CarSchematic';

interface CarCardProps {
    car: CarProps;
    // The best and worst figures currently on screen. Every bar is drawn against
    // the same scale, so the grid can be compared at a glance instead of asking
    // the reader to hold absolute MPG numbers in their head.
    mpgRange: MpgRange;
}

const CarCard = ({ car, mpgRange }: CarCardProps) => {
  const { city_mpg, year, make, model, transmission, drive } = car;

  const [isOpen, setIsOpen] = useState(false);

  const carRent = calculateCarRent(city_mpg, year);

  return (
    <div className="car-card group">
        <h3 className="car-card__content-title">
            <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label={`${make} ${model} — full specifications`}
            className="car-card__open">
                {make} {model}
            </button>
        </h3>

        <p className="car-card__price">
            <span className="car-card__price-dollar">$</span>
            {carRent}
            <span className="car-card__price-day">/day</span>
        </p>

        <CarSchematic car={car} className="car-card__image" />

        <div className="car-card__mpg">
            <p className="car-card__mpg-value">
                {city_mpg}
                <span className="car-card__mpg-unit">MPG city</span>
            </p>
            <div className="car-card__mpg-track" aria-hidden="true">
                <div className="car-card__mpg-fill"
                style={{ width: `${mpgFillPercent(city_mpg, mpgRange)}%` }} />
            </div>
        </div>

        <div className="car-card__specs">
            <span className="car-card__spec">
                <Image src="/steering-wheel.svg" width={16} height={16} alt="" />
                {transmission === 'a' ? 'Automatic' : 'Manual'}
            </span>
            <span className="car-card__spec">
                <Image src="/tire.svg" width={16} height={16} alt="" />
                {drive.toUpperCase()}
            </span>
        </div>

        <CarDetails isOpen={isOpen}
        closeModal={() => setIsOpen(false)} car={car} />
    </div>
  )
}

export default CarCard
