import { useRouteLoaderData } from "react-router";
import invariant from "tiny-invariant";
import { loader } from "~/root";

/**
 * @returns the request info from the root loader
 */
export function useRequestInfo() {
  const data = useRouteLoaderData<typeof loader>("root");
  invariant(data?.hints, "No hints found in root loader");

  return data.hints;
}
