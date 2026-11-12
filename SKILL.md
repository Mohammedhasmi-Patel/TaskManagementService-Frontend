my-app/
├── public/                     # static assets
├── src/
│   ├── app/                    # routing ONLY (thin files)
│   │   ├── (marketing)/        # route groups: no URL impact
│   │   │   ├── page.tsx
│   │   │   └── about/page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/page.tsx
│   │   ├── api/
│   │   │   └── users/route.ts
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                 # primitives: Button, Input, Modal
│   │   ├── layout/             # Header, Footer, Sidebar
│   │   ├── forms/              # reusable form components
│   │   └── shared/             # composed, app-wide components
│   │
│   ├── hooks/                  # custom React hooks
│   ├── lib/                    # third-party setup & helpers
│   │   ├── db.ts               # prisma/drizzle client
│   │   ├── auth.ts
│   │   └── axios.ts / fetcher.ts
│   │
│   ├── services/               # business logic / API calls
│   │   ├── user.service.ts
│   │   └── product.service.ts
│   │
│   ├── actions/                # Server Actions
│   │   └── user.actions.ts
│   │
│   ├── schemas/                # Zod validation schemas
│   ├── types/                  # shared TypeScript types
│   ├── store/                  # Zustand/Redux state
│   ├── providers/              # context/query/theme providers
│   ├── config/                 # constants, site config, nav links
│   ├── utils/                  # pure helper functions
│   └── middleware.ts           # (or proxy.ts in newer Next versions)
│
├── .env.local
├── .env.example
├── next.config.ts
├── tsconfig.json
└── package.json

not single component will cross the 200 lines of code make sure this.