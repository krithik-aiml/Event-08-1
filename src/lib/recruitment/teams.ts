export const RECRUITMENT_OPEN = true;

export type QuestionType = 'long' | 'short' | 'url';

export interface Question {
  /** Column title in the sheet. Must be unique inside a team and must not be
   *  one of: Timestamp, Application ID, Name, USN. */
  header: string;
  /** Text shown to the applicant (numbering is added automatically). */
  label: string;
  placeholder?: string;
  /** 'long' = textarea (default), 'short' = one line, 'url' = link field. */
  type?: QuestionType;
  rows?: number;
  maxLength?: number;
  /** Optional images / video shown above the answer box (used by Curation). */
  media?: { images?: string[]; videoId?: string };
}

export interface Team {
  slug: string;
  name: string;
  /** One line shown on the card before hover. */
  tagline: string;
  /** Short bullet points shown on hover / when the card is selected. */
  details: string[];
  lead: {
    name: string;
    role: string;
    /** Put the photo in /public/leads/ and reference it as "/leads/<file>". */
    photo: string;
  };
  /** YouTube video id of the lead's intro video. */
  videoId: string;
  questions: Question[];
}

const OTHER_TEAMS: Question = {
  header: 'Other Teams',
  label:
    'Are you interested in being a part of any other team? If so, please specify which team and share why you would like to join that team.',
  placeholder:
    "Technical, Sponsorship, Media, Design, Curation, Event Management or type 'No' if you aren't interested",
  rows: 3,
};

