import BecomeAMember from '@/components/showcase/BecomeAMember';
import { fetchGlobal } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsMembership } from '@/api/types';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Join — Coding for Change',
    description: 'Become a member of Coding for Change.',
};

export default async function JoinPage() {
    const locale = await getServerLocale();
    const membership = await fetchGlobal<CmsMembership>('membership', locale);
    return <BecomeAMember membership={membership} />;
}
