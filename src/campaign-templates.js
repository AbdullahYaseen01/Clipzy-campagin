const SITE_URL = 'https://clipzy.xynovix.com/';

const DEFAULT_EMAIL = {
  id: 'default',
  version: 25,
  name: 'Clipzy — YouTuber outreach',
  subject: '{{personalized_subject}}',
  preheader: '',
  body_html: `<p>Hi {{first_name}},</p>

<p>{{personalized_opener}}</p>

<p>The hard part is the 6 hours after:</p>

<p>→ Editing the full episode<br>
→ Cutting 3 Shorts for TikTok/YouTube<br>
→ Writing show notes that don't sound like a robot<br>
→ Scheduling posts across 4 platforms<br>
→ Doing it all again next week</p>

<p><b>Clipzy was built to kill that workflow.</b></p>

<p>One recording. One studio. Episode + reels + captions + posts — done before you leave your desk.</p>

<p>If that sounds useful for your channel, here is the studio:</p>

<p>${SITE_URL}</p>

<p>{{personalized_closing}}</p>

<p>Regards,<br>
The Clipzy Team</p>`,
  test_email: 'ahmadjutt463@gmail.com',
  sample_contact: {
    first_name: 'Alex',
    last_name: '',
    name: 'Alex',
    title: '',
    company: '',
    city: '',
    country: '',
    industry: '',
    company_profile: '',
    website: '',
    linkedin: '',
    email: 'alex@example.com',
  },
};

const FOLLOW_UP_EMAIL = {
  id: 'follow-up',
  version: 15,
  name: 'Clipzy — Follow-up',
  subject: '{{personalized_subject}}',
  preheader: '',
  body_html: `<p>Hi {{first_name}},</p>

<p>{{personalized_opener}}</p>

<p>Just following up in case my earlier note got buried. The hard part after filming is usually the same:</p>

<p>→ Editing the full episode<br>
→ Cutting Shorts for TikTok/YouTube<br>
→ Writing show notes that don't sound like a robot<br>
→ Scheduling posts across platforms<br>
→ Doing it all again next week</p>

<p><b>Clipzy was built to kill that workflow.</b></p>

<p>One recording. One studio. Episode + reels + captions + posts — done before you leave your desk.</p>

<p>If it would help your channel, you can see it here:</p>

<p>${SITE_URL}</p>

<p>{{personalized_closing}}</p>

<p>Regards,<br>
The Clipzy Team</p>`,
  sample_contact: {
    first_name: 'Alex',
    last_name: '',
    name: 'Alex',
    title: '',
    company: '',
    city: '',
    country: '',
    industry: '',
    company_profile: '',
    website: '',
    linkedin: '',
    email: 'alex@example.com',
  },
};

const TEMPLATES = { default: DEFAULT_EMAIL, 'job-outreach': DEFAULT_EMAIL, 'follow-up': FOLLOW_UP_EMAIL };

function getTemplate(id) {
  return TEMPLATES[id] || TEMPLATES.default;
}

function listTemplates() {
  return [
    { id: 'default', name: DEFAULT_EMAIL.name, subject: DEFAULT_EMAIL.subject },
    { id: 'follow-up', name: FOLLOW_UP_EMAIL.name, subject: FOLLOW_UP_EMAIL.subject },
  ];
}

module.exports = { getTemplate, listTemplates, DEFAULT_EMAIL, FOLLOW_UP_EMAIL, SITE_URL };
