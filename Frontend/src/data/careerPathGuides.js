export const careerPathGuides = {
  higher_education: {
    title: "Higher Education Path",
    icon: "🎓",
    description: "Pursue advanced degrees to specialize in your field",

    options: [
      {
        name: "M.Tech in India",
        duration: "2 years",
        avgCost: "₹2-5 Lakhs (Govt) / ₹8-15 Lakhs (Private)",
        exams: ["GATE"],
        topColleges: [
          "IIT Bombay",
          "IIT Delhi",
          "IIT Madras",
          "IIIT Hyderabad",
          "NIT Trichy",
        ],
        benefits: [
          "Specialize in cutting-edge technologies",
          "Higher starting salary (10-15 LPA average)",
          "Research opportunities",
          "Better career growth",
        ],
        timeline: {
          "Month 1-2": "GATE preparation",
          "Month 3": "GATE exam (February)",
          "Month 4-5": "College applications & counseling",
          "Month 6": "Admissions (July-August)",
        },
      },
      {
        name: "MS Abroad (USA/Europe/Canada)",
        duration: "2 years",
        avgCost: "$30,000 - $80,000",
        exams: ["GRE", "TOEFL/IELTS"],
        topUniversities: [
          "MIT",
          "Stanford",
          "CMU",
          "ETH Zurich",
          "TU Munich",
          "University of Toronto",
        ],
        benefits: [
          "Global exposure & networking",
          "Access to latest research",
          "High-paying international opportunities",
          "Option for PR/work visa",
        ],
        timeline: {
          "Month 1-3": "GRE/TOEFL preparation",
          "Month 4-6": "Shortlist universities, SOP writing",
          "Month 7-9": "Applications (Fall intake)",
          "Month 10-12": "Visa process & travel",
        },
      },
      {
        name: "MBA",
        duration: "2 years",
        avgCost: "₹10-25 Lakhs (IIMs) / $60,000-$150,000 (Abroad)",
        exams: ["CAT", "GMAT", "XAT"],
        topInstitutes: [
          "IIM A/B/C",
          "ISB Hyderabad",
          "Harvard",
          "Stanford",
          "Wharton",
        ],
        benefits: [
          "Switch to management roles",
          "Higher salary potential (15-30 LPA)",
          "Entrepreneurship opportunities",
          "Strong alumni network",
        ],
        timeline: {
          "Month 1-6": "CAT/GMAT preparation",
          "Month 7": "CAT exam (November)",
          "Month 8-10": "WAT/PI preparation",
          "Month 11-12": "Admissions (June onwards)",
        },
      },
      {
        name: "PhD",
        duration: "4-6 years",
        avgCost: "Free (with scholarship) / Stipend provided",
        exams: ["GATE", "NET", "University entrance"],
        benefits: [
          "Become a subject matter expert",
          "Research & teaching career",
          "Contribute to cutting-edge innovation",
          "Academic positions globally",
        ],
        timeline: {
          "Month 1-6": "Identify research area & guide",
          "Month 7-9": "Apply to universities",
          "Month 10-12": "Start PhD program",
        },
      },
    ],

    resources: [
      { name: "GATE preparation", url: "https://gate.iitkgp.ac.in/" },
      { name: "GRE preparation", url: "https://www.ets.org/gre" },
      { name: "CAT preparation", url: "https://iimcat.ac.in/" },
      { name: "College comparison", url: "https://www.shiksha.com/" },
    ],
  },

  skill_development: {
    title: "Skill Development Path",
    icon: "💻",
    description:
      "Enhance your technical skills through certifications and courses",

    options: [
      {
        name: "Full Stack Development",
        duration: "3-6 months",
        avgCost: "₹15,000 - ₹50,000",
        platforms: ["Coursera", "Udemy", "Scaler", "Masai School"],
        skills: ["React", "Node.js", "MongoDB", "AWS", "Docker"],
        certifications: [
          "Meta Front-End Developer",
          "IBM Full Stack Cloud Developer",
          "AWS Certified Developer",
        ],
        careerOpportunities: "Full Stack Developer, MERN Developer (6-12 LPA)",
        topCourses: [
          "The Complete Web Developer Bootcamp (Udemy)",
          "Meta React Specialization (Coursera)",
          "Full Stack Open (Free - University of Helsinki)",
        ],
        benefits: [
          "High demand in job market",
          "Freelancing opportunities",
          "Build complete web applications",
          "Work on both frontend and backend",
        ],
        timeline: {
          "Month 1-2": "Learn HTML, CSS, JavaScript fundamentals",
          "Month 3-4": "Master React and Node.js",
          "Month 5-6": "Build portfolio projects and deploy",
        },
      },
      {
        name: "Data Science & ML",
        duration: "4-8 months",
        avgCost: "₹20,000 - ₹80,000",
        platforms: ["Coursera", "edX", "Great Learning", "upGrad"],
        skills: [
          "Python",
          "Machine Learning",
          "Deep Learning",
          "NLP",
          "Data Visualization",
        ],
        certifications: [
          "Google Data Analytics",
          "IBM Data Science Professional",
          "Deep Learning Specialization (Andrew Ng)",
        ],
        careerOpportunities: "Data Scientist, ML Engineer (8-18 LPA)",
        topCourses: [
          "Machine Learning by Andrew Ng (Coursera)",
          "Applied Data Science with Python (Coursera)",
          "Fast.ai Practical Deep Learning",
        ],
        benefits: [
          "One of the highest paying tech fields",
          "Work on cutting-edge AI projects",
          "High demand across industries",
          "Remote work opportunities",
        ],
        timeline: {
          "Month 1-2": "Python programming and statistics",
          "Month 3-5": "Machine learning algorithms and libraries",
          "Month 6-8": "Deep learning and real-world projects",
        },
      },
      {
        name: "Cloud & DevOps",
        duration: "3-5 months",
        avgCost: "₹10,000 - ₹40,000",
        platforms: ["A Cloud Guru", "Linux Academy", "Udemy"],
        skills: ["AWS/Azure/GCP", "Kubernetes", "Docker", "CI/CD", "Terraform"],
        certifications: [
          "AWS Solutions Architect",
          "Azure Administrator",
          "Google Cloud Engineer",
          "Certified Kubernetes Administrator",
        ],
        careerOpportunities: "DevOps Engineer, Cloud Architect (7-15 LPA)",
        topCourses: [
          "AWS Certified Solutions Architect (Udemy)",
          "Docker & Kubernetes Complete Guide (Udemy)",
          "Microsoft Azure Fundamentals (Microsoft Learn)",
        ],
        benefits: [
          "Critical skill for modern software",
          "High job security",
          "Work with latest technologies",
          "Good salary progression",
        ],
        timeline: {
          "Month 1-2": "Learn Linux and cloud fundamentals",
          "Month 3-4": "Docker, Kubernetes, and CI/CD",
          "Month 5": "Get certified and build projects",
        },
      },
      {
        name: "Cybersecurity",
        duration: "4-6 months",
        avgCost: "₹15,000 - ₹60,000",
        platforms: ["Cybrary", "Offensive Security", "Coursera"],
        skills: [
          "Network Security",
          "Penetration Testing",
          "Ethical Hacking",
          "Security Audit",
        ],
        certifications: [
          "CompTIA Security+",
          "Certified Ethical Hacker (CEH)",
          "CISSP",
          "Offensive Security Certified Professional (OSCP)",
        ],
        careerOpportunities: "Security Analyst, Ethical Hacker (6-14 LPA)",
        topCourses: [
          "Google Cybersecurity Professional Certificate",
          "Practical Ethical Hacking (TCM Security)",
          "CompTIA Security+ Full Course",
        ],
        benefits: [
          "Growing demand for security professionals",
          "Protect organizations from threats",
          "Continuous learning environment",
          "High job satisfaction",
        ],
        timeline: {
          "Month 1-2": "Networking and security basics",
          "Month 3-4": "Ethical hacking and penetration testing",
          "Month 5-6": "Get certified and practice on CTF platforms",
        },
      },
      {
        name: "Mobile App Development",
        duration: "3-5 months",
        avgCost: "₹10,000 - ₹45,000",
        platforms: ["Udacity", "Coursera", "Udemy"],
        skills: ["Flutter", "React Native", "Swift", "Kotlin", "Firebase"],
        certifications: [
          "Google Flutter Developer",
          "Meta React Native Specialization",
        ],
        careerOpportunities: "Mobile Developer, App Developer (5-12 LPA)",
        topCourses: [
          "Flutter & Dart Complete Guide (Udemy)",
          "React Native - The Practical Guide (Udemy)",
          "iOS Development Bootcamp (Udemy)",
        ],
        benefits: [
          "Build apps used by millions",
          "Freelancing opportunities",
          "Cross-platform development",
          "Growing mobile-first market",
        ],
        timeline: {
          "Month 1-2": "Learn Dart/JavaScript and mobile UI",
          "Month 3-4": "Build and publish apps",
          "Month 5": "Portfolio projects and job applications",
        },
      },
    ],

    resources: [
      { name: "Free coding courses", url: "https://www.freecodecamp.org/" },
      {
        name: "Project ideas",
        url: "https://github.com/practical-tutorials/project-based-learning",
      },
      { name: "Certification roadmaps", url: "https://roadmap.sh/" },
    ],
  },

  off_campus: {
    title: "Off-Campus Job Hunt",
    icon: "🏢",
    description: "Apply to companies hiring throughout the year",

    strategies: [
      {
        name: "Job Portals Strategy",
        platforms: [
          "LinkedIn Jobs",
          "Naukri.com",
          "Indeed",
          "AngelList (Startups)",
          "Instahyre",
          "Wellfound",
        ],
        tips: [
          "Apply to 5-10 jobs daily",
          "Customize resume for each role",
          "Set job alerts for relevant keywords",
          "Follow up after 3-5 days",
        ],
        timeCommitment: "2-3 hours daily",
      },
      {
        name: "Networking & Referrals",
        approach: [
          "Connect with alumni on LinkedIn",
          "Join tech communities (Discord, Slack)",
          "Attend virtual career fairs",
          "Reach out for informational interviews",
        ],
        platforms: ["LinkedIn", "Meetup.com", "Dev.to", "Hashnode", "Twitter"],
        successRate: "3x higher with referrals",
      },
      {
        name: "Direct Company Applications",
        targetCompanies: [
          "Startups (Zerodha, CRED, Razorpay)",
          "Product companies (Microsoft, Google, Adobe)",
          "Service companies (TCS, Infosys, Wipro)",
          "Consulting (Deloitte, Accenture, EY)",
        ],
        approach: [
          "Visit company career pages weekly",
          "Follow companies on LinkedIn",
          "Apply during hiring cycles",
          "Network with employees",
        ],
      },
    ],

    preparation: {
      resume: [
        "ATS-friendly format",
        "Quantify achievements",
        "Include projects with GitHub links",
        "Keep it 1-2 pages",
      ],
      interview: [
        "Practice DSA (LeetCode, HackerRank)",
        "Study system design basics",
        "Prepare behavioral questions (STAR method)",
        "Mock interviews on Pramp/Interviewing.io",
      ],
    },

    resources: [
      {
        name: "Resume templates",
        url: "https://www.overleaf.com/latex/templates",
      },
      { name: "Interview prep", url: "https://leetcode.com/" },
      { name: "Salary negotiation", url: "https://www.levels.fyi/" },
    ],
  },

  freelancing: {
    title: "Freelancing & Internships",
    icon: "💼",
    description: "Build experience and earn while learning",

    platforms: [
      {
        name: "Upwork",
        type: "Global freelancing",
        bestFor: "Web dev, design, writing",
        avgEarnings: "$15-$50/hour",
        requirements: "Strong portfolio, good reviews",
        tips: [
          "Start with low rates to build profile",
          "Specialize in 1-2 skills",
          "Over-communicate with clients",
          "Deliver ahead of deadlines",
        ],
      },
      {
        name: "Fiverr",
        type: "Gig-based",
        bestFor: "Quick tasks, specialized services",
        avgEarnings: "$5-$200/gig",
        requirements: "Clear service offering",
        tips: [
          "Create multiple gig packages",
          "Use SEO-friendly titles",
          "Respond within 1 hour",
          "Upsell with extras",
        ],
      },
      {
        name: "Toptal",
        type: "Premium freelancing",
        bestFor: "Experienced developers",
        avgEarnings: "$60-$200/hour",
        requirements: "Pass screening test, 3+ years exp",
        tips: [
          "Prepare for rigorous vetting",
          "Showcase best projects",
          "Maintain high availability",
        ],
      },
      {
        name: "Internshala",
        type: "Internships (India)",
        bestFor: "Students, fresh graduates",
        avgStipend: "₹5,000-₹25,000/month",
        requirements: "Basic skills, willingness to learn",
        tips: [
          "Apply to 5-10 internships daily",
          "Complete skill tests",
          "Add portfolio projects",
          "Follow up with HRs",
        ],
      },
      {
        name: "AngelList/Wellfound",
        type: "Startup internships",
        bestFor: "Tech roles in startups",
        avgStipend: "₹10,000-₹30,000/month",
        requirements: "Relevant skills, startup mindset",
        tips: [
          "Target early-stage startups",
          "Show entrepreneurial attitude",
          "Be flexible with equity options",
        ],
      },
    ],

    skillsInDemand: [
      "Web Development (React, Node.js)",
      "Mobile Development (Flutter, React Native)",
      "UI/UX Design (Figma, Adobe XD)",
      "Content Writing",
      "Digital Marketing",
      "Video Editing",
      "Data Entry & Virtual Assistance",
    ],

    buildingPortfolio: [
      "Create personal website",
      "Showcase 3-5 best projects on GitHub",
      "Write case studies for each project",
      "Collect testimonials from clients",
      "Maintain active profiles on platforms",
    ],

    resources: [
      {
        name: "Portfolio templates",
        url: "https://github.com/topics/portfolio-template",
      },
      { name: "Freelance contract templates", url: "https://www.docracy.com/" },
      {
        name: "Pricing calculator",
        url: "https://www.hellobonsai.com/freelance-rate-calculator",
      },
    ],
  },
};
