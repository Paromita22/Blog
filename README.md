# PCJ Blogs

A full-stack blogging platform built as a portfolio/thesis project, combining a production-grade authentication and authorization system with a custom, heavily animated frontend. Built to demonstrate secure application architecture end-to-end — not just CRUD, but ownership enforcement, role-based access control, database-level security, and defense against common web vulnerabilities.

**Live:** [your deployed URL]
**Repo:** [your GitHub URL]

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server Components by default, Client Components where interactivity requires it |
| Language | TypeScript | Strict mode |
| Database | PostgreSQL (Supabase) | Managed Postgres with Row-Level Security enabled |
| ORM | Prisma 7 | Using `@prisma/adapter-pg` driver adapter over a connection `Pool` |
| Auth | NextAuth.js (v4) | JWT session strategy, Credentials + Google OAuth providers |
| Validation | Zod | Schema validation on every write endpoint |
| Styling | Tailwind CSS v4 | Design tokens via CSS custom properties, not hardcoded Tailwind theme colors |
| Animation | Framer Motion | Scroll-linked transforms, staggered reveals, `clipPath`/SVG morphing |
| Icons | Lucide React | |
| Deployment | Vercel | Auto-deploy from `main`, environment-scoped secrets |

---

## Architecture & Security Decisions

This section documents *why* certain choices were made, not just what was used — the goal was to build something defensible in a technical interview, not just something that works.

### Authentication & Session Handling
- **JWT strategy**, not database sessions — sessions are self-contained signed tokens, avoiding a session-table round-trip on every request.
- **Dual auth providers**: Credentials (bcrypt-hashed passwords, cost factor 10) and Google OAuth. The `jwt` callback re-fetches the user from the database on sign-in to guarantee the token's `id` claim is always the canonical database UUID — regardless of which provider authenticated the user — preventing ID drift between auth methods.
- **Generic auth error messages** (`"Invalid email or password"`) rather than distinguishing "no such user" vs "wrong password," to prevent user-enumeration attacks.
- **Google sign-in auto-provisioning**: new Google accounts are created in the `User` table on first sign-in via the `signIn` callback, with `role` assigned based on a hardcoded admin allowlist check.

### Authorization (RBAC)
- Two roles: `USER` and `ADMIN`, stored as a Postgres enum and carried through the JWT (`token.role`) into every session.
- **Ownership enforcement is server-side, not client-side** — every mutating API route (`PUT`/`DELETE` on blogs and comments) independently re-verifies `resource.authorId === session.user.id || session.user.role === "ADMIN"` before acting, regardless of what the UI does or doesn't show. The frontend hiding a delete button is a UX nicety, not the actual security boundary.
- Admins can moderate (delete) any user's blog posts and comments; regular users are scoped to their own content only.

### Database Security
- **Row-Level Security (RLS) enabled on every table** in Supabase, closing off the auto-generated public REST API that Supabase exposes by default (a common misconfiguration that leaves the `User` table — including hashed passwords — publicly queryable via HTTP if left unrestricted). The application itself connects via Prisma using a role that bypasses RLS as intended, so this is a defense-in-depth layer against direct API access, not a functional restriction on the app.
- **Parameterized queries throughout** — Prisma's query builder parameterizes all standard queries; the one raw SQL query (full-text search) uses Prisma's tagged-template `$queryRaw`, which safely escapes interpolated values rather than string-concatenating user input.

### Input Validation & Abuse Prevention
- **Zod schemas** validate every POST/PUT body (registration, blog creation/editing, comments, subscriptions) before it touches the database — rejecting malformed input with structured field-level error messages rather than letting bad data reach Prisma.
- **Rate limiting** on registration, login, comment posting, and newsletter subscription endpoints — a lightweight in-memory sliding-window limiter keyed by IP or user ID. (Known limitation: this doesn't persist across Vercel's serverless cold starts/instances, so it's a soft rather than hard guarantee at scale — documented here deliberately rather than glossed over; the production-grade fix would be an external store like Upstash Redis.)
- **XSS mitigation**: user-generated content (blog bodies, comments) is rendered as plain text (`whiteSpace: pre-wrap`), never through `dangerouslySetInnerHTML` — there is no code path where user input is interpreted as HTML/JS.

### Search
- **Native Postgres full-text search**, not a naive `LIKE` query — a generated `tsvector` column combines title, content, and category with weighted relevance (title weighted highest), backed by a GIN index for query performance. Search queries use `websearch_to_tsquery`, which parses natural multi-word phrases without requiring the user to know Postgres's query operator syntax.

---

## Feature Set

- **Auth**: Email/password + Google OAuth, JWT sessions, rate-limited login/registration
- **Blog CRUD**: Full create/read/update/delete lifecycle with server-enforced ownership
- **Role-based moderation**: Admin-only deletion rights over any post or comment
- **Curated vs. community sections**: Admin-authored posts surfaced separately from user submissions on the archive page
- **Likes & bookmarks**: Per-user, per-post, toggleable, with live counts
- **Threaded-flat comments**: Authenticated commenting with author-badge distinction and owner/admin deletion
- **Full-text search**: Debounced, ranked, Postgres-native
- **Category browsing**: Aggregated via Prisma's `groupBy`, with post-count-weighted visual emphasis
- **Live usage statistics**: Real counts (posts, words written, registered users) queried on render, not hardcoded
- **Newsletter subscription**: Email capture with automated new-post notifications via Resend, and token-based unsubscribe links
- **Light/dark theming**: Full theme system via CSS custom properties, persisted in `localStorage`, defaulting to dark
- **Custom animation system**: Scroll-linked parallax, a multi-phase load animation (paper shapes → SVG bird morph), all respecting `prefers-reduced-motion`
- **Responsive navigation**: Collapsing hamburger/drawer nav below the `sm` breakpoint
- **Community guidelines page**: Documented content policy for what is and isn't permitted

---

## Database Schema
User — id, email, password (hashed), name, role (enum), timestamps
Blog — id, title, content, category, views, authorId → User
Bookmark — userId → User, blogId → Blog (composite unique)
Like — userId → User, blogId → Blog (composite unique)
Comment — id, content, userId → User, blogId → Blog, timestamps
Subscriber — id, email (unique), unsubscribeToken (unique)


All foreign keys cascade on delete (deleting a user or blog cleanly removes dependent rows).

---

## Getting Started

### Prerequisites
- Node.js 20.19.0+
- PostgreSQL database (Supabase recommended — this project depends on Supabase-specific RLS configuration)

### Installation

```bash
git clone [your-repo-url]
cd my-philosophy-blog
npm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@host:6543/db?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/db"
NEXTAUTH_SECRET="generate-with-crypto-randomBytes"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
RESEND_API_KEY="your-resend-api-key"
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

Then in the Supabase SQL Editor, enable RLS on every table:

```sql
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Blog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bookmark" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Like" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;
```

And add the full-text search index:

```sql
ALTER TABLE "Blog" ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'C')
  ) STORED;

CREATE INDEX blog_search_idx ON "Blog" USING GIN (search_vector);
```

### Run

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## Known Limitations

- Rate limiting is in-memory and per-instance — not strictly consistent across Vercel's serverless cold starts. Sufficient for current scale; would migrate to Upstash Redis for true distributed rate limiting.
- Comments are currently flat (single-level), not threaded — a `parentId` self-relation is the planned path if threading is added.
- Word-count statistics are computed by splitting content client-request-time rather than a maintained aggregate column — fine at current post volume, would move to a SQL aggregate or cached value at larger scale.

---

## License
MIT