import type { BusinessInfo } from '@/components/business-info-form';

export const BUSINESS_IDEAS: Array<
    BusinessInfo & { category: string; emoji: string }
> = [
    {
        category: 'SaaS / Tech',
        emoji: '💻',
        businessName: 'TaskFlow AI',
        productService:
            'AI-powered project management tool for remote teams that automatically prioritizes tasks, schedules meetings across time zones, and provides real-time collaboration insights.',
        problemSolution:
            'Remote teams struggle with async communication, task handoffs, and timezone coordination. Our AI analyzes team patterns, workload, and deadlines to automatically optimize task distribution and reduce coordination overhead by 40%.',
        customerAcquisition:
            'Content marketing through engineering blogs, partnerships with remote work consultants, free tier for teams under 10 people, enterprise sales for organizations with 100+ employees.',
        revenueModel:
            'Freemium SaaS model: Free for up to 10 users, $12/user/month for Pro (unlimited users, advanced analytics), $25/user/month for Enterprise (SSO, dedicated support, custom integrations). Main costs: cloud infrastructure, AI compute, customer support, sales team.',
        keyResources:
            'Engineering team with AI/ML expertise, cloud infrastructure (AWS/GCP), integrations with Slack/Teams/Notion/Jira, customer success team, partnerships with productivity tool providers.',
    },
    {
        category: 'E-commerce / Retail',
        emoji: '🛍️',
        businessName: 'EcoStyle Marketplace',
        productService:
            'Online marketplace connecting conscious consumers with sustainable fashion brands. Curated selection of eco-friendly clothing, accessories, and lifestyle products with verified sustainability credentials.',
        problemSolution:
            'Consumers want to shop sustainably but struggle to verify claims and find quality eco-friendly products. We vet every brand for genuine sustainability practices, provide transparent supply chain information, and make sustainable shopping as convenient as traditional e-commerce.',
        customerAcquisition:
            'Instagram and TikTok influencer partnerships, SEO-optimized content about sustainable living, email marketing to eco-conscious communities, partnerships with environmental nonprofits, referral program offering store credit.',
        revenueModel:
            'Commission-based: 15-20% commission on each sale, premium brand listings ($500-2000/month), affiliate partnerships with sustainable brands. Main costs: platform development, marketing, customer acquisition, payment processing, customer support.',
        keyResources:
            'E-commerce platform, brand vetting team, partnerships with sustainable brands, logistics partners for carbon-neutral shipping, content creators, customer service team.',
    },
    {
        category: 'Health & Wellness',
        emoji: '🧘',
        businessName: 'MindfulPath',
        productService:
            'Mental wellness app offering personalized meditation, therapy-backed exercises, and mood tracking for busy professionals dealing with stress and burnout.',
        problemSolution:
            'Professionals face high stress but lack time for traditional therapy. Our app provides 5-15 minute science-backed exercises, AI-powered mood insights, and connects users with licensed therapists when needed. 78% of users report reduced stress within 2 weeks.',
        customerAcquisition:
            'B2B partnerships with companies for employee wellness programs, app store optimization, content marketing on mental health topics, partnerships with HR platforms, corporate wellness conferences.',
        revenueModel:
            'Dual revenue: B2C subscription ($9.99/month individual, $79.99/year), B2B enterprise licenses ($5-8/employee/month for companies). Main costs: app development, therapist network, content creation, customer acquisition, cloud hosting.',
        keyResources:
            'Licensed therapists and mental health professionals, mobile app developers, AI/ML team for personalization, partnerships with corporate HR departments, content library of guided exercises.',
    },
    {
        category: 'Education / EdTech',
        emoji: '📚',
        businessName: 'CodeCraft Academy',
        productService:
            'Interactive coding bootcamp for career changers, offering project-based learning, 1-on-1 mentorship, and job placement support. Focuses on practical skills for web development, data science, and cloud engineering.',
        problemSolution:
            'Career changers struggle with expensive bootcamps and lack of personalized support. We offer income-share agreements (pay nothing upfront), personalized learning paths based on goals, and guaranteed job placement support with 85% placement rate within 6 months.',
        customerAcquisition:
            "SEO content targeting 'career change' keywords, partnerships with career counselors, free coding workshops, YouTube tutorials, alumni referral program, partnerships with companies seeking junior developers.",
        revenueModel:
            'Income Share Agreement: Students pay 15% of salary for 2 years after getting a job (minimum $50k salary), or upfront payment of $12,000 with 20% discount. Main costs: instructor salaries, platform development, career services, marketing.',
        keyResources:
            'Experienced coding instructors and mentors, learning management platform, partnerships with hiring companies, career coaches, curriculum development team, student community platform.',
    },
    {
        category: 'Food & Beverage',
        emoji: '🍽️',
        businessName: 'FreshPrep Meals',
        productService:
            'Subscription meal kit service delivering pre-portioned, locally-sourced ingredients with chef-designed recipes. Focuses on healthy, 30-minute meals for busy families.',
        problemSolution:
            'Families want healthy home-cooked meals but lack time for meal planning and grocery shopping. We eliminate decision fatigue, reduce food waste by 60%, and make cooking easy with step-by-step video guides. Ingredients arrive fresh from local farms within 24 hours of harvest.',
        customerAcquisition:
            'Facebook and Instagram ads targeting parents, partnerships with parenting blogs and influencers, referral program (free week for referrer and referee), local farmers market pop-ups, corporate wellness programs.',
        revenueModel:
            'Subscription tiers: 2-person plan ($60/week for 3 meals), 4-person plan ($110/week for 3 meals), premium plan with organic-only ingredients (+$20/week). Main costs: ingredient sourcing, packaging, delivery logistics, recipe development, marketing.',
        keyResources:
            'Partnerships with local farms and suppliers, cold chain logistics, recipe development team, packaging facility, delivery fleet or 3PL partnerships, customer service team, meal planning software.',
    },
];
