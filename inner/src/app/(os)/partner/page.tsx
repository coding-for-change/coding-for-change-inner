import Partner from '@/components/showcase/Partner';
import { fetchGlobal, fetchCollection } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsPartner, CmsProject } from '@/api/types';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Partner with us — Coding for Change',
    description:
        'Non-profits: we design and ship the software you need — free, delivered by a dedicated student team in a single semester. Start a conversation.',
};

export default async function PartnerPage() {
    const locale = await getServerLocale();
    const [partner, projects] = await Promise.all([
        fetchGlobal<CmsPartner>('partner', locale),
        fetchCollection<CmsProject>('projects', locale, { depth: '2' }),
    ]);
    return <Partner partner={partner} projects={projects} />;
}
