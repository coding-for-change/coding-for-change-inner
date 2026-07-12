import { redirect } from 'next/navigation';

// The Events section was removed from the homepage. Keep the route resolving
// (old links / sitemap) but send visitors to the home page.
export default function eventsPage() {
    redirect('/');
}
