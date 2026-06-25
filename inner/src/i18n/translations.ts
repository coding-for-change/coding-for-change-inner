export type Locale = 'en' | 'de';

export interface Translations {
    nav: {
        home: string; about: string; events: string; projects: string;
        sponsors: string; team: string; blog: string; qa: string; join: string; contact: string;
    };
    common: {
        learnMore: string; partner: string; at: string;
        enterThreeD: string; exitThreeD: string; unavailable: string;
    };
    home: {
        about: string; events: string; projects: string; team: string; join: string;
        kicker: string; ctaPrimary: string; ctaSecondary: string; scrollHint: string;
    };
    about: {
        title: string;
        kicker: string;
        oneLiner: string;
        pitch: string;
        stats: { value: string; label: string }[];
        howItWorks: string;
        steps: { title: string; text: string }[];
        explore: string;
    };
    process: {
        kicker: string; heading: string; intro: string;
    };
    cta: {
        heading: string; text: string; join: string; contact: string;
    };
    projects: { title: string; subtitle: string; intro: string; };
    events: {
        title: string; subtitle: string; intro: string;
        upcoming: string; past: string;
        emptyTitle: string; emptyText: string; emptyCta: string;
    };
    team: { title: string; subtitle: string; intro: string; advisersTitle: string; };
    qa: { title: string; subtitle: string; intro: string; };
    join: {
        benefits: string; requirements: string; applyNow: string;
        nameLabel: string; namePlaceholder: string;
        emailLabel: string; emailPlaceholder: string;
        motivationLabel: string; motivationPlaceholder: string;
        sendApplication: string; unavailable: string;
        submitting: string; sendError: string; loadingForm: string;
        formUnavailable: string; successFallback: string; requiredNote: string;
    };
    contact: {
        title: string; intro: string;
        nameLabel: string; namePlaceholder: string;
        emailLabel: string; emailPlaceholder: string;
        orgLabel: string; orgPlaceholder: string;
        messageLabel: string; messagePlaceholder: string;
        sendMessage: string; emailClientNote: string; requiredNote: string;
        submitting: string; sendError: string; loadingForm: string;
        formUnavailable: string; successFallback: string;
    };
    book: { title: string; intro: string; fallback: string; openInNewTab: string; };
    sponsors: { title: string; subtitle: string; intro: string; };
    blog: {
        title: string; subtitle: string; searchPlaceholder: string;
        all: string; noPosts: string; back: string; notFound: string;
    };
    navbar: { title: string; subtitle: string; };
}

