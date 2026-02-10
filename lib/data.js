// =============================================
// TATTVA AI – Complete Mock Data Store
// =============================================

// ... (existing imports and code)

export const ROLES = {
  DEV: 'dev',
  LEAD: 'lead',
  MENTOR: 'mentor',
  EDITOR: 'editor', // Added Editor Role
  MEMBER: 'member',
  FACULTY: 'faculty',
};

export const ROLE_LABELS = {
  [ROLES.DEV]: 'Developer',
  [ROLES.LEAD]: 'Lead',
  [ROLES.MENTOR]: 'Mentor',
  [ROLES.EDITOR]: 'Editor', // Added Label
  [ROLES.MEMBER]: 'Member',
  [ROLES.FACULTY]: 'Faculty',
};

export const ROLE_HIERARCHY = [ROLES.DEV, ROLES.LEAD, ROLES.MENTOR, ROLES.EDITOR, ROLES.MEMBER, ROLES.FACULTY];

export const DOMAINS = [
  {
    id: 'ai-ml',
    name: 'AI / Machine Learning',
    shortName: 'AI/ML',
    icon: '🤖',
    color: '#8b5cf6',
    description: 'Dive into the world of artificial intelligence and machine learning. From neural networks and deep learning to computer vision and NLP — we explore the algorithms shaping the future.',
    learningOutcomes: [
      'Fundamentals of Machine Learning & Deep Learning',
      'Building & training Neural Networks with PyTorch / TensorFlow',
      'Natural Language Processing & Computer Vision',
      'MLOps and model deployment',
      'Research paper reading & implementation',
    ],
    lead: { name: 'Arjun Patel', avatar: '🧑‍💻', year: '3rd Year, CSE' },
    mentors: [
      { name: 'Sneha Reddy', avatar: '👩‍🔬', specialty: 'Computer Vision' },
      { name: 'Karthik M.', avatar: '👨‍💻', specialty: 'NLP & Transformers' },
    ],
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    shortName: 'Web Dev',
    icon: '🌐',
    color: '#3b82f6',
    description: 'Master modern web technologies from frontend frameworks to backend architectures. Build real-world applications using React, Next.js, Node.js, and cloud services.',
    learningOutcomes: [
      'HTML, CSS, JavaScript — advanced level',
      'React.js / Next.js ecosystem',
      'Backend development with Node.js & Express',
      'Database design (SQL & NoSQL)',
      'Cloud deployment & CI/CD pipelines',
    ],
    lead: { name: 'Priya Sharma', avatar: '👩‍💻', year: '3rd Year, IT' },
    mentors: [
      { name: 'Rahul Singh', avatar: '👨‍🎨', specialty: 'Frontend & UI/UX' },
      { name: 'Meera K.', avatar: '👩‍🔧', specialty: 'Backend & APIs' },
    ],
  },
  {
    id: 'android-dev',
    name: 'Android Development',
    shortName: 'Android',
    icon: '📱',
    color: '#06d6a0',
    description: 'Build powerful mobile applications for Android using Kotlin and Jetpack Compose. Learn modern app architecture, material design, and publishing to the Play Store.',
    learningOutcomes: [
      'Kotlin programming fundamentals',
      'Jetpack Compose for modern UI',
      'MVVM architecture & state management',
      'Working with APIs & local databases',
      'App publishing & Play Store deployment',
    ],
    lead: { name: 'Vikram Joshi', avatar: '👨‍💻', year: '4th Year, CSE' },
    mentors: [
      { name: 'Ananya T.', avatar: '👩‍💻', specialty: 'UI/UX for Mobile' },
      { name: 'Dev Kulkarni', avatar: '🧑‍🔧', specialty: 'Backend Integration' },
    ],
  },
];

export const FACULTY = [
  { name: 'Dr. Anil Kumar', title: 'Faculty Coordinator', department: 'Computer Science', avatar: '👨‍🏫' },
  { name: 'Prof. Sunita Rao', title: 'Faculty Advisor', department: 'Information Technology', avatar: '👩‍🏫' },
];

