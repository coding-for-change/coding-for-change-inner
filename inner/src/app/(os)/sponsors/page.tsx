import SponsorsList from '@/components/showcase/SponsorsList';
import { fetchCollection } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsSponsor } from '@/api/types';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Sponsors — Coding for Change',
    description: 'The supporters who make Coding for Change possible.',
};

export default async function SponsorsPage() {
    const locale = await getServerLocale();
    const sponsors = await fetchCollection<CmsSponsor>('sponsors', locale);
    return <SponsorsList sponsors={sponsors} />;
}
