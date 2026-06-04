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
    };
    about: {
        title: string;
        mission: string; missionText: string;
        whatWeDo: string; whatWeDoText: string;
        howItWorks: string;
        step1Title: string; step1Text: string;
        step2Title: string; step2Text: string;
        step3Title: string; step3Text: string;
        getInvolvedPre: string; qaLink: string;
        getInvolvedMid: string; contactLink: string; getInvolvedPost: string;
        joinPre: string; memberLink: string; joinPost: string;
    };
    projects: { title: string; subtitle: string; intro: string; };
    events: {
        title: string; subtitle: string; intro: string;
        upcoming: string; past: string;
    };
    team: { title: string; subtitle: string; intro: string; };
    qa: { title: string; subtitle: string; intro: string; };
    join: {
        benefits: string; requirements: string; applyNow: string;
        nameLabel: string; namePlaceholder: string;
        emailLabel: string; emailPlaceholder: string;
        motivationLabel: string; motivationPlaceholder: string;
        sendApplication: string; unavailable: string;
    };
    contact: {
        title: string; intro: string;
        nameLabel: string; namePlaceholder: string;
        emailLabel: string; emailPlaceholder: string;
        orgLabel: string; orgPlaceholder: string;
        messageLabel: string; messagePlaceholder: string;
        sendMessage: string; emailClientNote: string; requiredNote: string;
    };
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
    },
    about: {
        title: 'About Us',
        mission: 'Our Mission',
        missionText: 'We believe that technology should serve everyone. Many NGOs and non-profit organizations have great ideas and important missions but lack the technical resources to bring them to life. At the same time, CS students are eager to apply their skills to real-world problems. Coding for Change bridges this gap.',
        whatWeDo: 'What We Do',
        whatWeDoText: 'We partner with NGOs in and around Munich to build software solutions — from websites and apps to data dashboards and automation tools. Each project is developed by a team of student volunteers, guided by experienced team leads, and delivered in close collaboration with the partner organization.',
        howItWorks: 'How It Works',
        step1Title: '1. Partner Matching:', step1Text: 'We identify NGOs with technology needs and match them with a student team.',
        step2Title: '2. Project Development:', step2Text: 'Teams work in agile sprints over the course of a semester to deliver a working product.',
        step3Title: '3. Handoff & Support:', step3Text: 'Completed projects are handed off to the NGO with documentation and optional ongoing support.',
        getInvolvedPre: 'Have questions or want to get involved? Check out our',
        qaLink: 'Q&A page',
        getInvolvedMid: 'or reach out via the',
        contactLink: 'contact form',
        getInvolvedPost: 'You can also email us at',
        joinPre: 'Interested in joining us? Check out the',
        memberLink: 'membership page',
        joinPost: 'to learn more about how you can get involved!',
    },
    projects: {
        title: 'Projects', subtitle: 'Building Tech for Social Good',
        intro: 'We partner with NGOs to build software solutions that make a real difference. Each project is led by student teams and developed in close collaboration with our partners.',
    },
    events: {
        title: 'Events', subtitle: 'Workshops, Hackathons & More',
        intro: 'Join us at our upcoming events or check out what we have been up to!',
        upcoming: 'Upcoming Events', past: 'Past Events',
    },
    team: {
        title: 'Our Team', subtitle: 'The People Behind CFC',
        intro: 'Meet the team that drives Coding for Change. We are a diverse group of students passionate about using technology for social good.',
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
    },
    contact: {
        title: 'Contact',
        intro: 'Whether you are an NGO looking for tech support, a student wanting to join, or just curious about what we do — we would love to hear from you!',
        nameLabel: 'Your name:', namePlaceholder: 'Name',
        emailLabel: 'Email:', emailPlaceholder: 'Email',
        orgLabel: 'Organization/NGO (optional):', orgPlaceholder: 'Organization or NGO name',
        messageLabel: 'Message:', messagePlaceholder: 'Message',
        sendMessage: 'Send Message',
        emailClientNote: 'This will open your email client to send the message',
        requiredNote: '* = required',
    },
    sponsors: {
        title: 'Sponsors', subtitle: 'Our Supporters',
        intro: 'We are grateful for the support of our sponsors who make our work possible. Interested in sponsoring? Reach out to us!',
    },
    blog: {
        title: 'Engineering Blog', subtitle: 'Projects, lessons, and reflections from our teams',
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
    },
    about: {
        title: 'Über Uns',
        mission: 'Unsere Mission',
        missionText: 'Wir glauben, dass Technologie allen zugutekommen sollte. Viele NGOs und gemeinnützige Organisationen haben großartige Ideen und wichtige Missionen, aber es fehlen ihnen die technischen Ressourcen, um diese umzusetzen. Gleichzeitig möchten Informatikstudent:innen ihre Fähigkeiten auf reale Probleme anwenden. Coding for Change schlägt diese Brücke.',
        whatWeDo: 'Was Wir Tun',
        whatWeDoText: 'Wir kooperieren mit NGOs in und um München, um Softwarelösungen zu entwickeln – von Websites und Apps bis hin zu Daten-Dashboards und Automatisierungstools. Jedes Projekt wird von einem Team aus studentischen Freiwilligen umgesetzt, von erfahrenen Teamleads begleitet und in enger Zusammenarbeit mit der Partnerorganisation geliefert.',
        howItWorks: 'So Funktioniert Es',
        step1Title: '1. Partner-Matching:', step1Text: 'Wir identifizieren NGOs mit Technologiebedarf und stellen sie einem Studierendenteam vor.',
        step2Title: '2. Projektentwicklung:', step2Text: 'Teams arbeiten in agilen Sprints über ein Semester hinweg, um ein funktionierendes Produkt zu liefern.',
        step3Title: '3. Übergabe & Support:', step3Text: 'Fertige Projekte werden mit Dokumentation an die NGO übergeben, optional mit weiterem Support.',
        getInvolvedPre: 'Fragen oder möchtest du mitmachen? Schau auf unserer',
        qaLink: 'F&A-Seite',
        getInvolvedMid: 'nach oder wende dich über unser',
        contactLink: 'Kontaktformular',
        getInvolvedPost: 'an uns. Du kannst uns auch direkt per E-Mail erreichen:',
        joinPre: 'Möchtest du mitmachen? Schau auf der',
        memberLink: 'Mitgliedschaftsseite',
        joinPost: 'vorbei, um mehr darüber zu erfahren, wie du dich einbringen kannst!',
    },
    projects: {
        title: 'Projekte', subtitle: 'Technologie für das Gemeinwohl',
        intro: 'Wir arbeiten mit NGOs zusammen, um Softwarelösungen zu entwickeln, die wirklich etwas bewirken. Jedes Projekt wird von Studierendenteams geleitet und in enger Zusammenarbeit mit unseren Partnern entwickelt.',
    },
    events: {
        title: 'Events', subtitle: 'Workshops, Hackathons & Mehr',
        intro: 'Nimm an unseren kommenden Events teil oder schau dir an, was wir bisher erlebt haben!',
        upcoming: 'Kommende Events', past: 'Vergangene Events',
    },
    team: {
        title: 'Unser Team', subtitle: 'Die Menschen hinter CFC',
        intro: 'Lern das Team kennen, das Coding for Change antreibt. Wir sind eine vielfältige Gruppe von Studierenden, die Technologie für soziale Zwecke einsetzen wollen.',
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
    },
    contact: {
        title: 'Kontakt',
        intro: 'Ob NGO auf der Suche nach technischer Unterstützung, Studierende:r mit Interesse am Mitmachen oder einfach neugierig auf unsere Arbeit – wir freuen uns von dir zu hören!',
        nameLabel: 'Dein Name:', namePlaceholder: 'Name',
        emailLabel: 'E-Mail:', emailPlaceholder: 'E-Mail',
        orgLabel: 'Organisation/NGO (optional):', orgPlaceholder: 'Name der Organisation oder NGO',
        messageLabel: 'Nachricht:', messagePlaceholder: 'Nachricht',
        sendMessage: 'Nachricht senden',
        emailClientNote: 'Damit wird dein E-Mail-Programm geöffnet, um die Nachricht zu senden',
        requiredNote: '* = Pflichtfeld',
    },
    sponsors: {
        title: 'Sponsoren', subtitle: 'Unsere Unterstützer',
        intro: 'Wir sind dankbar für die Unterstützung unserer Sponsoren, die unsere Arbeit erst möglich machen. Interesse am Sponsoring? Meld dich bei uns!',
    },
    blog: {
        title: 'Engineering-Blog', subtitle: 'Projekte, Erkenntnisse und Rückblicke unserer Teams',
        searchPlaceholder: 'Beiträge durchsuchen...', all: 'Alle',
        noPosts: 'Keine Beiträge gefunden.', back: 'Zurück zum Blog', notFound: 'Beitrag nicht gefunden.',
    },
    navbar: { title: 'Coding for Change', subtitle: 'Münchner Studierendenclub' },
};

export const translations: Record<Locale, Translations> = { en, de };
