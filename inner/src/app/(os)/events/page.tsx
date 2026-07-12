import EventsList from '@/components/showcase/EventsList';
import { fetchCollection } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsEvent } from '@/api/types';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Events — Coding for Change',
    description: 'Workshops, hackathons and socials from Coding for Change.',
};

export default async function EventsPage() {
    const locale = await getServerLocale();
    const events = await fetchCollection<CmsEvent>('events', locale);
    return <EventsList events={events} />;
}
