import ImprintContent from '@/components/showcase/ImprintContent';
import { fetchGlobal } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsLegal } from '@/api/types';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Imprint & Privacy — Coding for Change',
};

export default async function ImprintPage() {
    const locale = await getServerLocale();
    const legal = await fetchGlobal<CmsLegal>('legal', locale);
    return (
        <div className="lp lp-page">
            <div className="lp-inner">
                <ImprintContent legal={legal} />
            </div>
        </div>
    );
}
