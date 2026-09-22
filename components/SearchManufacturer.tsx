"use client";

import { Combobox, Transition } from '@headlessui/react'
import Image from 'next/image';
import { SearchManufacturerProps } from '@/types'
import { useState, Fragment } from 'react';

import { manufacturers } from '@/constants';

const SearchManufacturer = ({ manufacturer, setManufacturer }: SearchManufacturerProps) => {
  const [query, setQuery] = useState('')

  const filteredManufacturers = query === ""
    ? manufacturers
    : manufacturers.filter((item) => (
      item.toLowerCase()
        .replace(/\s+/g, "")
        .includes(query.toLowerCase().replace(/\s+/g, ""))
    ))

  return (
    <div className="search-manufacturer">
      <Combobox value={manufacturer} onChange={(value) => setManufacturer(value ?? "")}>
        <div className="relative w-full">
          <Combobox.Button className="absolute top-[14px]">
            <Image src="/car-logo.svg" width={20} height={20} className="ml-4" alt="Car Logo" />
          </Combobox.Button>

          <Combobox.Input
            className="search-manufacturer__input"
            placeholder="Volkswagen"
            displayValue={(manufacturer: string) => manufacturer}
            onChange={(e) => setQuery(e.target.value)}
          />

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="search-manufacturer__options">
              {filteredManufacturers.map((item) => (
                <Combobox.Option
                  key={item}
                  className={({ focus }) =>
                    `relative search-manufacturer__option ${focus ? 'bg-primary-blue text-white' : 'text-gray-900'}`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    // The selected entry was marked by an empty <span> - the
                    // tick icon it once held is gone, so it rendered nothing
                    // while still reserving an absolute slot and reaching for a
                    // teal that is in no palette here. The weight carries it.
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {item}
                    </span>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}

export default SearchManufacturer