export const TEAM_LEADS = DOMAINS.map(d => ({
  name: d.lead.name,
  domain: d.shortName,
  avatar: d.lead.avatar,
  year: d.lead.year,
  color: d.color,
}));

export const MEMBERS = [
  { id: 1, name: 'Aditya Verma', email: 'aditya@email.com', domain: 'ai-ml', role: ROLES.MEMBER, year: '2nd Year', branch: 'CSE', joinedAt: '2025-08-15', tasksCompleted: 12, totalTasks: 15 },
  { id: 2, name: 'Neha Gupta', email: 'neha@email.com', domain: 'web-dev', role: ROLES.MEMBER, year: '2nd Year', branch: 'IT', joinedAt: '2025-09-01', tasksCompleted: 8, totalTasks: 10 },
  { id: 3, name: 'Rohit Das', email: 'rohit@email.com', domain: 'android-dev', role: ROLES.MEMBER, year: '3rd Year', branch: 'CSE', joinedAt: '2025-07-20', tasksCompleted: 15, totalTasks: 18 },
  { id: 4, name: 'Kavya Nair', email: 'kavya@email.com', domain: 'ai-ml', role: ROLES.MEMBER, year: '2nd Year', branch: 'ECE', joinedAt: '2025-10-01', tasksCompleted: 5, totalTasks: 8 },
  { id: 5, name: 'Saurabh Tiwari', email: 'saurabh@email.com', domain: 'web-dev', role: ROLES.MEMBER, year: '3rd Year', branch: 'CSE', joinedAt: '2025-08-10', tasksCompleted: 10, totalTasks: 12 },
  { id: 6, name: 'Ishita Raj', email: 'ishita@email.com', domain: 'android-dev', role: ROLES.MEMBER, year: '2nd Year', branch: 'IT', joinedAt: '2025-09-15', tasksCompleted: 7, totalTasks: 9 },
  { id: 7, name: 'Manav Desai', email: 'manav@email.com', domain: 'ai-ml', role: ROLES.MEMBER, year: '3rd Year', branch: 'CSE', joinedAt: '2025-07-01', tasksCompleted: 14, totalTasks: 16 },
  { id: 8, name: 'Tanvi Bhatt', email: 'tanvi@email.com', domain: 'web-dev', role: ROLES.MEMBER, year: '2nd Year', branch: 'CSE', joinedAt: '2025-10-10', tasksCompleted: 3, totalTasks: 6 },
];

