const SITE_URL = 'https://clipzy.xynovix.com/';

const DEFAULT_EMAIL = {
  id: 'default',
  version: 19,
  name: 'Clipzy — YouTuber outreach',
  subject: '{{personalized_subject}}',
  preheader: '',
  body_html: `<p>Hi {{first_name}},</p>

<p>{{personalized_opener}}</p>

<p>This is a problem we hear from creators every week. You film a strong long-form video — then another round of work starts: finding the best moments, cutting short clips, writing captions, and rewriting the same ideas for different platforms.</p>

<p>Clipzy keeps that in one place. You upload once, and the same recording can become short clips, captions, social posts, and show notes — so you spend less time rebuilding content after every upload.</p>

<p>If that would help your channel, you can take a look here:</p>

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
  version: 8,
  name: 'Clipzy — Follow-up',
  subject: '{{personalized_subject}}',
  preheader: '',
  body_html: `<p>Hi {{first_name}},</p>

<p>{{personalized_opener}}</p>

<p>I wanted to follow up briefly on my earlier note about Clipzy. The idea is simple: take one long-form video and turn it into short clips, captions, posts, and show notes in the same workflow — without doing all of that by hand after every upload.</p>

<p>If it seems useful for your content process, the studio is here:</p>

<p>${SITE_URL}</p>

<p>{{personalized_closing}}</p>

<p>Regards,<br>
The Clipzy Team</p>`,
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
