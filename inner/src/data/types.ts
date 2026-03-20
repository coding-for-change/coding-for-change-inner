export interface SiteConfig {
    clubName: string;
    tagline: string;
    description: string;
    email: string;
    socialLinks: { platform: string; url: string; icon?: string }[];
    copyrightText: string;
    windowTitle: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    image?: string;
    bio: string;
    links?: { platform: string; url: string }[];
}

export interface CFCProject {
    id: string;
    title: string;
    ngoPartner: string;
    description: string;
    image?: string;
    technologies: string[];
    status: 'active' | 'completed' | 'recruiting';
    links?: { label: string; url: string }[];
}

export interface CFCEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    image?: string;
    type: string;
    isUpcoming: boolean;
    link?: { label: string; url: string };
}

export interface Sponsor {
    id: string;
    name: string;
    logo?: string;
    url: string;
    tier: 'gold' | 'silver' | 'bronze' | 'partner';
    description?: string;
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category?: string;
}

export interface MembershipInfo {
    title: string;
    description: string;
    benefits: string[];
    requirements: string[];
    contactEmail: string;
}

export interface CreditSection {
    title: string;
    rows: [string, string][];
}
