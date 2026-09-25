"use client";

import { useState } from 'react'

import { CarProps } from '@/types';

import { calculateCarRent } from '@/utils';
import { bodyProfile, driveLabel, mpgFillPercent, mpgUnit, transmissionLabel, type MpgRange } from '@/utils/catalogue';
import CarDetails from './CarDetails';
import CarSchematic from './CarSchematic';
import CarSideView from './CarSideView';
import { useCatalogueView } from './CatalogueView';
import { GearboxIcon, WheelIcon } from './icons';

interface CarCardProps {
  car: CarProps;
  // The best and worst figures on screen among the cars rated the way this one
  // is - MPG against MPG, MPGe against MPGe. The grid can then be compared at a
  // glance instead of asking the reader to hold absolute figures in their head.
  mpgRange: MpgRange;
}

const CarCard = ({ car, mpgRange }: CarCardProps) => {
  const { city_mpg, year, make, model, transmission, drive, fuel_type } = car;

  const [isOpen, setIsOpen] = useState(false);

  // The catalogue's switch turns the whole lineup; a car whose class names no
  // body keeps its plan view.
  const view = useCatalogueView();
  const profile = bodyProfile(car.class);

  const carRent = calculateCarRent(city_mpg, year);

  return (
    <div className="car-card group">
      {/* Every car on its own small stage: the same lamp and graphite as the
          hero, so the lineup reads as the configurator's model range. */}
      <div className="car-card__stage">
        {view === "side" && profile ? (
          <CarSideView key="side" car={car} profile={profile} className="w-full h-full" />
        ) : (
          <CarSchematic key="top" car={car} className="w-full h-full" />
        )}
      </div>

      <div className="car-card__body">
        <h3 className="car-card__content-title">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label={`${make} ${model} — full specifications`}
            className="car-card__open"
          >
            {make} {model}
          </button>
        </h3>

        <div className="car-card__figures">
          <div className="car-card__mpg">
            <p className="car-card__mpg-value">
              {city_mpg}
              <span className="car-card__mpg-unit">{mpgUnit(fuel_type)} city</span>
            </p>
            <div className="car-card__mpg-track" aria-hidden="true">
              <div
                className="car-card__mpg-fill"
                style={{ width: `${mpgFillPercent(city_mpg, mpgRange)}%` }}
              />
            </div>
          </div>

          <p className="car-card__price">
            <span className="car-card__price-dollar">$</span>
            {carRent}
            <span className="car-card__price-day">/day</span>
          </p>
        </div>

        <div className="car-card__specs">
          <span className="car-card__spec">
            <GearboxIcon />
            {transmissionLabel(transmission)}
          </span>
          <span className="car-card__spec">
            <WheelIcon />
            {driveLabel(drive)}
          </span>
        </div>
      </div>

      <CarDetails isOpen={isOpen} closeModal={() => setIsOpen(false)} car={car} />
    </div>
  )
}

export default CarCard