const en: Translations = {
    nav: {
        home: 'HOME', about: 'ABOUT', events: 'EVENTS', projects: 'PROJECTS',
        sponsors: 'SPONSORS', team: 'TEAM', blog: 'BLOG', qa: 'Q&A', join: 'JOIN', contact: 'CONTACT',
    },
    common: {
        learnMore: 'Learn More', partner: 'Partner:', at: 'at',
        enterThreeD: 'Enter 3D mode', exitThreeD: 'Exit 3D mode',
        unavailable: 'Content unavailable.',
    },
    home: {
        about: 'ABOUT', events: 'EVENTS', projects: 'PROJECTS', team: 'TEAM', join: 'JOIN',
        kicker: 'Gain coding experience while making a difference',
        ctaPrimary: 'Join the club',
        ctaSecondary: 'See our work',
        scrollHint: '↓ scroll to explore',
    },
    about: {
        title: 'About Us',
        kicker: 'Who we are',
        oneLiner: 'We develop software for NGOs so they can focus on their mission.',
        pitch: 'NGOs have the mission. Students have the skills. We connect the two.',
        stats: [
            { value: '4', label: 'NGOs partnered' },
            { value: '10+', label: 'Active members' },
            { value: '1', label: 'Projects shipped' },
        ],
        howItWorks: 'How it works',
        steps: [
            { title: 'Match', text: 'We pair an NGO that needs software with a student team.' },
            { title: 'Build', text: 'The team ships it over one semester of agile sprints.' },
            { title: 'Hand off', text: 'We deliver the finished product with docs and support.' },
        ],
        explore: 'Explore',
    },
    process: {
        kicker: 'How it works',
        heading: 'How we work with NGOs',
        intro: 'From first conversation to finished software in a single semester — here is the path every project follows.',
    },
    cta: {
        heading: 'Ready to build something good?',
        text: 'Whether you are a student who wants to ship real code or a nonprofit with a problem worth solving — let us talk.',
        join: 'Join the club',
        contact: 'Partner with us',
    },
    projects: {
        title: 'Projects', subtitle: 'Building Tech for Social Good',
        intro: 'We partner with NGOs to build software solutions that make a real difference. Each project is led by student teams and developed in close collaboration with our partners.',
    },
    events: {
        title: 'Events', subtitle: 'Workshops, Hackathons & More',
        intro: 'Join us at our upcoming events or check out what we have been up to!',
        upcoming: 'Upcoming Events', past: 'Past Events',
        emptyTitle: 'Currently no event',
        emptyText: 'Have an idea for an event? Let’s talk.',
        emptyCta: 'Get in touch',
    },
    team: {
        title: 'Our Team', subtitle: 'The People Behind CFC',
        intro: 'Meet the team that drives Coding for Change. We are a diverse group of students passionate about using technology for social good.',
        advisersTitle: 'Advisers',
    },
    qa: {
        title: 'Q&A', subtitle: 'Frequently Asked Questions',
        intro: 'Find answers to common questions about Coding for Change below.',
    },
    join: {
        benefits: 'Benefits', requirements: 'Requirements', applyNow: 'Apply Now',
        nameLabel: 'Your Name:', namePlaceholder: 'Name',
        emailLabel: 'Email:', emailPlaceholder: 'Email',
        motivationLabel: 'Why do you want to join?',
        motivationPlaceholder: 'Tell us about your motivation...',
        sendApplication: 'Send Application', unavailable: 'Content unavailable.',
        submitting: 'Sending…',
        sendError:
            'Something went wrong sending your application. Please try again or email us directly.',
        loadingForm: 'Loading form…',
        formUnavailable:
            'The application form is currently unavailable. Please email us directly.',
        successFallback: 'Thanks! Your application has been sent.',
        requiredNote: '* = required',
    },
    contact: {
        title: 'Contact',
        intro: 'Whether you are an NGO looking for someone to solve a hard problem using technology or just curious about what we do — we would love to hear from you!',
        nameLabel: 'Your name:', namePlaceholder: 'Name',
        emailLabel: 'Email:', emailPlaceholder: 'Email',
        orgLabel: 'Organization/NGO (optional):', orgPlaceholder: 'Organization or NGO name',
        messageLabel: 'Message:', messagePlaceholder: 'Message',
        sendMessage: 'Send Message',
        emailClientNote: 'This will open your email client to send the message',
        requiredNote: '* = required',
        submitting: 'Sending…',
        sendError:
            'Something went wrong sending your message. Please try again, or email us directly.',
        loadingForm: 'Loading form…',
        formUnavailable:
            'The contact form is currently unavailable. Please email us directly.',
        successFallback: 'Thanks! Your message has been sent.',
    },
    book: {
        title: 'Book a meeting',
        intro: 'Prefer to talk? Grab a slot that suits you and we will meet you there.',
        fallback: 'Online booking is not set up yet — email us and we will find a time.',
        openInNewTab: 'Open booking page',
    },
    sponsors: {
        title: 'Sponsors', subtitle: 'Our Supporters',
        intro: 'We are grateful for the support of our sponsors who make our work possible. Interested in sponsoring? Reach out to us!',
    },
    blog: {
        title: 'News', subtitle: 'Projects, lessons, and reflections from our teams',
        searchPlaceholder: 'Search posts...', all: 'All',
        noPosts: 'No posts found.', back: 'Back to Blog', notFound: 'Post not found.',
    },
    navbar: { title: 'Coding for Change', subtitle: 'Munich Student Club' },
};

