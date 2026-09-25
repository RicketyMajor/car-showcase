"use client";

import { createContext, useContext, useState } from "react";

import ViewSwitch, { type View } from "./ViewSwitch";

// Lives outside the catalogue's Suspense boundary, like CatalogueStatus, so
// the angle the visitor picked holds through a new search and Show More.
const ViewContext = createContext<[View, (view: View) => void]>(["top", () => {}]);

export const CatalogueView = ({ children }: { children: React.ReactNode }) => {
  const state = useState<View>("top");
  return <ViewContext.Provider value={state}>{children}</ViewContext.Provider>;
};

export const useCatalogueView = (): View => useContext(ViewContext)[0];

export const CatalogueViewSwitch = () => {
  const [view, setView] = useContext(ViewContext);
  return <ViewSwitch value={view} onChange={setView} tone="light" />;
};
