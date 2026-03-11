# FairBid — Real-Time Auction Platform

FairBid is a **production-grade real-time auction platform** that enables users to create auctions, place live bids, and receive instant updates without page refreshes.

It is designed with **scalability, correctness, and real-world architecture patterns** in mind, showcasing how modern web systems handle real-time data, background processing, and concurrency safely.

---

## Features

### Authentication

- Google OAuth login
- Secure **HttpOnly cookie-based authentication**
- Persistent sessions across reloads
- Logout with proper cookie invalidation

---

### Auction System

- Create auctions with:
  - Title
  - Description
  - Image
  - Start time & end time

- Auction states:
  - `UPCOMING`
  - `ACTIVE`
  - `CLOSED`

- Auctions automatically transition between states based on time

---

### Real-Time Bidding

- Live bid updates using **Socket.IO**
- No page refreshes
- Instant UI updates for:
  - Current highest bid
  - Auction start & end

- Optimized live countdown logic  


---

### Bid Logic & Safety

- Minimum bid increment enforced
- Sellers cannot bid on their own auctions
- **Race-condition-safe bidding** using database transactions
- Optimistic concurrency control prevents stale bids
- Backend remains the **single source of truth**

---

### Authorization & Access Control

- Guests can:
  - View auctions
  - See live bid updates
- Authenticated users can:
  - Create auctions
  - Place bids
- Sellers are blocked from bidding on their own auctions
- All bid actions are validated on the server

---

### Real-Time Architecture Design

- **Public Socket Events**
  - Live bid price updates
  - Auction start / end notifications

- **Private Socket Events (Authenticated)**
  - Outbid notifications
  - Highest bidder confirmation
  - Winner / loser notifications

Sockets are authenticated via **HttpOnly cookies during handshake**.  
Private events are delivered through **user-scoped socket rooms**.

---

### Background Job Processing

- Auction start & end handled using **BullMQ**
- Redis (Upstash) used for:
  - Job scheduling
  - Distributed coordination

- Winner determination handled asynchronously
- Designed to scale to a **separate worker service** in production

---

### Notifications

- Auction end triggers:
  - Winner detection
  - Email notification using NodeMailer (via background worker)

- Architecture supports future extensions:
  - SMS
  - Push notifications

---

### Data Consistency & Caching

- All critical operations wrapped in **database transactions**
- React Query used for:
  - Server state caching
  - Background refetching
- Socket events update cache instantly using `setQueryData`
- Query invalidation used only for structural data changes
- Prevents refetch storms and UI flicker

---

### Error Handling

- Server-side validation for all critical operations
- Meaningful error messages for invalid bids
- Automatic transaction rollbacks on failure
- Graceful UI fallbacks for network or server errors

---

### Frontend Experience

- Mobile-first responsive UI
- Clean, minimal, warm color palette
- Reusable component architecture
- Skeleton loaders & spinners for smooth UX
- Route-based modal authentication flow

---

## System Flow

1. User places a bid
2. Backend validates and updates bid transactionally
3. Socket.IO broadcasts live bid update
4. BullMQ schedules auction end
5. Worker finalizes auction and determines winner
6. Winner notification is sent asynchronously via email

---

## Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS
- React Router
- React Query
- Socket.IO Client
- Axios

### Backend

- Node.js
- Express
- Socket.IO
- Prisma ORM
- PostgreSQL
- Redis (Upstash)
- BullMQ
- Google OAuth
- JWT (HttpOnly cookies)

### Infrastructure

- Frontend: Vercel
- Backend: Render
- Redis: Upstash
- Database: PostgreSQL (Neon)
- Uptime Monitoring: External uptime bot

---

## Environment Variables

The application requires environment variables for:

- Google OAuth credentials
- JWT secrets
- Database connection
- Redis / BullMQ configuration
- SMTP credentials for email notifications

---

## Purpose

FairBid was built to explore **real-world real-time system design**, focusing on correctness, scalability, and user experience rather than demo-only functionality.

---

## Future Enhancements

- Auto-Bidding Bot
- Dutch Auction Bot
- Push notifications
- SMS alerts
- Advanced auction analytics
- Admin moderation dashboard
- Scaling Backend 
