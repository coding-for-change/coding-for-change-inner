/** Payload CMS media object (populated upload field) */
export interface CmsMedia {
    id: number;
    url: string;
    alt: string;
    filename: string;
    mimeType: string;
    filesize: number;
    width?: number;
    height?: number;
}

/** GET /api/team */
export interface CmsTeamMember {
    id: number;
    name: string;
    role: string;
    image?: CmsMedia | null;
    bio: string;
    links?: { label: string; url: string; id?: string }[];
}

/** GET /api/events */
export interface CmsEvent {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    type: 'Hackathon' | 'Workshop' | 'Info-session' | 'Social';
    isUpcoming: boolean;
    link?: { label?: string; url?: string };
}

/** GET /api/projects */
export interface CmsProject {
    id: number;
    title: string;
    ngoPartner: string;
    description: string;
    image?: CmsMedia | null;
    technologies?: { name: string; id?: string }[];
    status: 'active' | 'completed' | 'recruiting';
    links?: { label: string; url: string; id?: string }[];
}

/** GET /api/sponsors */
export interface CmsSponsor {
    id: number;
    name: string;
    logo?: CmsMedia | null;
    url?: string;
    tier: 'gold' | 'silver' | 'bronze' | 'partner';
    description?: string;
}

/** GET /api/faq */
export interface CmsFaqItem {
    id: number;
    question: string;
    answer: string;
    category?: 'general' | 'membership' | 'projects' | 'technical';
}

/** GET /api/globals/site-config */
export interface CmsSiteConfig {
    clubName: string;
    tagline: string;
    description: string;
    email: string;
    socialLinks?: { platform: string; url: string; id?: string }[];
    copyrightText?: string;
    windowTitle?: string;
}

/** A node in a Payload lexical rich-text tree. */
export interface LexicalNode {
    type: string;
    version?: number;
    children?: LexicalNode[];
    // text node
    text?: string;
    format?: number | string;
    // heading node
    tag?: string;
    // link node
    fields?: { url?: string; newTab?: boolean; linkType?: string };
    // list node
    listType?: string;
    // upload node
    value?: { url?: string; alt?: string; mimeType?: string } | null;
    [key: string]: unknown;
}

/** Payload lexical rich-text field value. */
export interface LexicalRichText {
    root: LexicalNode;
}

/** Alias used by the blog feature — same shape as LexicalRichText. */
export type LexicalDocument = LexicalRichText;

/** GET /api/globals/legal */
export interface CmsLegal {
    impressum: LexicalRichText;
    privacyPolicy: LexicalRichText;
}

/** GET /api/blog-posts?depth=2 */
export interface CmsBlogPost {
    id: number;
    title: string;
    slug: string;
    publishedAt: string;
    excerpt: string;
    featuredImage?: CmsMedia | null;
    tags?: { tag: string; id?: string }[];
    author?: CmsTeamMember | null;
    project?: CmsProject | null;
    content: LexicalDocument;
}

/** GET /api/globals/membership */
export interface CmsMembership {
    title: string;
    description: string;
    benefits?: { text: string; id?: string }[];
    requirements?: { text: string; id?: string }[];
    contactEmail: string;
}
