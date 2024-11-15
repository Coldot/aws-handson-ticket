'use client'

import { useState, useEffect } from 'react'

interface Event {
  id: string;
  name: string;
  availableTickets: number;
}

interface Ticket {
  id: string;
  event: Event;
  createdAt: string;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [eventName, setEventName] = useState('')
  const [totalTickets, setTotalTickets] = useState('')
  const [myTickets, setMyTickets] = useState<Ticket[]>([])

  useEffect(() => {
    fetchEvents()
    fetchMyTickets()

    const intervalId = setInterval(() => {
      fetchEvents()
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events')
      const data = await res.json()
      if (Array.isArray(data)) {
        setEvents(data)
      } else {
        console.error('Expected an array of events, but got:', data)
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }

  const fetchMyTickets = async () => {
    try {
      const res = await fetch('/api/tickets')
      const data = await res.json()
      if (Array.isArray(data)) {
        setMyTickets(data)
      } else {
        console.error('Expected an array of tickets, but got:', data)
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
    }
  }

  const createEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: eventName, totalTickets: parseInt(totalTickets) }),
      })
      setEventName('')
      setTotalTickets('')
      fetchEvents()
    } catch (error) {
      console.error('Failed to create event:', error)
    }
  }

  const bookTicket = async (eventId: string) => {
    try {
      await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      })
      fetchEvents()
      fetchMyTickets()
    } catch (error) {
      console.error('Failed to book ticket:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Hands-On: Ticketing System</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Create Event</h2>
        <form onSubmit={createEvent} className="flex gap-2">
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Event Name"
            className="border p-2"
          />
          <input
            type="number"
            value={totalTickets}
            onChange={(e) => setTotalTickets(e.target.value)}
            placeholder="Total Tickets"
            className="border p-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2">Create</button>
        </form>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Events</h2>
        <ul>
          {events.map((event) => (
            <li key={event.id} className="mb-2">
              {event.name} - Available: {event.availableTickets}
              <button
                onClick={() => bookTicket(event.id)}
                className="ml-2 bg-green-500 text-white p-1"
                disabled={event.availableTickets <= 0}
              >
                Book Ticket
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">My Tickets</h2>
        <ul>
          {myTickets.map((ticket) => (
            <li key={ticket.id}>
              {ticket.event.name} - Booked at: {new Date(ticket.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}