export const BLOGS = [
  {
    slug: 'introduction-to-transformers',
    title: 'Introduction to Transformer Architecture',
    excerpt: 'Understanding the architecture behind GPT, BERT, and modern LLMs — attention mechanisms, positional encoding, and why transformers changed NLP forever.',
    content: 'The Transformer architecture, introduced in the groundbreaking paper "Attention Is All You Need" by Vaswani et al. in 2017, revolutionized natural language processing...',
    author: 'Arjun Patel',
    authorAvatar: '🧑‍💻',
    date: '2026-02-05',
    category: 'Tutorials',
    domain: 'ai-ml',
    readTime: '8 min read',
    tags: ['AI', 'Transformers', 'NLP', 'Deep Learning'],
    featured: true,
  },
  {
    slug: 'nextjs-server-components',
    title: 'React Server Components in Next.js 14',
    excerpt: 'A deep dive into React Server Components — how they work, when to use them, and how they improve performance in Next.js applications.',
    content: 'React Server Components represent a paradigm shift in how we build React applications...',
    author: 'Priya Sharma',
    authorAvatar: '👩‍💻',
    date: '2026-01-28',
    category: 'Tutorials',
    domain: 'web-dev',
    readTime: '6 min read',
    tags: ['React', 'Next.js', 'Web Dev'],
    featured: true,
  },
  {
    slug: 'jetpack-compose-state-management',
    title: 'State Management in Jetpack Compose',
    excerpt: 'Learn how to manage state effectively in Jetpack Compose using remember, mutableStateOf, and ViewModel patterns.',
    content: 'State management is the backbone of any reactive UI framework...',
    author: 'Vikram Joshi',
    authorAvatar: '👨‍💻',
    date: '2026-01-20',
    category: 'Tutorials',
    domain: 'android-dev',
    readTime: '7 min read',
    tags: ['Android', 'Kotlin', 'Jetpack Compose'],
    featured: false,
  },
  {
    slug: 'tattva-hackathon-2026',
    title: 'Tattva Hackathon 2026 — Results & Highlights',
    excerpt: 'A recap of our annual hackathon: 50+ participants, 12 teams, and incredible projects. Check out the winners and their innovations.',
    content: 'The Tattva Hackathon 2026 was our biggest event yet...',
    author: 'Sneha Reddy',
    authorAvatar: '👩‍🔬',
    date: '2026-01-15',
    category: 'Tattva Capital',
    domain: 'ai-ml',
    readTime: '5 min read',
    tags: ['Hackathon', 'Community', 'Winners'],
    featured: false,
  },
  {
    slug: 'ai-trends-2026',
    title: 'AI Trends to Watch in 2026',
    excerpt: 'From multimodal models to AI agents — the biggest trends shaping the AI landscape this year and what they mean for developers.',
    content: 'The AI landscape in 2026 is evolving at an unprecedented pace...',
    author: 'Karthik M.',
    authorAvatar: '👨‍💻',
    date: '2026-01-10',
    category: 'Tech News',
    domain: 'ai-ml',
    readTime: '6 min read',
    tags: ['AI', 'Trends', 'Industry'],
    featured: true,
  },
  {
    slug: 'building-restful-apis',
    title: 'Building RESTful APIs with Node.js & Express',
    excerpt: 'A practical guide to building scalable REST APIs with proper error handling, authentication, and best practices.',
    content: 'REST APIs are the backbone of modern web applications...',
    author: 'Meera K.',
    authorAvatar: '👩‍🔧',
    date: '2026-01-05',
    category: 'Tutorials',
    domain: 'web-dev',
    readTime: '10 min read',
    tags: ['Node.js', 'Express', 'API', 'Backend'],
    featured: false,
  },
];

export const BLOG_CATEGORIES = ['All', 'Tattva Capital', 'Tech News', 'Tutorials'];

export const EVENTS = [
  {
    id: 1,
    title: 'Workshop: Introduction to Machine Learning',
    type: 'Workshop',
    date: '2026-02-20',
    time: '10:00 AM - 1:00 PM',
    location: 'Seminar Hall A',
    description: 'A hands-on workshop covering ML fundamentals, data preprocessing, and building your first model with scikit-learn.',
    domain: 'ai-ml',
    registeredCount: 45,
    maxCapacity: 60,
    status: 'upcoming',
    speaker: 'Arjun Patel',
  },
  {
    id: 2,
    title: 'Tattva Hackathon 2026 — Spring Edition',
    type: 'Hackathon',
    date: '2026-03-15',
    time: '9:00 AM - 9:00 PM',
    location: 'Innovation Lab',
    description: '12-hour hackathon open to all club members. Build something amazing with your team across any domain!',
    domain: null,
    registeredCount: 32,
    maxCapacity: 80,
    status: 'upcoming',
    speaker: null,
  },
  {
    id: 3,
    title: 'React & Next.js Bootcamp',
    type: 'Bootcamp',
    date: '2026-03-01',
    time: '2:00 PM - 5:00 PM',
    location: 'Lab 204',
    description: 'A 3-week bootcamp covering React fundamentals, Next.js features, and building full-stack applications.',
    domain: 'web-dev',
    registeredCount: 28,
    maxCapacity: 40,
    status: 'upcoming',
    speaker: 'Priya Sharma',
  },
  {
    id: 4,
    title: 'Android App Development Sprint',
    type: 'Workshop',
    date: '2026-02-25',
    time: '11:00 AM - 2:00 PM',
    location: 'Lab 101',
    description: 'Build a complete Todo app with Jetpack Compose in this hands-on sprint session.',
    domain: 'android-dev',
    registeredCount: 20,
    maxCapacity: 30,
    status: 'upcoming',
    speaker: 'Vikram Joshi',
  },
  {
    id: 5,
    title: 'Tech Talk: The Future of AI Agents',
    type: 'Workshop',
    date: '2026-01-10',
    time: '4:00 PM - 5:30 PM',
    location: 'Auditorium',
    description: 'An insightful talk on how AI agents are transforming software development and what it means for the future.',
    domain: 'ai-ml',
    registeredCount: 78,
    maxCapacity: 80,
    status: 'past',
    speaker: 'Dr. Anil Kumar',
  },
];

