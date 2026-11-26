# Helpdesk Ticketing System

A full-stack helpdesk ticketing web application built with **Angular**, **Node.js**, **Express**, and **MySQL**, featuring JWT authentication and role-based access control (`user`, `agent`, and `admin`).

## Features

- **Authentication & RBAC**: JWT-based sign-in with role-aware navigation and route guards (`authGuard`, `staffGuard`).
- **Ticket Management**: Create tickets with priority levels (`low`, `medium`, `high`, `urgent`), filter by workflow status (`open`, `in_progress`, `resolved`, `closed`), and view full ticket details.
- **Comments & Collaboration**: Threaded comments on tickets for requesters and support staff.
- **Agent Triage Controls**: Staff (`agent` / `admin`) can update ticket status and assign tickets to staff members.
- **Operations Dashboard**: Live summary cards breaking down tickets by status and priority.

## Tech Stack

- **Frontend**: Angular (Standalone Components, Signals, Reactive/Template Forms, `HttpClient` + Auth Interceptor, CSS)
- **Backend**: Node.js, Express, MySQL2, JSON Web Tokens (`jsonwebtoken`), `bcrypt`
- **Database**: MySQL

## Project Structure

```text
helpdesk-ticketing/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── seed.js
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── core/
│   │       ├── pages/
│   │       └── services/
│   └── package.json
└── docs/
    └── screenshots/