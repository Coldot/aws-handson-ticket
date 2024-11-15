import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  if (!request.cookies.has('userId')) {
    const userId = uuidv4()
    response.cookies.set('userId', userId, { httpOnly: true, sameSite: 'strict' })
  }

  return response
}