import Contact from '@/components/showcase/Contact';
import { fetchCollection } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsForm } from '@/api/types';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Contact — Coding for Change',
    description: 'Get in touch with Coding for Change.',
};

export default async function ContactPage() {
    const locale = await getServerLocale();
    const forms = await fetchCollection<CmsForm>('forms', locale);
    return <Contact forms={forms} />;
}
