"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PAGE_SIZE, SEARCH_PARAM } from "@/constants";
import type { ShowMoreProps } from "@/types";

import { Announce } from "./CatalogueStatus";
import CustomButton from "./CustomButton";

const ShowMore = ({ limit, hasMore }: ShowMoreProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (!hasMore) return null;

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(SEARCH_PARAM.limit, `${limit + PAGE_SIZE}`);

    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="w-full flex-center gap-5 mt-10">
      {isPending && <Announce message="Loading more cars…" />}
      <CustomButton
        title={isPending ? "Loading..." : "Show More"}
        isDisabled={isPending}
        containerStyles="btn-primary"
        handleClick={handleClick}
      />
    </div>
  );
};

export default ShowMore;
