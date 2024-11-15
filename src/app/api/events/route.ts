import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { name, totalTickets } = await request.json()

  const event = await prisma.event.create({
    data: {
      name,
      totalTickets,
      availableTickets: totalTickets,
    },
  })

  return NextResponse.json(event)
}

export async function GET() {
  const events = await prisma.event.findMany()
  return NextResponse.json(events)
}