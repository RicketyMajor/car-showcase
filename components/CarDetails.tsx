"use client";

import { CarProps } from '@/types';
import Image from 'next/image';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { generateCarImageUrl } from '@/utils';

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
                overflow-y-auto rounded-2xl bg-white p-6 text-left
                shadow-xl flex flex-col gap-5 transition duration-300
                ease-out data-[closed]:opacity-0 data-[closed]:scale-95">
                                <button type="button"
                                className="absolute top-2  right-2 z-10
                                w-fit p-2 bg-primary-blue-100
                                rounded-full"
                                onClick={closeModal}>
                                    <Image 
                                    src="/close.svg"
                                    alt="close"
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                    />

                                </button>
                                
                                <div className="flex-1 flex flex-col
                                gap-3">
                                    <div className="relative w-full h-40
                                    bg-pattern bg-cover bg-center
                                    rounded-lg">
                                        <Image src={generateCarImageUrl(car)}  alt="car-model" fill 
                                                    priority className="object-contain" />
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1 relative
                                        w-full h-24 bg-primary-blue-100
                                        rounded-lg">
                                            <Image src={generateCarImageUrl(car, '29')}  alt="car-model" fill 
                                                        priority className="object-contain" />
                                        </div>
                                         <div className="flex-1 relative
                                        w-full h-24 bg-primary-blue-100
                                        rounded-lg">
                                            <Image src={generateCarImageUrl(car, '33')}  alt="car-model" fill 
                                                        priority className="object-contain" />
                                        </div>
                                         <div className="flex-1 relative
                                        w-full h-24 bg-primary-blue-100
                                        rounded-lg">
                                            <Image src={generateCarImageUrl(car, '13')}  alt="car-model" fill 
                                                        priority className="object-contain" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col
                                gap-2">
                                    <h2 className="font-semibold text-xl
                                    capitalize">
                                        {car.make} {car.model}
                                    </h2>

                                    <div className="mt-3 flex flex-wrap
                                    gap-4">
                                        {Object.entries(car).map(([key, 
                                            value]) => (
                                                <div className="flex
                                                justify-between gap-5 w-full
                                                text-right" key={key}>
                                                    <h4 className="text-black-100/70
                                                    capitalize">{key.split("_").join(" ")}</h4>
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