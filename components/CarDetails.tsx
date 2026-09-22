"use client";

import { CarProps } from '@/types';
import Image from 'next/image';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import CarSchematic from './CarSchematic';

interface CarDetailsProps {
    isOpen: boolean;
    closeModal: () => void;
    car: CarProps;
}

const CarDetails = ( {isOpen, closeModal, car}: CarDetailsProps) => {
  return (
    <Dialog open={isOpen} as="div" className="relative z-10" onClose={closeModal}>
        {/* Headless UI v2 drives transitions from the component's own `transition`
            prop and data-* state, not from a <Transition.Child> wrapper. Under v1
            markup the enter classes never applied, so the panel and the backdrop
            stayed at their enterFrom opacity of 0. */}
        <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/25 transition duration-300 ease-out data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center
            justify-center p-4 text-center">
                <DialogPanel
                transition
                className="relative w-full max-w-lg max-h-[90vh]
                overflow-y-auto overscroll-contain rounded-2xl bg-white p-6 text-left
                shadow-xl flex flex-col gap-5 transition duration-300
                ease-out data-[closed]:opacity-0 data-[closed]:scale-95">
                                <button type="button"
                                aria-label="Close"
                                className="absolute top-2 right-2 z-10
                                w-fit p-2 bg-primary-blue-100
                                rounded-full"
                                onClick={closeModal}>
                                    <Image 
                                    src="/close.svg"
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                    />

                                </button>
                                
                                {/* One plate, not four. The three thumbnails
                                    asked imagin.studio for angles 29/33/13 and
                                    were handed the same image three times. */}
                                <CarSchematic
                                car={car}
                                className="w-full h-48 bg-primary-blue-100 rounded-lg p-4" />

                                <div className="flex-1 flex flex-col
                                gap-2">
                                    {/* DialogTitle, not a bare h2: Headless UI
                                        wires aria-labelledby from it, so
                                        without it the dialog is announced
                                        with no name at all. */}
                                    <DialogTitle as="h2" className="font-semibold text-xl capitalize">
                                        {car.make} {car.model}
                                    </DialogTitle>

                                    <div className="mt-3 flex flex-wrap
                                    gap-4">
                                        {Object.entries(car).map(([key, 
                                            value]) => (
                                                <div className="flex
                                                justify-between gap-5 w-full
                                                text-right" key={key}>
                                                    <span className="text-black-100/70 capitalize">{key.split("_").join(" ")}</span>
                                                    <p className="text-black-100
                                                    font-semibold">{value}</p>
                                                </div>
                                            ))}

                                    </div>

                                </div>
                </DialogPanel>
            </div>
        </div>
    </Dialog>
  )
}

export default CarDetails