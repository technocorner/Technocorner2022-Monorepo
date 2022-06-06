import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import client from "../data/client";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (!req.cookies.session) {
    return NextResponse.redirect(client.main + "/auth/signin");
  }

  return NextResponse.next();
}
