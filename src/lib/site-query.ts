import { queryOptions } from "@tanstack/react-query";

import { getSiteData } from "./public.functions";

export const siteDataQuery = queryOptions({
  queryKey: ["site-data"],
  queryFn: () => getSiteData(),
  staleTime: 60_000,
});
