import { CreditSection } from './types';

// Static credits, consumed only by the legacy Win95 desktop `applications/Credits`
// window. The canonical, localized /credits route reads from i18n translations
// (`t.credits`) instead — keep the two in step if this list ever changes.
export const credits: CreditSection[] = [
    {
        title: 'Original Template',
        rows: [['Henry Heffernan', 'Design & Engineering']],
    },
    {
        title: 'CFC Adaptation',
        rows: [['Coding for Change Team', 'Content & Customization']],
    },
    {
        title: 'Technologies',
        rows: [
            ['React', 'UI Framework'],
            ['TypeScript', 'Language'],
            ['Framer Motion', 'Animations'],
        ],
    },
    {
        title: 'Special Thanks',
        rows: [
            ['Henry Heffernan', 'Original Portfolio Template'],
            ['All CFC Members', 'For making it happen'],
        ],
    },
];
