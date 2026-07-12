import About from '@/components/showcase/About';
import { fetchGlobal } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsAbout, CmsHomepage } from '@/api/types';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'About — Coding for Change',
    description:
        'Coding for Change is a Munich student initiative pairing students from TUM and LMU with non-profits to build real, production software — free, in a single semester.',
};

export default async function AboutPage() {
    const locale = await getServerLocale();
    const [about, homepage] = await Promise.all([
        fetchGlobal<CmsAbout>('about', locale),
        fetchGlobal<CmsHomepage>('homepage', locale),
    ]);
    return <About about={about} homepage={homepage} />;
}
