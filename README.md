<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/9113740/201498864-2a900c64-d88f-4ed4-b5cf-770bcb57e1f5.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/9113740/201498152-b171abb8-9225-487a-821c-6ff49ee48579.png">
</picture>

<div align="center"><strong>Next.js Admin Dashboard Starter Template With Shadcn-ui</strong></div>
<div align="center">Built with the Next.js 15 App Router</div>
<br />
<div align="center">
<a href="https://next-shadcn-clerk.vercel.app/">View Demo</a>
<span>
</div>

## Overview

This is a starter template using the following stack:

- Framework - [Next.js 15](https://nextjs.org/13)
- Language - [TypeScript](https://www.typescriptlang.org)
- Auth - [Clerk](https://go.clerk.com/ILdYhn7)
- Database - [Prisma ORM](https://www.prisma.io/) with SQLite
- Error tracking - [<picture><img alt="Sentry" src="public/assets/sentry.svg">
  </picture>](https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy26q2-nextjs&utm_content=github-banner-project-tryfree)
- Styling - [Tailwind CSS v4](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- Schema Validations - [Zod](https://zod.dev)
- State Management - [Tanstack Query](https://tanstack.com/query/latest) + [Zustand](https://zustand-demo.pmnd.rs)
- Search params state manager - [Nuqs](https://nuqs.47ng.com/)
- Tables - [Tanstack Data Tables](https://ui.shadcn.com/docs/components/data-table) • [Dice table](https://www.diceui.com/docs/components/data-table)
- Forms - [React Hook Form](https://ui.shadcn.com/docs/components/form)
- Command+k interface - [kbar](https://kbar.vercel.app/)
- Internationalization - [next-intl](https://next-intl-docs.vercel.app/)
- Linting - [ESLint](https://eslint.org)
- Pre-commit Hooks - [Husky](https://typicode.github.io/husky/)
- Formatting - [Prettier](https://prettier.io)

## Additional Features

### 🌍 Internationalization (i18n)

- **Multi-language support** with [next-intl](https://next-intl-docs.vercel.app/)
- **Automatic language detection** from browser's `accept-language` header
- **Supported languages**: English (en), Spanish (es), Portuguese Brazil (pt-BR)
- **Complete UI translation** including all components, forms, and navigation

### 🏢 Clerk Organizations

- **Team management** with Clerk Organizations
- **Organization switcher** in sidebar with responsive design
- **Member management** and role-based access control
- **Organization settings** and billing integration
- **Seamless organization switching** with persistent state

## Pages

| Pages                                                                                                                                                                  | Specifications                                                                                                                                                                                                                                                                                                                |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Signup / Signin](https://go.clerk.com/ILdYhn7)                                                                                                                        | Authentication with **Clerk** provides secure authentication and user management with multiple sign-in options including passwordless authentication, social logins, and enterprise SSO - all designed to enhance security while delivering a seamless user experience. Includes **Clerk Organizations** for team management. |
| [Dashboard (Overview)](https://shadcn-dashboard.kiranism.dev/dashboard)                                                                                                | Cards with Recharts graphs for analytics. Parallel routes in the overview sections feature independent loading, error handling, and isolated component rendering.                                                                                                                                                             |
| [Product](https://shadcn-dashboard.kiranism.dev/dashboard/product)                                                                                                     | Tanstack tables with server side searching, filter, pagination by Nuqs which is a Type-safe search params state manager in nextjs                                                                                                                                                                                             |
| [Product/new](https://shadcn-dashboard.kiranism.dev/dashboard/product/new)                                                                                             | A Product Form with shadcn form (react-hook-form + zod).                                                                                                                                                                                                                                                                      |
| [Profile](https://shadcn-dashboard.kiranism.dev/dashboard/profile)                                                                                                     | Clerk's full-featured account management UI that allows users to manage their profile and security settings                                                                                                                                                                                                                   |
| [Kanban Board](https://shadcn-dashboard.kiranism.dev/dashboard/kanban)                                                                                                 | A Drag n Drop task management board with dnd-kit and zustand to persist state locally.                                                                                                                                                                                                                                        |
| [Not Found](https://shadcn-dashboard.kiranism.dev/dashboard/notfound)                                                                                                  | Not Found Page Added in the root level                                                                                                                                                                                                                                                                                        |
| [Global Error](https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy26q2-nextjs&utm_content=github-banner-project-tryfree) | A centralized error page that captures and displays errors across the application. Integrated with **Sentry** to log errors, provide detailed reports, and enable replay functionality for better debugging.                                                                                                                  |

## Feature based organization

```plaintext
src/
├── app/ # Next.js App Router directory
│ ├── (auth)/ # Auth route group
│ │ ├── (signin)/
│ ├── (dashboard)/ # Dashboard route group
│ │ ├── layout.tsx
│ │ ├── loading.tsx
│ │ └── page.tsx
│ └── api/ # API routes
│
├── components/ # Shared components
│ ├── ui/ # UI components (buttons, inputs, etc.)
│ └── layout/ # Layout components (header, sidebar, etc.)
│
├── features/ # Feature-based modules
│ ├── feature/
│ │ ├── components/ # Feature-specific components
│ │ ├── actions/ # Server actions
│ │ ├── schemas/ # Form validation schemas
│ │ └── utils/ # Feature-specific utilities
│ │
├── lib/ # Core utilities and configurations
│ ├── auth/ # Auth configuration
│ ├── db/ # Database utilities
│ └── utils/ # Shared utilities
│
├── hooks/ # Custom hooks
│ └── use-debounce.ts
│
├── stores/ # Zustand stores
│ └── dashboard-store.ts
│
└── types/ # TypeScript types
└── index.ts
```

## 🗄️ Database Setup (Prisma)

This project uses **Prisma ORM** with **SQLite** for local development. Follow these steps to set up the database from scratch:

### Prerequisites

Make sure you have the following installed:

- Node.js 18+
- pnpm (recommended) or npm

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp env.example.txt .env
```

Edit `.env` and add your Clerk keys:

```env
DATABASE_URL=file:./dev.db
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Database Initialization

Since this is a fresh database, you need to create the initial migration and apply it:

```bash
# Generate Prisma client
pnpm prisma generate

# Create and apply the initial migration
pnpm prisma migrate dev --name init
```

### 4. Database Schema

The current schema includes the following models:

- **Post**: Blog posts with author and organization
- **Product**: Product catalog with categories and pricing
- **Task**: Kanban tasks with status and column assignment
- **Column**: Kanban board columns with colors and ordering

### 5. Development Commands

```bash
# Start development server
pnpm dev

# View database in Prisma Studio
pnpm prisma studio

# Reset database (⚠️ This will delete all data)
pnpm prisma migrate reset

# Generate new migration after schema changes
pnpm prisma migrate dev --name your_migration_name

# Deploy migrations to production
pnpm prisma migrate deploy
```

### 6. Database Files

The following files are automatically ignored by Git:

- `dev.db` - SQLite database file
- `dev.db-journal` - SQLite journal file
- `prisma/migrations/` - Migration files (should be committed)

### 7. Production Database

For production, update the `DATABASE_URL` in your environment variables to point to your production database (PostgreSQL, MySQL, etc.).

## Getting Started

> [!NOTE]  
> We are using **Next 15** with **React 19**, follow these steps:

Clone the repo:

```
git clone https://github.com/isaacdalmarco/next-shadcn-clerk.git
```

- `pnpm install` ( we have legacy-peer-deps=true added in the .npmrc)
- Create a `.env.local` file by copying the example environment file:
  `cp env.example.txt .env.local`
- Add the required environment variables to the `.env.local` file.
- `pnpm run dev`

##### Environment Configuration Setup

To configure the environment for this project, refer to the `env.example.txt` file. This file contains the necessary environment variables required for authentication and error tracking.

You should now be able to access the application at http://localhost:3000.

> [!WARNING]
> After cloning or forking the repository, be cautious when pulling or syncing with the latest changes, as this may result in breaking conflicts.

Cheers! 🥂
