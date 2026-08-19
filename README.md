# My Philosophy Blog

A minimalist, high-performance web application built for writing and sharing philosophical reflections, poetry, and essays. Designed with a focus on typography, reading experience, and aesthetic minimalism.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma 7 (with `@prisma/adapter-pg`)
- **Authentication**: NextAuth.js (v4) - Google OAuth & Credentials Provider
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Core Features

- **Authentication**: Secure login and registration using Google OAuth or traditional Email/Password.
- **Reading Experience**: Distraction-free, typography-focused reading layout with view counters.
- **Engagement**: Users can like and bookmark posts.
- **Categorization**: Blogs are categorized and filterable on the archive page.
- **Author Dashboard**: A protected area for authors to manage, edit, and publish their writings.

## Getting Started

### Prerequisites
- Node.js 20.19.0+
- PostgreSQL database

### Installation

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
   NEXTAUTH_SECRET="your-super-secret-string"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Database Setup**
   Run Prisma migrations to set up your database schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## License
MIT