export const DEPARTMENTS = [
  'CSE', 'CSE-IOT', 'CSE-DS', 'ISE', 'ECE', 'AIML',
  'EEE', 'MECH', 'CIVIL', 'BBA', 'BCA', 'BCOM', 'Other',
];
export const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const TEAMS: Team[] = [
  // ───────────────────────── TECHNICAL ─────────────────────────
  {
    slug: 'technical',
    name: 'Technical',
    tagline: 'Build and run everything the audience touches online.',
    details: [
      'TODO: replace with 2-3 points from the team responsibilities PDF',
      'Website, ticketing and event-day systems',
      'Good fit if you like building, breaking and fixing things',
    ],
    lead: { name: 'Lead name', role: 'Technical Lead', photo: '/leads/technical.jpg' },
    videoId: 'W9UmLw_Whxw',
    questions: [
      {
        header: 'Project Description',
        label: "Share a tech project, website, or script you've built or contributed to. What problem did it solve?",
        placeholder: 'Describe the project, stack, and impact',
        rows: 5,
      },
      {
        header: 'Crazy Feature',
        label: 'If you could build one crazy feature for TEDx — no budget limits — what would it be?',
        placeholder: 'Dream big',
      },
      {
        header: 'Incident Response',
        label: "A few hours before the event, the website backend for ticketing stops responding. What's your first move?",
        placeholder: 'Triage steps, comms, rollback, observability',
      },
      {
        header: 'Portfolio Link',
        label: 'Portfolio / GitHub / Website Link (Required)',
        placeholder: 'Paste a link',
        type: 'url',
      },
      {
        header: 'Tools & Next Learning',
        label: `What tools, languages, or frameworks do you vibe with right now — and what's on your "I want to learn this next" list?`,
        placeholder: 'Stacks you love + next-to-learn',
      },
      {
        header: 'One Word',
        label: 'In one word — what do you bring to the team?',
        placeholder: 'One word',
        type: 'short',
        maxLength: 20,
      },
      {
        header: 'Proof Link',
        label: 'Upload or link something that proves you build stuff — a repo, a design, a script, an automation, even a screenshot.',
        placeholder: 'Link(s) and short context',
      },
      {
        header: 'Goals',
        label: 'What do you want to learn, build, or prove here?',
        placeholder: 'Your goals',
      },
      OTHER_TEAMS,
    ],
  },

  // ───────────────────────── EVENT MANAGEMENT ─────────────────────────
  {
    slug: 'event-management',
    name: 'Event Management',
    tagline: 'Turn the plan into a flawless day on the ground.',
    details: [
      'TODO: replace with 2-3 points from the team responsibilities PDF',
      'Logistics, vendors, volunteers and event-day execution',
      'Good fit if you stay calm when things go wrong',
    ],
    lead: { name: 'Lead name', role: 'Event Management Lead', photo: '/leads/event-management.jpg' },
    videoId: 'iB5lyjPt14Y',
    questions: [
      {
        header: 'Why Event Management',
        label: "Why do you want to be part of TEDxCIT's Event Management team?",
        placeholder: 'Share your motivation and what draws you to event management',
      },
      {
        header: 'TEDx Meaning',
        label: 'What does "TEDx" mean to you?',
        placeholder: 'Your understanding and perspective',
      },
      {
        header: 'What Excites You',
        label: 'What excites you most about working in event management?',
        placeholder: 'What aspects of event management energize you?',
      },
      {
        header: 'Handle Pressure',
        label: 'How do you handle work under pressure or tight deadlines?',
        placeholder: 'Describe your approach and give an example if possible',
      },
      {
        header: 'Teamwork Example',
        label: 'Describe a time when you successfully worked as part of a team.',
        placeholder: 'Share a specific example with context and outcome',
        rows: 4,
      },
      {
        header: 'Prior Experience',
        label: 'Do you have any prior experience in logistics, coordination, or event setup?',
        placeholder: "List any relevant experience or type 'None' if you're starting fresh",
      },
      {
        header: 'Preferred Tasks',
        label: 'What kind of tasks would you prefer taking up?',
        placeholder: 'E.g., logistics, vendor coordination, on-ground execution, planning, etc.',
      },
      {
        header: 'Management Strategies',
        label: 'Enlist 3 niche strategies for managing the team well in event management.',
        placeholder: 'List three specific strategies with brief explanations',
        rows: 4,
      },
      {
        header: 'Tackle Non-Working Members',
        label: 'Suppose you are the lead and some member(s) are not working, how will you tackle it?',
        placeholder: 'Describe your leadership approach to handling underperformance',
        rows: 4,
      },
      {
        header: 'Portfolio Link',
        label: 'Upload portfolio & attach your social handles (if you have one)',
        placeholder: 'Paste a portfolio link (Drive/Notion/Behance/etc.)',
        type: 'url',
      },
      {
        header: 'Campaign Idea',
        label: 'Mention a unique campaigning idea for the event.',
        placeholder: 'Share a creative and unique campaign idea for TEDxCIT',
        rows: 4,
      },
      OTHER_TEAMS,
    ],
  },

  // ───────────────────────── SPONSORSHIP ─────────────────────────
  {
    slug: 'sponsorship',
    name: 'Sponsorship',
    tagline: 'Find the partners who make the event possible.',
    details: [
      'TODO: replace with 2-3 points from the team responsibilities PDF',
      'Outreach, pitches, proposals and sponsor relationships',
      'Good fit if you are confident talking to people',
    ],
    lead: { name: 'Lead name', role: 'Sponsorship Lead', photo: '/leads/sponsorship.jpg' },
    videoId: 'ZQmIOtdMJ70',
    questions: [
      {
        header: 'Outreach Strategy',
        label: 'How will you reach out to small or mid-sized businesses for sponsorships or stalls?',
        placeholder: 'Outline your outreach approach',
        rows: 4,
      },
      {
        header: 'Pitch Script',
        label: "What will you say in a call or DM to grab a sponsor's attention?",
        placeholder: 'Write a short pitch script',
      },
      {
        header: 'Channels Used',
        label: 'Which channels or platforms will you use to find and contact small businesses?',
        placeholder: 'e.g., Instagram, LinkedIn, local directories, WhatsApp groups',
      },
      {
        header: 'Business Selection',
        label: 'How will you choose which local businesses to approach for the event?',
        placeholder: 'Selection criteria (relevance, audience fit, locality, etc.)',
      },
      {
        header: 'Relationship Building',
        label: 'How will you build and maintain good relationships with sponsors?',
        placeholder: 'Follow-ups, deliverables, updates, hospitality, post-event reports',
        rows: 4,
      },
      {
        header: 'Proposal Contents',
        label: 'What will you include in a simple and appealing sponsorship proposal?',
        placeholder: 'Benefits, audience, visibility, tiers, pricing, timelines',
        rows: 4,
      },
      {
        header: 'Handle Objections',
        label: 'How will you handle a sponsor saying no or not responding?',
        placeholder: 'Objection handling and re-engagement strategy',
      },
      {
        header: 'Availability Plan',
        label: 'How will you ensure you stay online and reachable to the team and sponsors throughout the duration of the event?',
        placeholder: 'Describe your plan to stay reachable',
      },
      OTHER_TEAMS,
    ],
  },

  // ───────────────────────── CURATION ─────────────────────────
  {
    slug: 'curation',
    name: 'Curation',
    tagline: 'Shape the ideas, words and speakers of the day.',
    details: [
      'TODO: replace with 2-3 points from the team responsibilities PDF',
      'Themes, speaker research, scripts and written content',
      'Good fit if you read widely and write well',
    ],
    lead: { name: 'Lead name', role: 'Curation Lead', photo: '/leads/curation.jpg' },
    videoId: 'M71r_Jmmsd4',
    questions: [
      {
        header: 'Writing Proficiency',
        label: 'How proficient are you with creative writing skills? Please describe your experience and self-assessed proficiency level.',
        placeholder: 'e.g., I have written short stories and blog posts for 2 years, self-assessed proficiency: 8/10',
      },
      {
        header: 'Captions',
        label: 'Write 3 eye-catching captions related to the image.',
        placeholder: 'Write three options separated by new lines',
        rows: 4,
        media: {
          images: [
            'https://res.cloudinary.com/dkbvknwcu/image/upload/v1760461420/Picture3_wtdno4.png',
            'https://res.cloudinary.com/dkbvknwcu/image/upload/v1760461420/Picture2_yflw5y.png',
          ],
        },
      },
      {
        header: 'Theme Ideas',
        label: 'Based on the video, suggest at least two theme ideas for the next TEDx event along with taglines.',
        placeholder: 'Theme idea + short tagline for each',
        rows: 4,
        media: { videoId: 'PY_kd46RfVE' },
      },
      {
        header: 'What Resonates',
        label: 'Which movie/book/music/series do you resonate with most and how did it impact you?',
        placeholder: 'Explain briefly',
        rows: 4,
      },
      {
        header: 'Philosophical Thought',
        label: 'Share a philosophical thought or an idea that you find particularly fascinating.',
        placeholder: 'Your idea',
      },
      {
        header: 'Why Curation',
        label: 'Why have you chosen curation?',
        placeholder: 'Your motivation',
      },
      {
        header: 'AI vs Curators',
        label: 'When we have AI for content, why do you think we need a team of curators?',
        placeholder: 'Your perspective',
      },
      {
        header: 'Content Enhancement',
        label: 'In what aspects would you enhance a given content?',
        placeholder: 'Structure, tone, hooks, call-to-action, etc.',
      },
      {
        header: 'Image Description',
        label: 'For a given image, give us a description based on your creativity.',
        placeholder: 'Write an evocative description',
        media: {
          images: [
            'https://res.cloudinary.com/dkbvknwcu/image/upload/v1760461419/Picture1_oel361.png',
          ],
        },
      },
      OTHER_TEAMS,
    ],
  },

  // ───────────────────────── DESIGN ─────────────────────────
  {
    slug: 'design',
    name: 'Design',
    tagline: 'Give TEDxCIT its look, from posters to the stage.',
    details: [
      'TODO: replace with 2-3 points from the team responsibilities PDF',
      'Posters, social media creatives, stage and branding',
      'Good fit if you have a portfolio, even a small one',
    ],
    lead: { name: 'Lead name', role: 'Design Lead', photo: '/leads/design.jpg' },
    videoId: 'sKUo3XQlszU',
    questions: [
      {
        header: 'Software Proficiency',
        label: 'How proficient are you with the following software: Figma, Adobe Photoshop, Adobe Illustrator, Canva, and any other tools? Please specify your proficiency level for each.',
        placeholder: 'e.g., Figma: Advanced, Adobe Photoshop: Intermediate, Adobe Illustrator: Beginner, Canva: Expert, Sketch: Intermediate',
        rows: 4,
      },
      {
        header: 'Learning New Tools',
        label: 'How comfortable are you with trying new tools or learning on the go?',
        placeholder: 'Share your approach',
      },
      {
        header: 'Engagement Strategies',
        label: 'What strategies do you use to make an event visually and experientially engaging?',
        placeholder: 'Share ideas across visual design and experience',
        rows: 4,
      },
      {
        header: 'Proud Project',
        label: "Tell us about a design project you're proud of and how you made it.",
        placeholder: 'Process, tools, outcome',
        rows: 4,
      },
      {
        header: 'Design Trends',
        label: 'What latest trends in design and technology excite you, and how do you use them?',
        placeholder: 'Trends and applications',
      },
      {
        header: 'Inspiration Sources',
        label: 'What inspires your creative work, and how do you translate it into tangible projects?',
        placeholder: 'Inspiration and execution',
      },
      {
        header: 'Team Communication',
        label: 'TEDx designs often need coordination with curation and tech — how do you communicate your ideas?',
        placeholder: 'Handoffs, feedback loops, tools',
      },
      {
        header: 'Past Work Links',
        label: 'Share past work links (Instagram/Behance/YouTube/Pinterest/Dribbble/Figma/Other)',
        placeholder: 'Paste links here',
      },
      OTHER_TEAMS,
    ],
  },

  // ───────────────────────── MEDIA ─────────────────────────
  {
    slug: 'media',
    name: 'Media',
    tagline: 'Capture the day and tell its story afterwards.',
    details: [
      'TODO: replace with 2-3 points from the team responsibilities PDF',
      'Photography, videography, reels and event-day coverage',
      'Good fit if you edit and post regularly',
    ],
    lead: { name: 'Lead name', role: 'Media Lead', photo: '/leads/media.jpg' },
    videoId: 'lQqc0ytkbKM',
    questions: [
      {
        header: 'Software Proficiency',
        label: 'How proficient are you with the following software: After Effects, Premiere Pro, VN App, CapCut App, and any other tools? Please specify your proficiency level for each.',
        placeholder: 'e.g., After Effects: Intermediate, Premiere Pro: Advanced, VN App: Beginner, CapCut: Expert, Photoshop: Intermediate',
        rows: 4,
      },
      {
        header: 'Proud Project',
        label: "Can you tell us about a media project you're proud of?",
        placeholder: 'Describe the project, goals, outcome and impact',
        rows: 4,
      },
      {
        header: 'Inspiration',
        label: 'What inspires you, and how do you channel that into engaging content?',
        placeholder: 'Your sources of inspiration and creative process',
        rows: 4,
      },
      {
        header: 'New Tools Comfort',
        label: 'How comfortable are you with exploring new tools for trending/visual content?',
        placeholder: 'Share how you learn and adapt to new tools',
      },
      {
        header: 'Engagement Strategy',
        label: 'What strategies do you use to make media engaging on event day and online?',
        placeholder: 'On-ground coverage, reels, posts, captions, etc.',
        rows: 4,
      },
      {
        header: 'Past Work Links',
        label: 'Share past work links (Instagram/Behance/YouTube/Pinterest/Dribbble/Other)',
        placeholder: 'Paste any relevant links here',
      },
      OTHER_TEAMS,
    ],
  },
];

export function getTeam(slug: string | undefined | null): Team | undefined {
  return TEAMS.find((t) => t.slug === slug);
}
