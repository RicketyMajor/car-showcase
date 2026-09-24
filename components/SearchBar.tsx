"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import SearchManufacturer from "./SearchManufacturer";
import { ModelIcon, SearchIcon } from "./icons";

import { SEARCH_PARAM, manufacturers } from "@/constants";

// One submit for both fields. There used to be three - one per field on a phone
// and one on desktop - all doing the same thing.
const SearchButton = () => (
  <button type="submit" className="searchbar__submit btn-primary">
    <SearchIcon />
    <span className="sr-only">Search</span>
  </button>
)

// The URL carries the make lowercased (`kia`); the combobox lists it as `Kia`.
// A make that is not in the list is shown as the URL has it rather than hidden.
const displayManufacturer = (value: string) =>
  manufacturers.find((item) => item.toLowerCase() === value.toLowerCase()) ?? value;

const SearchBar = () => {
  const searchParams = useSearchParams();
  const urlManufacturer = searchParams.get(SEARCH_PARAM.manufacturer) ?? '';
  const urlModel = searchParams.get(SEARCH_PARAM.model) ?? '';

  // The fields mirror the URL. Seeded from a blank state, a make that arrived
  // in a shared link, a reload or back/forward was invisible here - and the
  // submit deletes any key whose field is empty, so searching a model silently
  // dropped the make the visitor never touched.
  const [manufacturer, setManufacturer] = useState(() => displayManufacturer(urlManufacturer));
  const [model, setModel] = useState(urlModel);

  // Re-sync when the URL's search moves under us (back/forward), adjusting
  // during render rather than in an effect. A fuel or year click leaves both
  // keys alone, so it does not wipe what the visitor is typing; and a field
  // that already says the same thing keeps the visitor's own casing.
  const [synced, setSynced] = useState({ manufacturer: urlManufacturer, model: urlModel });
  if (synced.manufacturer !== urlManufacturer || synced.model !== urlModel) {
    setSynced({ manufacturer: urlManufacturer, model: urlModel });
    if (manufacturer.toLowerCase() !== urlManufacturer.toLowerCase()) {
      setManufacturer(displayManufacturer(urlManufacturer));
    }
    if (model.toLowerCase() !== urlModel.toLowerCase()) setModel(urlModel);
  }

  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (manufacturer === '' && model === '') {
      return setError('Enter a manufacturer or a model to search.');
    }

    setError('');

    // The model keeps the visitor's casing: `fetchCars` matches it
    // case-insensitively, so lowercasing it only made a restored field read `niro`.
    updateSearchParams(model, manufacturer.toLowerCase())
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

    // Without `scroll: false` the App Router jumps to the top of the document on
    // every navigation, so a successful search threw the visitor back up past the
    // hero and away from the results it had just fetched.
    router.push(`${window.location.pathname}?${searchParams.toString()}`, { scroll: false });
  }

  return (
    <form className="searchbar" onSubmit={handleSearch}>

      <div className="searchbar__item">
        <SearchManufacturer manufacturer={manufacturer} setManufacturer={setManufacturer} />
      </div>
      <div className="searchbar__item">
        <ModelIcon className="absolute w-5 h-5 ml-4 text-grey" />
        <input
          type="text"
          name="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Tiguan"
          className="searchbar__input"
        />
      </div>
      <SearchButton />

      {/* In the flow, not absolute: stacked at 390 an absolute line landed on the
          filter pills. The red is 6:1 on white and chalk; Tailwind's red-600 was
          under 4.5:1 on chalk. */}
      {error ? <p role="alert" className="w-full text-sm text-[#B42318]">{error}</p> : null}
    </form>
  )
}

export default SearchBar
