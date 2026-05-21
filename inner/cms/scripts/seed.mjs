/**
 * Development seed — fills the CMS with representative sample content so the
 * site can be reviewed in a populated state.
 *
 * It talks to the running CMS over its REST API, so it needs the CMS to be
 * up. Run it inside the Docker stack:
 *
 *   docker compose exec cms pnpm seed
 *
 * Plain JavaScript on purpose: it runs with bare `node`, with no TypeScript
 * transpilation or bundler, so it is immune to the module-resolution issues
 * that `payload run` hits in this project.
 *
 * It is safe to rerun: if content already exists the script does nothing.
 * To reseed from scratch, recreate the database volume
 * (`docker compose down -v`) and run it again.
 *
 * Admin credentials and content are sample data for local development only.
 * Override the admin login with SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD, and
 * the target with SEED_BASE_URL (defaults to the CMS on localhost:3000).
 *
 * Note: image/logo upload fields are left empty — uploads need real files.
 * Add imagery in the admin panel if you want it.
 */

const BASE = (process.env.SEED_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@codingforchange.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe!1234';

const siteConfig = {
  clubName: 'Coding for Change',
  tagline: 'Students building software for social good',
  description:
    'Coding for Change is a student initiative at the Technical University ' +
    'of Munich. We build software for non-profits, host hackathons, and ' +
    'bring students together to use code for social good. Every project ' +
    'pairs student developers with a real NGO client and ships within a ' +
    'semester.',
  email: 'team@codingforchange.com',
  socialLinks: [
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/coding-for-change/' },
    { platform: 'GitHub', url: 'https://github.com/coding-for-change' },
    { platform: 'Instagram', url: 'https://www.instagram.com/codingforchange/' },
  ],
  copyrightText: '© 2026 Coding for Change',
  windowTitle: 'Coding for Change',
};

const membership = {
  title: 'Become a Member',
  description:
    'Join a community of students using their technical skills to make a ' +
    'real difference. No prior experience with NGO software is needed — we ' +
    'onboard members of all levels and you learn on a real project with a ' +
    'real client.',
  benefits: [
    { text: 'Ship real software for a real non-profit client' },
    { text: 'Learn full-stack development with guidance from experienced leads' },
    { text: 'Build a portfolio of high-impact, production projects' },
    { text: 'Connect with Munich’s tech and social-impact community' },
    { text: 'Workshops, hackathons, and socials throughout the semester' },
  ],
  requirements: [
    { text: 'Enrolled as a student at TUM or another Munich university' },
    { text: 'Around 4–6 hours per week during the semester' },
    { text: 'Enthusiasm to learn — all skill levels are welcome' },
  ],
  contactEmail: 'join@codingforchange.com',
};

const team = [
  {
    name: 'Lena Hofmann',
    role: 'President',
    bio: 'Computer science master’s student who founded Coding for Change after a semester volunteering with a local NGO. Keeps the teams aligned and the coffee flowing.',
    links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/' }],
  },
  {
    name: 'Jonas Weber',
    role: 'Vice President',
    bio: 'Backend developer focused on partnerships. Spends his time making sure every NGO gets a project team that fits their needs.',
    links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/' }],
  },
  {
    name: 'Aisha Khan',
    role: 'Project Lead',
    bio: 'Full-stack developer who has led three NGO projects from kickoff to handoff. Passionate about mentoring first-time contributors.',
    links: [{ label: 'GitHub', url: 'https://github.com/' }],
  },
  {
    name: 'Maximilian Bauer',
    role: 'Treasurer',
    bio: 'Information systems student keeping the club’s finances and grant applications in order so the teams can focus on building.',
    links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/' }],
  },
  {
    name: 'Sofia Rossi',
    role: 'Design Lead',
    bio: 'Designer and front-end developer making sure the software we hand to partners is as usable as it is functional.',
    links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/' }],
  },
  {
    name: 'David Müller',
    role: 'Outreach Lead',
    bio: 'Runs hackathons, workshops, and the partner pipeline. If Coding for Change is at an event in Munich, David organised it.',
    links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/' }],
  },
];

const projects = [
  {
    title: 'Volunteer Portal',
    ngoPartner: 'Münchner Tafel',
    description:
      'A web portal for coordinating volunteer shifts and food-bank logistics, replacing a tangle of spreadsheets and phone calls.',
    technologies: [{ name: 'React' }, { name: 'Node.js' }, { name: 'PostgreSQL' }],
    status: 'completed',
    links: [{ label: 'Case study', url: 'https://codingforchange.com/projects' }],
  },
  {
    title: 'Donation Tracker',
    ngoPartner: 'Lebenshilfe München',
    description:
      'A dashboard that gives the fundraising team a live view of donations, recurring givers, and campaign performance.',
    technologies: [{ name: 'Next.js' }, { name: 'TypeScript' }, { name: 'Prisma' }],
    status: 'active',
    links: [],
  },
  {
    title: 'Mentorship Matching Platform',
    ngoPartner: 'Start with a Friend',
    description:
      'An algorithm-assisted tool that pairs newcomers with local mentors based on language, interests, and availability.',
    technologies: [{ name: 'React' }, { name: 'Python' }, { name: 'FastAPI' }],
    status: 'active',
    links: [],
  },
  {
    title: 'Impact Dashboard',
    ngoPartner: 'Green City e.V.',
    description:
      'A public dashboard visualising the environmental impact of the organisation’s urban greening projects across Munich.',
    technologies: [{ name: 'Vue' }, { name: 'D3.js' }],
    status: 'recruiting',
    links: [],
  },
  {
    title: 'Event Management Tool',
    ngoPartner: 'Caritas München',
    description:
      'An internal tool for scheduling community events, tracking attendance, and sending reminders to participants.',
    technologies: [{ name: 'React' }, { name: 'Express' }, { name: 'MongoDB' }],
    status: 'completed',
    links: [{ label: 'Repository', url: 'https://github.com/coding-for-change' }],
  },
];

const events = [
  {
    title: 'Semester Kickoff',
    date: 'April 15, 2026',
    time: '18:00',
    location: 'TUM Main Campus, Room 1100',
    description:
      'Meet the teams, hear about this semester’s NGO projects, and find out how to get involved. Pizza provided.',
    type: 'Info-session',
    isUpcoming: true,
  },
  {
    title: 'Code for Good Hackathon',
    date: 'May 23–24, 2026',
    time: '09:00',
    location: 'TUM Garching, Informatics Building',
    description:
      'A 24-hour hackathon where student teams build prototypes for real challenges submitted by Munich non-profits.',
    type: 'Hackathon',
    isUpcoming: true,
    link: { label: 'Register', url: 'https://codingforchange.com/events' },
  },
  {
    title: 'Intro to React Workshop',
    date: 'May 8, 2026',
    time: '17:00',
    location: 'Online',
    description:
      'A hands-on beginner workshop covering components, state, and hooks — everything you need for your first project team.',
    type: 'Workshop',
    isUpcoming: true,
  },
  {
    title: 'End-of-Semester Social',
    date: 'July 18, 2026',
    time: '19:00',
    location: 'Munich City Centre',
    description:
      'Celebrate the projects we shipped this semester with the teams and our partner organisations.',
    type: 'Social',
    isUpcoming: true,
  },
  {
    title: 'Winter Hackathon 2025',
    date: 'December 6, 2025',
    time: '10:00',
    location: 'TUM Garching',
    description:
      'Our winter hackathon produced four NGO prototypes, two of which became full project teams this semester.',
    type: 'Hackathon',
    isUpcoming: false,
  },
  {
    title: 'Git & GitHub Workshop',
    date: 'November 12, 2025',
    time: '17:00',
    location: 'TUM Main Campus',
    description: 'An introduction to version control and collaboration workflows for new members.',
    type: 'Workshop',
    isUpcoming: false,
  },
];

const faqs = [
  {
    question: 'Do I need prior experience to join?',
    answer:
      'No. We onboard members of all levels and pair newcomers with experienced leads. Curiosity and commitment matter more than a polished CV.',
    category: 'general',
  },
  {
    question: 'How much time does membership require?',
    answer:
      'Plan for around 4–6 hours per week during the semester. Project teams set their own schedules around your studies.',
    category: 'membership',
  },
  {
    question: 'Is there a membership fee?',
    answer: 'No. Coding for Change is free to join — we are funded by sponsors and university support.',
    category: 'membership',
  },
  {
    question: 'How are projects chosen?',
    answer:
      'We scope projects with NGO partners that can be delivered within a semester, then match each one with a student team based on skills and interest.',
    category: 'projects',
  },
  {
    question: 'Can my organisation request a project?',
    answer:
      'Yes. Non-profits can reach out through our contact form. We work pro bono with mission-aligned organisations.',
    category: 'projects',
  },
  {
    question: 'What technologies do you use?',
    answer:
      'It depends on the project, but most teams work with React, TypeScript, and Node.js. We choose the stack that best fits the partner’s needs.',
    category: 'technical',
  },
  {
    question: 'Do I need to study computer science?',
    answer:
      'Not at all. We welcome students from any programme — designers, product-minded students, and developers all have a place here.',
    category: 'general',
  },
];

const sponsors = [
  {
    name: 'Technical University of Munich',
    tier: 'partner',
    url: 'https://www.tum.de/',
    description: 'Our home university, providing space, accreditation, and a community of students to draw on.',
  },
  {
    name: 'UnternehmerTUM',
    tier: 'gold',
    url: 'https://www.unternehmertum.de/',
    description: 'Munich’s centre for innovation and entrepreneurship, supporting our hackathons and events.',
  },
  {
    name: 'GitHub Education',
    tier: 'silver',
    url: 'https://education.github.com/',
    description: 'Provides tooling and resources that keep our project teams shipping.',
  },
  {
    name: 'Munich Tech Collective',
    tier: 'bronze',
    url: 'https://codingforchange.com/sponsors',
    description: 'A local network connecting student initiatives with mentors.',
  },
  {
    name: 'Code Foundation e.V.',
    tier: 'bronze',
    url: 'https://codingforchange.com/sponsors',
    description: 'Backs grassroots tech-for-good work across Germany.',
  },
];

/** POST JSON helper. */
const postJson = async (path, body, cookie) => {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  });
  return res;
};

