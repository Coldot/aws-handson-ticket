import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { eventId } = await request.json();
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
        return NextResponse.json(
            { error: "User not authenticated" },
            { status: 401 }
        );
    }

    try {
        const result = await prisma.$transaction(async (prisma) => {
            const event = await prisma.event.findUnique({
                where: { id: eventId },
            });

            if (!event || event.availableTickets <= 0) {
                throw new Error("No tickets available");
            }

            const updatedEvent = await prisma.event.update({
                where: { id: eventId },
                data: { availableTickets: { decrement: 1 } },
            });

            const ticket = await prisma.ticket.create({
                data: {
                    eventId,
                    userId,
                },
            });

            return { ticket, updatedEvent };
        });

        return NextResponse.json(result);
    } catch {
        return NextResponse.json(
            { error: "Failed to book ticket" },
            { status: 400 }
        );
    }
}

export async function GET() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
        return NextResponse.json(
            { error: "User not authenticated" },
            { status: 401 }
        );
    }

    const tickets = await prisma.ticket.findMany({
        where: { userId },
        include: { event: true },
    });

    return NextResponse.json(tickets);
}