export const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Welcome to Tattva AI — Spring 2026!',
    message: 'New semester, new opportunities! Check the events page for upcoming workshops and the hackathon.',
    type: 'global',
    domain: null,
    date: '2026-02-01',
    author: 'Arjun Patel',
    priority: 'high',
  },
  {
    id: 2,
    title: 'ML Workshop Registration Open',
    message: 'Register now for the Introduction to Machine Learning workshop on Feb 20.',
    type: 'domain',
    domain: 'ai-ml',
    date: '2026-02-05',
    author: 'Arjun Patel',
    priority: 'normal',
  },
  {
    id: 3,
    title: 'New Resources Added',
    message: 'Check out the new React Server Components tutorial in the resource library.',
    type: 'domain',
    domain: 'web-dev',
    date: '2026-02-03',
    author: 'Priya Sharma',
    priority: 'normal',
  },
];

export const TASKS = [
  {
    id: 1,
    title: 'Complete Python ML Basics Module',
    description: 'Work through the Python machine learning basics course and submit your notebook.',
    domain: 'ai-ml',
    assignedTo: [1, 4, 7],
    assignedBy: 'Sneha Reddy',
    deadline: '2026-02-15',
    status: 'in-progress',
    priority: 'high',
    submissions: [
      { memberId: 7, date: '2026-02-08', status: 'submitted', feedback: null },
    ],
  },
  {
    id: 2,
    title: 'Build a Personal Portfolio Website',
    description: 'Create a responsive personal portfolio using HTML, CSS, and JavaScript.',
    domain: 'web-dev',
    assignedTo: [2, 5, 8],
    assignedBy: 'Rahul Singh',
    deadline: '2026-02-20',
    status: 'in-progress',
    priority: 'medium',
    submissions: [
      { memberId: 5, date: '2026-02-06', status: 'reviewed', feedback: 'Great work! Consider adding animations.' },
    ],
  },
  {
    id: 3,
    title: 'Kotlin Basics Exercises',
    description: 'Complete the Kotlin basics exercise set and push to GitHub.',
    domain: 'android-dev',
    assignedTo: [3, 6],
    assignedBy: 'Ananya T.',
    deadline: '2026-02-18',
    status: 'in-progress',
    priority: 'medium',
    submissions: [],
  },
  {
    id: 4,
    title: 'Read "Attention Is All You Need" Paper',
    description: 'Read the original Transformer paper and write a 500-word summary.',
    domain: 'ai-ml',
    assignedTo: [1, 4, 7],
    assignedBy: 'Karthik M.',
    deadline: '2026-02-10',
    status: 'completed',
    priority: 'high',
    submissions: [
      { memberId: 1, date: '2026-02-07', status: 'reviewed', feedback: 'Excellent summary!' },
      { memberId: 4, date: '2026-02-08', status: 'reviewed', feedback: 'Good understanding.' },
      { memberId: 7, date: '2026-02-06', status: 'reviewed', feedback: 'Well written.' },
    ],
  },
];

export const RESOURCES = [
  { id: 1, title: 'Python for Data Science Handbook', type: 'Notes', domain: 'ai-ml', url: '#', addedBy: 'Sneha Reddy', date: '2025-10-01' },
  { id: 2, title: 'Neural Networks from Scratch (Video Series)', type: 'Video', domain: 'ai-ml', url: '#', addedBy: 'Karthik M.', date: '2025-11-15' },
  { id: 3, title: 'React Official Tutorial', type: 'Notes', domain: 'web-dev', url: '#', addedBy: 'Rahul Singh', date: '2025-09-20' },
  { id: 4, title: 'Full Stack Open Course', type: 'Notes', domain: 'web-dev', url: '#', addedBy: 'Meera K.', date: '2025-10-10' },
  { id: 5, title: 'Kotlin Koans', type: 'GitHub', domain: 'android-dev', url: '#', addedBy: 'Dev Kulkarni', date: '2025-11-01' },
  { id: 6, title: 'Jetpack Compose Samples', type: 'GitHub', domain: 'android-dev', url: '#', addedBy: 'Ananya T.', date: '2025-12-01' },
];

