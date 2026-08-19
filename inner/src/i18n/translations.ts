export type Locale = 'en' | 'de';

export interface Translations {
    nav: {
        home: string; events: string; projects: string;
        sponsors: string; team: string; blog: string; qa: string; join: string; contact: string;
        partner: string;
    };
    common: {
        learnMore: string; partner: string; at: string;
        enterThreeD: string; exitThreeD: string; unavailable: string;
    };
    home: {
        about: string; events: string; projects: string; team: string; join: string;
        kicker: string; ctaPrimary: string; ctaSecondary: string; scrollHint: string;
        heroLineOne: string; heroLineTwo: string;
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
    projects: {
        title: string; subtitle: string; intro: string; viewAll: string;
        more: string;
        status: { active: string; completed: string; recruiting: string };
    };
    threed: {
        kicker: string; title: string; text: string; cta: string;
        backKicker: string; backTitle: string; backText: string; backCta: string;
    };
    projectDetail: {
        back: string; problem: string; approach: string; outcome: string;
        impact: string; stack: string; links: string;
        timeline: string; team: string;
    };
    caseStudy: {
        chooseKicker: string; chooseTitle: string;
        technicalCardTitle: string; technicalCardText: string;
        impactCardTitle: string; impactCardText: string;
        technicalLabel: string; impactLabel: string;
        joinHeading: string; joinText: string; joinButton: string;
        challengeHeading: string; solutionHeading: string; resultsHeading: string;
        workingHeading: string; workingPoints: string[]; partnerLink: string;
        faqHeading: string; bookHeading: string; bookText: string;
    };
    events: {
        title: string; subtitle: string; intro: string;
        upcoming: string; past: string;
        emptyTitle: string; emptyText: string; emptyCta: string;
    };
    team: { title: string; subtitle: string; intro: string; advisersTitle: string; experienceLabel: string; };
    qa: { title: string; subtitle: string; intro: string; };
    join: {
        benefits: string; requirements: string; waysToContribute: string; applyNow: string;
        nameLabel: string; namePlaceholder: string;
        emailLabel: string; emailPlaceholder: string;
        motivationLabel: string; motivationPlaceholder: string;
        sendApplication: string; unavailable: string;
        submitting: string; sendError: string; loadingForm: string;
        formUnavailable: string; successFallback: string; requiredNote: string;
        waitlistTitle: string; waitlistLead: string;
        waitlistEmailLabel: string; waitlistEmailPlaceholder: string;
        waitlistButton: string; waitlistSubmitting: string;
        waitlistSuccess: string; waitlistError: string;
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
    talk: {
        ngoKicker: string; ngoHeading: string; ngoText: string;
        studentKicker: string; studentHeading: string; studentText: string; studentCta: string;
    };
    sponsors: {
        title: string; subtitle: string; intro: string;
        tiers: { platinum: string; gold: string; silver: string; bronze: string; partner: string };
    };
    blog: {
        title: string; subtitle: string; searchPlaceholder: string;
        all: string; noPosts: string; back: string; notFound: string;
    };
    navbar: { title: string; subtitle: string; };
    footer: {
        pages: string; info: string;
        home: string; projects: string; team: string; blog: string;
        sponsors: string; join: string; contact: string; qa: string; partner: string;
        privacy: string; imprint: string; cookieSettings: string;
    };
    aboutPage: {
        valuesTitle: string;
        values: { title: string; text: string }[];
    };
    partner: {
        kicker: string; fallbackTitle: string; fallbackLead: string;
        talkCta: string;
    };
    notFound: {
        kicker: string; title: string; lead: string;
        backHome: string; helpfulLinks: string;
        projects: string; join: string;
    };
}

const en: Translations = {
    nav: {
        home: 'Home', events: 'Events', projects: 'Projects',
        sponsors: 'Sponsors', team: 'Team', blog: 'Blog', qa: 'Q&A', join: 'Join', contact: 'Contact',
        partner: 'For NGOs',
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
        heroLineOne: 'Tech meets Social Impact',
        heroLineTwo: 'A match made in heaven',
    },
    about: {
        title: 'About Us',
        kicker: 'Who we are',
        oneLiner: 'We develop software for NGOs so they can focus on their mission.',
        pitch: 'NGOs have the mission. Students have the skills. We connect the two.',
        stats: [
            { value: '4', label: 'NGOs partnered' },
            { value: '10+', label: 'Active members' },
            { value: '150+', label: 'Users’ time saved' },
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
        heading: 'Ready to build something great?',
        text: 'Whether you are a student who wants to ship real code or a nonprofit with a problem worth solving — let us talk.',
        join: 'Join the club',
        contact: 'Partner with us',
    },
    projects: {
        title: 'Projects', subtitle: 'Building Tech for Social Good',
        intro: 'We partner with NGOs to build software solutions that make a real difference. Each project is led by student teams and developed in close collaboration with our partners.',
        viewAll: 'See all projects',
        more: 'More projects',
        status: { active: 'Active', completed: 'Completed', recruiting: 'Recruiting' },
    },
    threed: {
        kicker: 'Just for fun',
        title: 'Prefer the scenic route? Try the 3D site.',
        text: 'There’s a playful 3D version of this site — a little retro desktop you can click around right in your browser.',
        cta: 'Enter the 3D experience',
        backKicker: 'You’re in 3D mode',
        backTitle: 'Prefer the fast, simple version?',
        backText: 'You’re exploring the 3D version of the site. Hop back to the standard site any time — it’s quicker to get around.',
        backCta: 'Back to the standard site',
    },
    projectDetail: {
        back: 'Back to projects', problem: 'The problem', approach: 'Our approach',
        outcome: 'What we shipped', impact: 'Impact', stack: 'Built with', links: 'Links',
        timeline: 'Timeline', team: 'The team',
    },
    caseStudy: {
        chooseKicker: 'Two ways to read this',
        chooseTitle: 'How would you like to read it?',
        technicalCardTitle: 'Technical deep-dive',
        technicalCardText: 'How we built it — the problem, our approach and the stack. Best if you’re a student thinking about joining.',
        impactCardTitle: 'Impact story',
        impactCardText: 'What a project like this could mean for your organisation. Best if you’re a nonprofit exploring a partnership.',
        technicalLabel: 'Technical deep-dive',
        impactLabel: 'Impact story',
        joinHeading: 'Want to build things like this?',
        joinText: 'This is the kind of real, shipped software you’ll work on as a member — with a team, a real partner, and people who depend on it.',
        joinButton: 'Join the club',
        challengeHeading: 'The challenge',
        solutionHeading: 'What we built',
        resultsHeading: 'The impact',
        workingHeading: 'Working with us',
        workingPoints: [
            'Free of charge — funded by our university backing and sponsors',
            'Delivered in a single semester by a dedicated student team',
            'You own the result — documented, handed over, no lock-in',
        ],
        partnerLink: 'See how partnering works',
        faqHeading: 'Questions nonprofits ask',
        bookHeading: 'Have a problem worth solving?',
        bookText: 'Tell us about it — grab a slot and we’ll explore whether we can help.',
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
        experienceLabel: 'Previously at',
    },
    qa: {
        title: 'Q&A', subtitle: 'Frequently Asked Questions',
        intro: 'Find answers to common questions about Coding for Change below.',
    },
    join: {
        benefits: 'What you get', requirements: 'Who we’re looking for',
        waysToContribute: 'Ways to contribute', applyNow: 'Apply Now',
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
        waitlistTitle: 'Applications are currently closed',
        waitlistLead:
            'Sign up to be the first to know when applications reopen — we’ll email you the moment they do.',
        waitlistEmailLabel: 'Email:',
        waitlistEmailPlaceholder: 'you@example.com',
        waitlistButton: 'Notify me',
        waitlistSubmitting: 'Signing up…',
        waitlistSuccess:
            'You’re on the list! We’ll be in touch as soon as applications reopen.',
        waitlistError:
            'Something went wrong. Please try again or email us directly.',
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
    talk: {
        ngoKicker: 'For NGOs',
        ngoHeading: 'Have a problem worth solving?',
        ngoText: 'You’re an NGO and interested? Speak with us — grab a slot below and we’ll explore whether we can help.',
        studentKicker: 'For students',
        studentHeading: 'Want to make an impact?',
        studentText: 'You’re a student who’s passionate about having an impact? Whatever your background, there’s something for you at Coding for Change.',
        studentCta: 'Join the club',
    },
    sponsors: {
        title: 'Sponsors', subtitle: 'Our Supporters',
        intro: 'We are grateful for the support of our sponsors who make our work possible. Interested in sponsoring? Reach out to us!',
        tiers: { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze', partner: 'Partners' },
    },
    blog: {
        title: 'News', subtitle: 'Projects, lessons, and reflections from our teams',
        searchPlaceholder: 'Search posts...', all: 'All',
        noPosts: 'No posts found.', back: 'Back to Blog', notFound: 'Post not found.',
    },
    navbar: { title: 'Coding for Change', subtitle: 'Munich Student Club' },
    footer: {
        pages: 'Pages', info: 'Information',
        home: 'Home', projects: 'Projects', team: 'Team', blog: 'Blog',
        sponsors: 'Sponsors', join: 'Join', contact: 'Contact', qa: 'Q&A', partner: 'For NGOs',
        privacy: 'Privacy', imprint: 'Imprint', cookieSettings: 'Cookie settings',
    },
    aboutPage: {
        valuesTitle: 'What we care about',
        values: [
            { title: 'Real work, real stakes', text: 'No toy projects. Everything we build goes into production and gets used by real people.' },
            { title: 'Craft over credit', text: 'We ship things we are proud to put our names on — documented, maintainable, handed over cleanly.' },
            { title: 'Open to every discipline', text: 'Great software needs more than engineers. Product, design, comms and operations shape every project.' },
            { title: 'Impact you can point at', text: 'Success is measured by what changes for our partner and the people they serve — not by lines of code.' },
        ],
    },
    partner: {
        kicker: 'For NGOs',
        fallbackTitle: 'Have a problem worth solving? Let’s build it together.',
        fallbackLead: 'We partner with non-profits to design and ship the software they need — free of charge, delivered by a dedicated student team in a single semester.',
        talkCta: 'Start a conversation',
    },
    notFound: {
        kicker: 'Error 404',
        title: 'This page wandered off',
        lead: "The page you're looking for doesn't exist or may have moved — but there's plenty more to explore. Let's get you back on track.",
        backHome: 'Back to home',
        helpfulLinks: 'Or head somewhere useful',
        projects: 'Our projects',
        join: 'Join us',
    },
};

const de: Translations = {
    nav: {
        home: 'Start', events: 'Events', projects: 'Projekte',
        sponsors: 'Sponsoren', team: 'Team', blog: 'Blog', qa: 'F&A', join: 'Mitmachen', contact: 'Kontakt',
        partner: 'Für NGOs',
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
        heroLineOne: 'Tech trifft soziale Wirkung',
        heroLineTwo: 'Ein Match wie im Himmel',
    },
    about: {
        title: 'Über Uns',
        kicker: 'Wer wir sind',
        oneLiner: 'Wir entwickeln Software für NGOs, damit sie sich auf ihre Mission konzentrieren können.',
        pitch: 'NGOs haben die Mission. Studierende haben die Fähigkeiten. Wir bringen beide zusammen.',
        stats: [
            { value: '4', label: 'NGOs unterstützt' },
            { value: '10+', label: 'Aktive Mitglieder' },
            { value: '150+', label: 'Nutzer:innen sparen Zeit' },
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
        heading: 'Bereit, etwas Großartiges zu bauen?',
        text: 'Ob Studierende:r, die:der echten Code liefern will, oder NGO mit einem Problem, das es zu lösen lohnt – sprechen Sie mit uns.',
        join: 'Mitglied werden',
        contact: 'Partner werden',
    },
    projects: {
        title: 'Projekte', subtitle: 'Technologie für das Gemeinwohl',
        intro: 'Wir arbeiten mit NGOs zusammen, um Softwarelösungen zu entwickeln, die wirklich etwas bewirken. Jedes Projekt wird von Studierendenteams geleitet und in enger Zusammenarbeit mit unseren Partnern entwickelt.',
        viewAll: 'Alle Projekte ansehen',
        more: 'Weitere Projekte',
        status: { active: 'Aktiv', completed: 'Abgeschlossen', recruiting: 'Team gesucht' },
    },
    threed: {
        kicker: 'Einfach zum Spaß',
        title: 'Lust auf die szenische Route? Probier die 3D-Seite.',
        text: 'Es gibt eine verspielte 3D-Version dieser Seite – ein kleiner Retro-Desktop, den du direkt im Browser anklicken und erkunden kannst.',
        cta: '3D-Erlebnis starten',
        backKicker: 'Du bist im 3D-Modus',
        backTitle: 'Lieber die schnelle, schlichte Version?',
        backText: 'Du erkundest gerade die 3D-Version der Seite. Wechsle jederzeit zurück zur normalen Seite – dort kommst du schneller voran.',
        backCta: 'Zurück zur normalen Seite',
    },
    projectDetail: {
        back: 'Zurück zu Projekten', problem: 'Das Problem', approach: 'Unser Vorgehen',
        outcome: 'Was wir geliefert haben', impact: 'Wirkung', stack: 'Gebaut mit', links: 'Links',
        timeline: 'Ablauf', team: 'Das Team',
    },
    caseStudy: {
        chooseKicker: 'Zwei Perspektiven',
        chooseTitle: 'Wie möchten Sie es lesen?',
        technicalCardTitle: 'Technischer Deep-Dive',
        technicalCardText: 'Wie wir es gebaut haben – das Problem, unser Vorgehen und der Stack. Ideal, wenn du als Studierende:r übers Mitmachen nachdenkst.',
        impactCardTitle: 'Impact-Story',
        impactCardText: 'Was ein solches Projekt für Ihre Organisation bedeuten könnte. Ideal, wenn Sie als NGO eine Partnerschaft erwägen.',
        technicalLabel: 'Technischer Deep-Dive',
        impactLabel: 'Impact-Story',
        joinHeading: 'Willst du sowas bauen?',
        joinText: 'Genau solche echte, ausgelieferte Software baust du als Mitglied – im Team, mit echtem Partner und Menschen, die darauf angewiesen sind.',
        joinButton: 'Mitglied werden',
        challengeHeading: 'Die Herausforderung',
        solutionHeading: 'Was wir gebaut haben',
        resultsHeading: 'Die Wirkung',
        workingHeading: 'Zusammenarbeit mit uns',
        workingPoints: [
            'Kostenlos – finanziert durch unsere universitäre Anbindung und Sponsoren',
            'Geliefert in einem Semester von einem festen Studierendenteam',
            'Das Ergebnis gehört Ihnen – dokumentiert, übergeben, kein Lock-in',
        ],
        partnerLink: 'So funktioniert eine Partnerschaft',
        faqHeading: 'Fragen von NGOs',
        bookHeading: 'Ein Problem, das es zu lösen lohnt?',
        bookText: 'Erzählen Sie uns davon – wählen Sie einen Termin und wir schauen, ob wir helfen können.',
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
        intro: 'Lernen Sie das Team kennen, das Coding for Change antreibt. Wir sind eine vielfältige Gruppe von Studierenden, die Technologie für soziale Zwecke einsetzen wollen.',
        advisersTitle: 'Beirat',
        experienceLabel: 'Zuvor bei',
    },
    qa: {
        title: 'F&A', subtitle: 'Häufig Gestellte Fragen',
        intro: 'Hier finden Sie Antworten auf häufige Fragen zu Coding for Change.',
    },
    join: {
        benefits: 'Was du bekommst', requirements: 'Wen wir suchen',
        waysToContribute: 'Wie du mitwirken kannst', applyNow: 'Jetzt bewerben',
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
        waitlistTitle: 'Bewerbungen sind derzeit geschlossen',
        waitlistLead:
            'Trag dich ein und erfahre als Erste:r, wenn die Bewerbungen wieder öffnen – wir schreiben dir sofort, sobald es so weit ist.',
        waitlistEmailLabel: 'E-Mail:',
        waitlistEmailPlaceholder: 'du@beispiel.de',
        waitlistButton: 'Benachrichtigt mich',
        waitlistSubmitting: 'Wird eingetragen…',
        waitlistSuccess:
            'Du stehst auf der Liste! Wir melden uns, sobald die Bewerbungen wieder öffnen.',
        waitlistError:
            'Etwas ist schiefgelaufen. Bitte versuche es erneut oder schreib uns direkt.',
    },
    contact: {
        title: 'Kontakt',
        intro: 'Ob NGO auf der Suche nach jemandem, der ein kniffliges Problem mithilfe von Technologie löst, oder einfach neugierig auf unsere Arbeit – wir freuen uns, von Ihnen zu hören!',
        nameLabel: 'Ihr Name:', namePlaceholder: 'Name',
        emailLabel: 'E-Mail:', emailPlaceholder: 'E-Mail',
        orgLabel: 'Organisation/NGO (optional):', orgPlaceholder: 'Name der Organisation oder NGO',
        messageLabel: 'Nachricht:', messagePlaceholder: 'Nachricht',
        sendMessage: 'Nachricht senden',
        emailClientNote: 'Damit wird Ihr E-Mail-Programm geöffnet, um die Nachricht zu senden',
        requiredNote: '* = Pflichtfeld',
        submitting: 'Wird gesendet…',
        sendError:
            'Beim Senden Ihrer Nachricht ist etwas schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt eine E-Mail.',
        loadingForm: 'Formular wird geladen…',
        formUnavailable:
            'Das Kontaktformular ist derzeit nicht verfügbar. Bitte schreiben Sie uns direkt eine E-Mail.',
        successFallback: 'Danke! Ihre Nachricht wurde gesendet.',
    },
    book: {
        title: 'Termin buchen',
        intro: 'Lieber sprechen? Wählen Sie einen passenden Slot und wir treffen uns dort.',
        fallback: 'Online-Buchung ist noch nicht eingerichtet — schreiben Sie uns und wir finden einen Termin.',
        openInNewTab: 'Buchungsseite öffnen',
    },
    talk: {
        ngoKicker: 'Für NGOs',
        ngoHeading: 'Ein Problem, das es zu lösen lohnt?',
        ngoText: 'Sie sind eine NGO und interessiert? Sprechen Sie mit uns – buchen Sie unten einen Termin und wir schauen, ob wir helfen können.',
        studentKicker: 'Für Studierende',
        studentHeading: 'Willst du etwas bewegen?',
        studentText: 'Du bist Studierende:r und brennst dafür, etwas zu bewirken? Egal welcher Hintergrund – bei Coding for Change ist etwas für dich dabei.',
        studentCta: 'Mitglied werden',
    },
    sponsors: {
        title: 'Sponsoren', subtitle: 'Unsere Unterstützer',
        intro: 'Wir sind dankbar für die Unterstützung unserer Sponsoren, die unsere Arbeit erst möglich machen. Interesse am Sponsoring? Melden Sie sich bei uns!',
        tiers: { platinum: 'Platin', gold: 'Gold', silver: 'Silber', bronze: 'Bronze', partner: 'Partner' },
    },
    blog: {
        title: 'News', subtitle: 'Projekte, Erkenntnisse und Rückblicke unserer Teams',
        searchPlaceholder: 'Beiträge durchsuchen...', all: 'Alle',
        noPosts: 'Keine Beiträge gefunden.', back: 'Zurück zum Blog', notFound: 'Beitrag nicht gefunden.',
    },
    navbar: { title: 'Coding for Change', subtitle: 'Münchner Studierendenclub' },
    footer: {
        pages: 'Seiten', info: 'Informationen',
        home: 'Startseite', projects: 'Projekte', team: 'Team', blog: 'Blog',
        sponsors: 'Sponsoren', join: 'Mitmachen', contact: 'Kontakt', qa: 'F&A', partner: 'Für NGOs',
        privacy: 'Datenschutz', imprint: 'Impressum', cookieSettings: 'Cookie-Einstellungen',
    },
    aboutPage: {
        valuesTitle: 'Worauf es uns ankommt',
        values: [
            { title: 'Echte Arbeit, echte Verantwortung', text: 'Keine Spielprojekte. Alles, was wir bauen, geht in Produktion und wird von echten Menschen genutzt.' },
            { title: 'Handwerk vor Anerkennung', text: 'Wir liefern Dinge, auf die wir stolz sind – dokumentiert, wartbar, sauber übergeben.' },
            { title: 'Offen für jede Disziplin', text: 'Gute Software braucht mehr als Entwickler:innen. Produkt, Design, Kommunikation und Operations prägen jedes Projekt.' },
            { title: 'Wirkung, auf die man zeigen kann', text: 'Erfolg misst sich daran, was sich für unsere Partner und die Menschen, die sie erreichen, verändert – nicht an Codezeilen.' },
        ],
    },
    partner: {
        kicker: 'Für NGOs',
        fallbackTitle: 'Ein Problem, das es zu lösen lohnt? Lass es uns gemeinsam bauen.',
        fallbackLead: 'Wir entwickeln gemeinsam mit gemeinnützigen Organisationen die Software, die sie brauchen – kostenlos, geliefert von einem festen Studierendenteam in einem einzigen Semester.',
        talkCta: 'Gespräch starten',
    },
    notFound: {
        kicker: 'Fehler 404',
        title: 'Diese Seite ist abhandengekommen',
        lead: 'Die gesuchte Seite existiert nicht oder wurde verschoben — es gibt aber noch viel zu entdecken. Wir bringen Sie zurück auf den richtigen Weg.',
        backHome: 'Zurück zur Startseite',
        helpfulLinks: 'Oder gehen Sie direkt weiter',
        projects: 'Unsere Projekte',
        join: 'Mitmachen',
    },
};

export const translations: Record<Locale, Translations> = { en, de };
