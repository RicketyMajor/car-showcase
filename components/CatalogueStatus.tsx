"use client";

import { createContext, useContext, useEffect, useState } from "react";

// A live region only announces a change to content it already holds, so a
// `role="status"` inside the Suspense fallback - mounted together with its
// text - never spoke. This one lives outside the boundary for the life of the
// page, and whatever is inside the boundary reports to it on mount: the
// skeleton says it is loading, the catalogue says what arrived.
//
// useTransition around router.push was tried first and measured wrong: it ends
// when the skeleton renders, not when the cars land, so the region held its
// text for 14ms. Only the boundary's children know when it resolved.
const SetStatus = createContext<(message: string) => void>(() => {});

export const CatalogueStatus = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState("");

  return (
    <SetStatus.Provider value={setMessage}>
      <p role="status" className="sr-only">
        {message}
      </p>
      {children}
    </SetStatus.Provider>
  );
};

export const Announce = ({ message }: { message: string }) => {
  const setMessage = useContext(SetStatus);

  useEffect(() => setMessage(message), [message, setMessage]);

  return null;
};
