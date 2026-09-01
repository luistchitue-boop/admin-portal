# Admin App

This is the admin control center for the school platform.

## Features

- Admin-only authentication with NextAuth
- Teacher management
- Turma management
- Assignment of turmas to teachers
- Responsive sidebar and mobile menu
- Prisma-based data layer

## Setup

1. Copy `.env.example` to `.env`.
2. Update the values.
3. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

4. Start the app:

```bash
npm run dev
```

## Default admin account

Create an admin user in the database manually or through a seed script. Example:

```bash
npx prisma studio
```

Then create a user with:
- email: admin@school.test
- name: Admin
- role: ADMIN
- passwordHash: use bcrypt to hash a password such as `admin123`

## Environment variables

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```
