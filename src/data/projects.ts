import { CFCProject } from './types';

export const projects: CFCProject[] = [
    {
        id: 'lebenshilfe-munich',
        title: 'Building a coordination platform for "Schulbegleiter"',
        ngoPartner: 'Lebenshilfe München e.V.',
        description: 'A web application that helps Lebenshilfe Mümchen manage their volunteer base of over 200 people. The platform streamlines shift scheduling, accounting, and billing.',
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Next.js', 'Docker', 'Betterauth'],
        status: 'active',
        links: [
            { label: 'GitHub', url: 'https://github.com/codingforchange/muenchen-hilft' },
        ],
    },
];
