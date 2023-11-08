import { NextResponse } from 'next/server'

export const config = {
    matcher: '/dashboard',
};

export function middleware(request) {
    console.log('request', request)


    //   return NextResponse.redirect(new URL('/home', request.url))
}

