import { createCookie } from "react-router";

export const userPrefsCookie = createCookie("user-prefs");

export async function getUserPrefsCookie(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  return (await userPrefsCookie.parse(cookieHeader)) || {};
}