export const JOIN_REQUESTS = [
  { id: 1, name: 'Amit Choudhary', email: 'amit@email.com', branch: 'CSE', year: '2nd Year', domain: 'ai-ml', motivation: 'I am passionate about AI and want to learn ML from experienced mentors.', status: 'pending', date: '2026-02-08' },
  { id: 2, name: 'Pooja Mishra', email: 'pooja@email.com', branch: 'IT', year: '1st Year', domain: 'web-dev', motivation: 'I love building websites and want to learn modern frameworks.', status: 'pending', date: '2026-02-07' },
  { id: 3, name: 'Raj Sharma', email: 'raj@email.com', branch: 'ECE', year: '2nd Year', domain: 'android-dev', motivation: 'Android development fascinates me and I want to build real apps.', status: 'pending', date: '2026-02-06' },
];

export const PROJECTS = [
  {
    id: 1,
    title: 'Tattva AI Chatbot',
    description: 'An AI-powered chatbot for the club website that answers queries about the club and its activities.',
    domain: 'ai-ml',
    status: 'in-progress',
    progress: 65,
    lead: 'Arjun Patel',
    members: ['Aditya Verma', 'Kavya Nair', 'Manav Desai'],
    startDate: '2025-12-01',
  },
  {
    id: 2,
    title: 'Club Management Dashboard',
    description: 'A full-stack dashboard for managing club operations, members, and events.',
    domain: 'web-dev',
    status: 'in-progress',
    progress: 80,
    lead: 'Priya Sharma',
    members: ['Neha Gupta', 'Saurabh Tiwari', 'Tanvi Bhatt'],
    startDate: '2025-11-15',
  },
  {
    id: 3,
    title: 'Club Events App',
    description: 'A mobile app for browsing and registering for club events with push notifications.',
    domain: 'android-dev',
    status: 'planning',
    progress: 20,
    lead: 'Vikram Joshi',
    members: ['Rohit Das', 'Ishita Raj'],
    startDate: '2026-01-10',
  },
];

// DEV system settings (feature toggles)
export const SYSTEM_SETTINGS = {
  registrationsEnabled: true,
  joinRequestsEnabled: true,
  blogPostingEnabled: true,
  eventCreationEnabled: true,
  taskSubmissionsEnabled: true,
  announcementsEnabled: true,
  maintenanceMode: false,
  loginDisabled: false,
  dashboardsFrozen: false,
  leaderboardEnabled: false,
  projectSystemEnabled: true,
  aiFeaturesEnabled: false,
  certificatesEnabled: false,
  internalChatEnabled: false,
};

// Demo user accounts
export const DEMO_USERS = [
  { email: 'dev@tattva.ai', password: 'dev123', role: ROLES.DEV, name: 'System Admin', domain: null },
  { email: 'lead@tattva.ai', password: 'lead123', role: ROLES.LEAD, name: 'Arjun Patel', domain: 'ai-ml' },
  { email: 'mentor@tattva.ai', password: 'mentor123', role: ROLES.MENTOR, name: 'Sneha Reddy', domain: 'ai-ml' },
  { email: 'editor@tattva.ai', password: 'editor123', role: ROLES.EDITOR, name: 'Rohan Verma', domain: null }, // Added Demo Editor
  { email: 'member@tattva.ai', password: 'member123', role: ROLES.MEMBER, name: 'Aditya Verma', domain: 'ai-ml' },
  { email: 'faculty@tattva.ai', password: 'faculty123', role: ROLES.FACULTY, name: 'Dr. Anil Kumar', domain: null },
];
