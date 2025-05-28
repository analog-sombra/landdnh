import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const idCookie = request.cookies.get("id");
  const id = idCookie?.value.toString();

  //   const userrole = request.cookies.get("role");
  //   const role = userrole?.value.toString();
  if (request.nextUrl.pathname == "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (
    id &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("dashboard/", request.url));
  } else if (!id && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
