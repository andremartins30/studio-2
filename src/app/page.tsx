// This file is now a redirect to the main app page.
// The actual dashboard page is at src/app/(app)/page.tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/login');
}