const de: Translations = {
    nav: {
        home: 'START', about: 'ÜBER UNS', events: 'EVENTS', projects: 'PROJEKTE',
        sponsors: 'SPONSOREN', team: 'TEAM', blog: 'BLOG', qa: 'F&A', join: 'MITMACHEN', contact: 'KONTAKT',
    },
    common: {
        learnMore: 'Mehr erfahren', partner: 'Partner:', at: 'um',
        enterThreeD: '3D-Modus starten', exitThreeD: '3D-Modus beenden',
        unavailable: 'Inhalt nicht verfügbar.',
    },
    home: {
        about: 'ÜBER UNS', events: 'EVENTS', projects: 'PROJEKTE', team: 'TEAM', join: 'MITMACHEN',
        kicker: 'Sammle Programmiererfahrung und bewirke etwas Gutes',
        ctaPrimary: 'Mitglied werden',
        ctaSecondary: 'Unsere Arbeit ansehen',
        scrollHint: '↓ zum Entdecken scrollen',
    },
    about: {
        title: 'Über Uns',
        kicker: 'Wer wir sind',
        oneLiner: 'Wir entwickeln Software für NGOs, damit sie sich auf ihre Mission konzentrieren können.',
        pitch: 'NGOs haben die Mission. Studierende haben die Fähigkeiten. Wir bringen beide zusammen.',
        stats: [
            { value: '4', label: 'NGOs unterstützt' },
            { value: '10+', label: 'Aktive Mitglieder' },
            { value: '1', label: 'Projekte umgesetzt' },
        ],
        howItWorks: 'So funktioniert es',
        steps: [
            { title: 'Matching', text: 'Wir bringen eine NGO mit Softwarebedarf mit einem Studierendenteam zusammen.' },
            { title: 'Entwicklung', text: 'Das Team setzt es in einem Semester in agilen Sprints um.' },
            { title: 'Übergabe', text: 'Wir liefern das fertige Produkt mit Dokumentation und Support.' },
        ],
        explore: 'Entdecken',
    },
    process: {
        kicker: 'So funktioniert es',
        heading: 'Wie wir mit NGOs arbeiten',
        intro: 'Vom ersten Gespräch bis zur fertigen Software in einem einzigen Semester – diesen Weg geht jedes Projekt.',
    },
    cta: {
        heading: 'Bereit, etwas Gutes zu bauen?',
        text: 'Ob Studierende:r, die:der echten Code liefern will, oder NGO mit einem Problem, das es zu lösen lohnt – sprich mit uns.',
        join: 'Mitglied werden',
        contact: 'Partner werden',
    },
    projects: {
        title: 'Projekte', subtitle: 'Technologie für das Gemeinwohl',
        intro: 'Wir arbeiten mit NGOs zusammen, um Softwarelösungen zu entwickeln, die wirklich etwas bewirken. Jedes Projekt wird von Studierendenteams geleitet und in enger Zusammenarbeit mit unseren Partnern entwickelt.',
    },
    events: {
        title: 'Events', subtitle: 'Workshops, Hackathons & Mehr',
        intro: 'Nimm an unseren kommenden Events teil oder schau dir an, was wir bisher erlebt haben!',
        upcoming: 'Kommende Events', past: 'Vergangene Events',
        emptyTitle: 'Aktuell kein Event',
        emptyText: 'Du hast eine Idee für ein Event? Lass uns reden.',
        emptyCta: 'Kontakt aufnehmen',
    },
    team: {
        title: 'Unser Team', subtitle: 'Die Menschen hinter CFC',
        intro: 'Lern das Team kennen, das Coding for Change antreibt. Wir sind eine vielfältige Gruppe von Studierenden, die Technologie für soziale Zwecke einsetzen wollen.',
        advisersTitle: 'Beirat',
    },
    qa: {
        title: 'F&A', subtitle: 'Häufig Gestellte Fragen',
        intro: 'Finde hier Antworten auf häufige Fragen zu Coding for Change.',
    },
    join: {
        benefits: 'Vorteile', requirements: 'Voraussetzungen', applyNow: 'Jetzt Bewerben',
        nameLabel: 'Dein Name:', namePlaceholder: 'Name',
        emailLabel: 'E-Mail:', emailPlaceholder: 'E-Mail',
        motivationLabel: 'Warum möchtest du mitmachen?',
        motivationPlaceholder: 'Erzähl uns von deiner Motivation...',
        sendApplication: 'Bewerbung absenden', unavailable: 'Inhalt nicht verfügbar.',
        submitting: 'Wird gesendet…',
        sendError:
            'Beim Senden deiner Bewerbung ist etwas schiefgelaufen. Bitte versuche es erneut oder schreib uns direkt.',
        loadingForm: 'Formular wird geladen…',
        formUnavailable:
            'Das Bewerbungsformular ist derzeit nicht verfügbar. Bitte schreib uns direkt.',
        successFallback: 'Danke! Deine Bewerbung wurde gesendet.',
        requiredNote: '* = Pflichtfeld',
    },
    contact: {
        title: 'Kontakt',
        intro: 'Ob NGO auf der Suche nach jemandem, der ein kniffliges Problem mithilfe von Technologie löst, oder einfach neugierig auf unsere Arbeit – wir freuen uns von dir zu hören!',
        nameLabel: 'Dein Name:', namePlaceholder: 'Name',
        emailLabel: 'E-Mail:', emailPlaceholder: 'E-Mail',
        orgLabel: 'Organisation/NGO (optional):', orgPlaceholder: 'Name der Organisation oder NGO',
        messageLabel: 'Nachricht:', messagePlaceholder: 'Nachricht',
        sendMessage: 'Nachricht senden',
        emailClientNote: 'Damit wird dein E-Mail-Programm geöffnet, um die Nachricht zu senden',
        requiredNote: '* = Pflichtfeld',
        submitting: 'Wird gesendet…',
        sendError:
            'Beim Senden deiner Nachricht ist etwas schiefgelaufen. Bitte versuche es erneut oder schreib uns direkt eine E-Mail.',
        loadingForm: 'Formular wird geladen…',
        formUnavailable:
            'Das Kontaktformular ist derzeit nicht verfügbar. Bitte schreib uns direkt eine E-Mail.',
        successFallback: 'Danke! Deine Nachricht wurde gesendet.',
    },
    book: {
        title: 'Termin buchen',
        intro: 'Lieber sprechen? Wähl einen passenden Slot und wir treffen uns dort.',
        fallback: 'Online-Buchung ist noch nicht eingerichtet — schreib uns und wir finden einen Termin.',
        openInNewTab: 'Buchungsseite öffnen',
    },
    sponsors: {
        title: 'Sponsoren', subtitle: 'Unsere Unterstützer',
        intro: 'Wir sind dankbar für die Unterstützung unserer Sponsoren, die unsere Arbeit erst möglich machen. Interesse am Sponsoring? Meld dich bei uns!',
    },
    blog: {
        title: 'News', subtitle: 'Projekte, Erkenntnisse und Rückblicke unserer Teams',
        searchPlaceholder: 'Beiträge durchsuchen...', all: 'Alle',
        noPosts: 'Keine Beiträge gefunden.', back: 'Zurück zum Blog', notFound: 'Beitrag nicht gefunden.',
    },
    navbar: { title: 'Coding for Change', subtitle: 'Münchner Studierendenclub' },
};

export const translations: Record<Locale, Translations> = { en, de };
