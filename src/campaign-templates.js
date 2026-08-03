const SITE_URL = 'https://clipzy.xynovix.com/';

const DEFAULT_EMAIL = {
  id: 'default',
  version: 21,
  name: 'Clipzy — YouTuber outreach',
  subject: '{{personalized_subject}}',
  preheader: '',
  body_html: `<p>Hi {{first_name}},</p>

<p>{{personalized_opener}}</p>

<p>This is a problem we hear from creators every week. You film a strong long-form video — then another round of work starts: finding the best moments, cutting short clips, writing captions, and rewriting the same ideas for different platforms.</p>

<p><b>Clipzy's purpose is simple:</b> turn <b>one long-form video</b> into short clips, captions, social posts, and show notes — all from <b>one studio</b>.</p>

<p>Upload once. Leave with content ready for Shorts, Reels, TikTok, and your social posts, plus show notes for the main video. Less rebuilding after every upload. More reach from the same filming time.</p>

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
  version: 11,
  name: 'Clipzy — Follow-up',
  subject: '{{personalized_subject}}',
  preheader: '',
  body_html: `<p>Hi {{first_name}},</p>

<p>{{personalized_opener}}</p>

<p>I wanted to follow up on my earlier note in case it got buried. Many creators tell us the hard part is not filming — it is everything that comes after: clips, captions, and posts for every platform.</p>

<p><b>Clipzy's purpose is simple:</b> turn <b>one long-form video</b> into short clips, captions, social posts, and show notes inside <b>one studio</b>.</p>

<p>That means less manual editing after each upload, and more content from the videos you already make. If that would help your channel, you can see the workflow here:</p>

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
