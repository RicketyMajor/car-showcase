"use client";

import { createContext, useContext, useState } from "react";

import { VIEW_COOKIE } from "@/constants";

import ViewSwitch, { type View } from "./ViewSwitch";

// Lives outside the catalogue's Suspense boundary, like CatalogueStatus, so
// the angle the visitor picked holds through a new search and Show More.
const ViewContext = createContext<[View, (view: View) => void]>(["top", () => {}]);

export const CatalogueView = ({ initial, children }: { initial: View; children: React.ReactNode }) => {
  const [view, setView] = useState<View>(initial);
  const choose = (next: View) => {
    setView(next);
    // A year, so the choice outlives the visit; the server reads it on the next one.
    document.cookie = `${VIEW_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  };
  return <ViewContext.Provider value={[view, choose]}>{children}</ViewContext.Provider>;
};

export const useCatalogueView = (): View => useContext(ViewContext)[0];

export const CatalogueViewSwitch = () => {
  const [view, setView] = useContext(ViewContext);
  return <ViewSwitch value={view} onChange={setView} tone="light" />;
};
