import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {

}

export const config = {
    matcher: '/api/user/:path*',
}