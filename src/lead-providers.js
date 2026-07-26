const LEAD_PROVIDERS = [
  {
    id: 'apollo',
    name: 'Apollo.io',
    icon: 'apollo',
    description: 'B2B contact database with titles, companies, and verified emails.',
    fields: ['job_titles', 'locations', 'industries', 'company_size', 'seniority'],
  },
  {
    id: 'findymail',
    name: 'FindyMail',
    icon: 'findymail',
    description: 'Find and verify professional email addresses from LinkedIn profiles.',
    fields: ['linkedin_url', 'domain', 'name'],
  },
  {
    id: 'hunter',
    name: 'Hunter.io',
    icon: 'hunter',
    description: 'Domain search and email finder for outreach teams.',
    fields: ['domain', 'department', 'seniority'],
  },
  {
    id: 'snov',
    name: 'Snov.io',
    icon: 'snov',
    description: 'Prospect finder with company filters and email verification.',
    fields: ['domain', 'job_title', 'location'],
  },
  {
    id: 'lusha',
    name: 'Lusha',
    icon: 'lusha',
    description: 'Direct-dial and email enrichment for sales and recruiting.',
    fields: ['company', 'title', 'location'],
  },
  {
    id: 'clearbit',
    name: 'Clearbit',
    icon: 'clearbit',
    description: 'Company and person enrichment for high-intent outreach.',
    fields: ['domain', 'company', 'role'],
  },
];

function getLeadProviders() {
  return LEAD_PROVIDERS;
}

function getLeadProvider(id) {
  return LEAD_PROVIDERS.find(p => p.id === id) || null;
}

function demoLeads(providerId, query = {}) {
  const company = query.company || query.domain?.split('.')[0] || 'Reachly Demo Labs';
  const title = String(query.job_title || query.job_titles || 'VP of Engineering').split(',')[0].trim();
  const city = query.location || query.locations || 'San Francisco';
  const domain = (query.domain || 'reachlydemo.com').replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
  const industry = query.industry || 'Software';
  const seniority = query.seniority || 'Director+';
  const companySize = query.company_size || '51-200';

  // Demo leads — first name always Ahmad for demo identity
  const samples = [
    {
      first_name: 'Ahmad',
      last_name: 'Yaseen',
      name: 'Ahmad Yaseen',
      email: `ahmad.yaseen@${domain}`,
      title: title || 'Senior Software Developer',
      company: typeof company === 'string' && company.includes('.') ? company.split('.')[0] : company,
      city,
      country: 'United States',
      industry,
      linkedin: 'https://linkedin.com/in/ahmadyaseen1',
      phone: '+1 415-555-0101',
      seniority,
      company_size: companySize,
      verified: true,
      score: 96,
      source: providerId,
    },
    {
      first_name: 'Ahmad',
      last_name: 'Randhawa',
      name: 'Ahmad Randhawa',
      email: `ahmad.randhawa@${domain}`,
      title: 'CTO',
      company: 'Northwind Robotics',
      city: 'Austin',
      country: 'United States',
      industry: industry || 'Hardware',
      linkedin: 'https://linkedin.com/in/ahmadrandhawa',
      phone: '+1 512-555-0142',
      seniority: 'C-Level',
      company_size: '11-50',
      verified: true,
      score: 94,
      source: providerId,
    },
    {
      first_name: 'Ahmad',
      last_name: 'Khan',
      name: 'Ahmad Khan',
      email: `ahmad.khan@${domain}`,
      title: 'Director of Engineering',
      company: 'BrightPath Cloud',
      city: 'London',
      country: 'United Kingdom',
      industry: 'Cloud',
      linkedin: 'https://linkedin.com/in/ahmadkhan',
      phone: '+44 20 7946 0958',
      seniority: 'Director',
      company_size: '201-500',
      verified: true,
      score: 91,
      source: providerId,
    },
    {
      first_name: 'Ahmad',
      last_name: 'Hassan',
      name: 'Ahmad Hassan',
      email: `a.hassan@${domain}`,
      title: 'Head of Product Engineering',
      company: 'Orbit Analytics',
      city: 'Toronto',
      country: 'Canada',
      industry: 'SaaS',
      linkedin: 'https://linkedin.com/in/ahmadhassan',
      phone: '+1 416-555-0199',
      seniority: 'VP',
      company_size: '51-200',
      verified: true,
      score: 89,
      source: providerId,
    },
    {
      first_name: 'Ahmad',
      last_name: 'Malik',
      name: 'Ahmad Malik',
      email: `ahmad.malik@${domain}`,
      title: 'Engineering Manager',
      company: 'Pulse IoT',
      city: 'Berlin',
      country: 'Germany',
      industry: 'IoT',
      linkedin: 'https://linkedin.com/in/ahmadmalik',
      phone: '+49 30 123456',
      seniority: 'Manager',
      company_size: '51-200',
      verified: false,
      score: 82,
      source: providerId,
    },
    {
      first_name: 'Ahmad',
      last_name: 'Siddiqui',
      name: 'Ahmad Siddiqui',
      email: `ahmad.s@${domain}`,
      title: 'Staff Engineer',
      company: 'Helix Systems',
      city: 'Dubai',
      country: 'UAE',
      industry: 'FinTech',
      linkedin: 'https://linkedin.com/in/ahmadsiddiqui',
      phone: '+971 4 555 0100',
      seniority: 'Senior',
      company_size: '501-1000',
      verified: true,
      score: 88,
      source: providerId,
    },
  ];

  let results = samples;
  if (query.verified_only === true || query.verified_only === 'true') {
    results = results.filter(l => l.verified);
  }
  if (query.min_score) {
    const min = parseInt(query.min_score, 10) || 0;
    results = results.filter(l => l.score >= min);
  }
  return results;
}

async function searchLeads(providerId, query, apiKey) {
  if (providerId === 'apollo' && apiKey) {
    try {
      const res = await fetch('https://api.apollo.io/api/v1/mixed_people/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': apiKey,
        },
        body: JSON.stringify({
          page: 1,
          per_page: 10,
          person_titles: query.job_titles ? [query.job_titles] : undefined,
          person_locations: query.locations ? [query.locations] : undefined,
          q_organization_domains: query.domain || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const people = (data.people || []).slice(0, 10).map(p => ({
          first_name: p.first_name || 'Ahmad',
          last_name: p.last_name || '',
          name: p.name || [p.first_name, p.last_name].filter(Boolean).join(' '),
          email: p.email || '',
          title: p.title || '',
          company: p.organization?.name || query.company || '',
          city: p.city || '',
          industry: p.organization?.industry || '',
          linkedin: p.linkedin_url || '',
          verified: !!p.email,
          score: 85,
          source: 'apollo',
        })).filter(p => p.email || p.name);
        if (people.length) return { leads: people, live: true };
      }
    } catch {
      // fall through to demo data
    }
  }

  return {
    leads: demoLeads(providerId, query),
    live: false,
    demo: true,
    stats: {
      total: 6,
      verified: 5,
      avgScore: 90,
      providers: LEAD_PROVIDERS.length,
    },
  };
}

module.exports = {
  getLeadProviders,
  getLeadProvider,
  searchLeads,
  demoLeads,
  LEAD_PROVIDERS,
};
