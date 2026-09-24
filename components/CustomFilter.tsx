"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

import { SEARCH_PARAM } from "@/constants";
import type { CustomFilterProps, FilterOption } from "@/types";

import { ChevronIcon } from "./icons";

const CustomFilter = ({ title, options }: CustomFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // The URL is the source of truth, so the control stays correct after a reload
  // or when the user arrives on a shared link.
  const current = searchParams.get(title) ?? "";
  const selected = options.find((option) => option.value === current) ?? options[0];

  const handleChange = (option: FilterOption) => {
    const params = new URLSearchParams(searchParams.toString());

    if (option.value) {
      params.set(title, option.value);
    } else {
      params.delete(title);
    }

    // Changing a filter invalidates the current page.
    params.delete(SEARCH_PARAM.limit);

    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-fit">
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative w-fit z-10">
          <ListboxButton className="custom-filter__btn">
            <span className="block truncate">{selected.title}</span>
            <ChevronIcon className="w-4 h-4 ml-4" />
          </ListboxButton>

          <ListboxOptions
            transition
            className="custom-filter__options transition duration-100 ease-in data-[closed]:opacity-0"
          >
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option}
                className="relative cursor-default select-none py-2 px-4 data-[focus]:bg-primary-blue data-[focus]:text-white"
              >
                {option.title}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};

export default CustomFilter;