/** Extract the Payload auth cookie (name=value) from a login response. */
const authCookieFrom = (res) => {
  const cookies = res.headers.getSetCookie?.() || [];
  const tokenCookie = cookies.find((c) => c.startsWith('payload-token='));
  return tokenCookie ? tokenCookie.split(';')[0] : null;
};

/** Log in, creating the first admin user if the CMS has none yet. */
const authenticate = async () => {
  const creds = { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };

  let res = await postJson('/api/users/login', creds);
  if (!res.ok) {
    // No matching user — create the first admin account.
    let created = await postJson('/api/users/first-register', creds);
    if (!created.ok) {
      // Older/newer Payload may not expose first-register; plain create is
      // permitted while the users collection is empty.
      created = await postJson('/api/users', creds);
    }
    if (!created.ok) {
      throw new Error(`Could not create admin user: ${created.status} ${await created.text()}`);
    }
    res = await postJson('/api/users/login', creds);
  }
  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  }
  const cookie = authCookieFrom(res);
  if (!cookie) throw new Error('Login succeeded but no auth cookie was returned');
  return cookie;
};

/** Poll the CMS until it answers — it may still be booting after `up`. */
const waitForCms = async () => {
  const deadline = Date.now() + 90_000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/api/team?limit=1`);
      if (res.ok) return res;
      lastError = new Error(`HTTP ${res.status}`);
    } catch (error) {
      lastError = error;
    }
    process.stdout.write('.');
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  throw new Error(`CMS not reachable at ${BASE} — is it running? (${lastError?.message})`);
};

const seed = async () => {
  console.log(`Seeding CMS at ${BASE}`);

  // Wait for the CMS to be reachable, then check whether it is already
  // populated (read access is public, so this needs no auth).
  const existing = await waitForCms();
  const json = await existing.json();
  if ((json.totalDocs ?? 0) > 0) {
    console.log('\nCMS already has content — nothing to do.');
    console.log('To reseed from scratch: docker compose down -v, then up again.');
    return;
  }

  const cookie = await authenticate();
  console.log(`Authenticated as ${ADMIN_EMAIL}`);

  await postJson('/api/globals/site-config', siteConfig, cookie).then(assertOk('site-config global'));
  await postJson('/api/globals/membership', membership, cookie).then(assertOk('membership global'));
  console.log('Updated globals: site-config, membership');

  const collections = [
    ['team', team],
    ['projects', projects],
    ['events', events],
    ['faq', faqs],
    ['sponsors', sponsors],
  ];
  for (const [slug, items] of collections) {
    for (const item of items) {
      await postJson(`/api/${slug}`, item, cookie).then(assertOk(`${slug} entry`));
    }
    console.log(`Created ${items.length} ${slug} entries`);
  }

  console.log('\nSeed complete. Admin login:');
  console.log(`  email:    ${ADMIN_EMAIL}`);
  console.log(`  password: ${ADMIN_PASSWORD}`);
};

/** Returns a .then() handler that throws on a non-OK response. */
const assertOk = (label) => async (res) => {
  if (!res.ok) {
    throw new Error(`Failed to create ${label}: ${res.status} ${await res.text()}`);
  }
};

seed().catch((error) => {
  console.error('\nSeed failed:', error.message || error);
  process.exit(1);
});
