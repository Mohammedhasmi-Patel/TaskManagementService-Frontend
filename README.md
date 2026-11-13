# TaskManagement

> A modern, full-stack task execution and work-tracking platform built to eliminate the friction of managing daily to-do tasks, project hierarchies, and work session details.

---

## 💡 Why This Project Exists

Managing day-to-day work across multiple projects often becomes overwhelming with generic to-do lists and rigid enterprise project management tools:
- **Generic to-do apps** lack vital project hierarchy (companies, client projects, tech stacks) and offer no visibility into how long tasks actually take.
- **Enterprise trackers** are often cumbersome, requiring rigid estimation upfront and making it frustrating to simply start a timer, pause with a quick note, or retroactively log work completed days ago.

**TaskManagement** was designed specifically to solve these difficulties. It provides a fluid, context-aware workflow where planning estimates, live timers, and historical manual entries coexist seamlessly.

---

## ✨ Key Features

### 1. Hierarchical Work Organization
- **Companies & Clients**: Group work by client or organization.
- **Projects**: Dedicated project spaces with tech stack tags and deadlines.
- **Tasks**: Rich task items linked to projects, priorities (`Low`, `Medium`, `High`, `Critical`), and status lifecycles.
- **Technologies**: Tag tasks with relevant technologies (e.g., React, .NET, PostgreSQL, Docker) with custom logos.

### 2. Natural, Status-Aware Task Flow
- **Planning Stage (`Todo`)**: Define planned estimates (`Est. Hours`) before work begins.
- **Active Execution (`InProgress`)**: Starting a timer on any task automatically transitions its status from `Todo` to `InProgress`. Hours are calculated automatically by the timer.
- **Retroactive & Past Work (`Completed`)**: If a task was completed previously (e.g., 3 days ago), you can enter actual hours manually in the task form or log historical time sessions with exact start and end times.

### 3. Dual Time Tracking System
- **Real-Time Live Timer**: Start work with one click. When stopping, a description dialog lets you record why you stopped (e.g., *"Completed implementation"* or *"Switched to urgent meeting"*).
- **Manual Past Time Entry**: Switch between *Live Timer* and *Manual Past Entry* mode to record past sessions with specific start/end timestamps and work summaries.
- **Active Running Indicators**: Visual pulsing badges (`● Running`) highlight tasks with active timers across the dashboard, tasks list, and details pages.

### 4. Comprehensive Work Session History
- **Task Details View (`/tasks/[id]`)**: Each task features a detailed **Logged Time Entries** breakdown displaying:
  - Formatted duration (`36s`, `1h 30m`)
  - Start and end timestamps
  - Detailed session descriptions and work notes
  - Cumulative total time tracked vs. planned estimate

### 5. Date-Range Filtering & Analytics
- Filter tasks and time entries instantly by **Today**, **This Week**, **This Month**, **This Year**, **All Time**, or **Custom Date Ranges**.
- Real-time metric cards summarize **Total Tasks**, **Total Estimated Hours**, and **Total Tracked Time**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering & Cache Components)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Tables**: [TanStack Table v8](https://tanstack.com/table/v8)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) with automatic token handling
- **Typography**: [Geist Sans & Geist Mono](https://vercel.com/font)

### Backend API
- **Framework**: [.NET 10 Web API](https://dotnet.microsoft.com/) (Clean Architecture)
- **Database / ORM**: PostgreSQL / In-Memory with [Entity Framework Core](https://learn.microsoft.com/ef/core/)
- **Security**: JWT Bearer Authentication & Password Hashing
- **Validation**: [FluentValidation](https://docs.fluentvalidation.net/)
- **Logging**: [Serilog](https://serilog.net/)
- **Documentation**: OpenAPI / Swagger UI

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v20.x or higher
- **npm**, **pnpm**, or **yarn**
- **.NET 10 SDK** (for the backend API)

---

### 1. Backend Setup
1. Open the backend directory:
   ```bash
   cd e:\web\TaskManagement
   ```
2. Restore and build:
   ```bash
   dotnet restore
   dotnet build
   ```
3. Run the API:
   ```bash
   dotnet run --project src/TaskManagement.API
   ```
   The API will start locally (e.g. `https://localhost:59131` or `http://localhost:5000`).

---

### 2. Frontend Setup
1. Open the frontend directory:
   ```bash
   cd e:\web\task-management-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://localhost:59131
   ```
   *(Or point to your deployed backend API URL)*

4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
task-management-frontend/
├── app/
│   ├── (auth)/             # Login and Registration routes
│   ├── (dashboard)/        # Protected workspace routes
│   │   ├── dashboard/      # Metrics and recent activity
│   │   ├── companies/      # Company / client management
│   │   ├── projects/       # Projects and tech associations
│   │   ├── tasks/          # Tasks list and [id] details
│   │   ├── technologies/   # Tech stack catalog
│   │   └── time-entries/   # Time tracking log and active timers
│   ├── globals.css         # Tailwind v4 configuration & theme variables
│   └── layout.tsx          # Root layout with Geist font & notifications
├── components/
│   ├── forms/              # Reusable form controls
│   ├── layout/             # Dashboard shell and sidebar
│   ├── shared/             # Date filter bar, data tables, metrics cards
│   ├── tasks/              # Task forms, details, cards, column definitions
│   ├── time-entries/       # Start/stop timer buttons, manual entry dialog
│   └── ui/                 # Accessible base UI primitives
├── hooks/                  # React custom hooks for data fetching & state
├── schemas/                # Zod schemas for forms and validation
├── services/               # API clients for tasks, projects, time entries, auth
├── types/                  # TypeScript interfaces and domain types
└── utils/                  # Date helpers, formatters, and duration utilities
```

---

## 🧪 Testing & Verification

Run checks across the frontend:
```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build
```

Run backend test suite:
```bash
dotnet test -c Release
```

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
