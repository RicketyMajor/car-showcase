"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import SearchManufacturer from "./SearchManufacturer";

import Image from "next/image";

import { SEARCH_PARAM } from "@/constants";

const SearchButton = ({ otherClasses }: { otherClasses: string }) => (
  <button type="submit" className={`-ml-3 z-10 ${otherClasses}`}>
    <Image
      src="/magnifying-glass.svg"
      alt="magnifying glass"
      width={40}
      height={40}
      className="object-contain"
    />
  </button>
)

const SearchBar = () => {
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (manufacturer === '' && model === '') {
      return setError('Enter a manufacturer or a model to search.');
    }

    setError('');

    updateSearchParams(model.toLowerCase(), manufacturer.toLowerCase())
  }

  const updateSearchParams = (model: string, manufacturer: string) => {
    const searchParams = new URLSearchParams(window.location.search);

    if (model) {
      searchParams.set(SEARCH_PARAM.model, model);
    } else {
      searchParams.delete(SEARCH_PARAM.model);
    }

    if (manufacturer) {
      searchParams.set(SEARCH_PARAM.manufacturer, manufacturer);
    } else {
      searchParams.delete(SEARCH_PARAM.manufacturer);
    }

    // A new search starts from the first page.
    searchParams.delete(SEARCH_PARAM.limit);

    router.push(`${window.location.pathname}?${searchParams.toString()}`);
  }

  return (
    <form className="searchbar" onSubmit={handleSearch}>
      <div className="searchbar__item">
        <SearchManufacturer manufacturer={manufacturer} setManufacturer={setManufacturer} />
        <SearchButton otherClasses="sm:hidden" />
      </div>
      <div className="searchbar__item">
        <Image
          src="/model-icon.png"
          width={25}
          height={25}
          className="absolute w-[20px] h-[20px] ml-4"
          alt="car model"
        />
        <input
          type="text"
          name="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Tiguan"
          className="searchbar__input"
        />
        <SearchButton otherClasses="sm:hidden" />
      </div>
      <SearchButton otherClasses="max-sm:hidden" />

      {error ? <p className="absolute -bottom-6 left-0 text-sm text-red-600">{error}</p> : null}
    </form>
  )
}

export default SearchBar
