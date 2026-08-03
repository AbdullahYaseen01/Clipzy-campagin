const SITE_URL = 'https://clipzy.xynovix.com/';

const DEFAULT_EMAIL = {
  id: 'default',
  version: 24,
  name: 'Clipzy — YouTuber outreach',
  subject: '{{personalized_subject}}',
  preheader: '',
  body_html: `<p>Hi {{first_name}},</p>

<p>{{personalized_opener}}</p>

<p>A lot of creators tell us the same thing: filming is fine, but the work after publish is heavy — clipping, captions, titles, descriptions, thumbnails, and posts for every platform.</p>

<p><b>Clipzy's purpose is simple:</b> turn <b>one long-form video</b> into short clips, captions, social posts, and show notes — all from <b>one studio</b>.</p>

<p>From the same place you can record live podcasts with guests, edit video and audio, generate thumbnails, create titles and descriptions, cut Shorts / Reels / TikTok clips, and leave with captions, social posts, and show notes — without jumping between separate tools.</p>

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
  version: 14,
  name: 'Clipzy — Follow-up',
  subject: '{{personalized_subject}}',
  preheader: '',
  body_html: `<p>Hi {{first_name}},</p>

<p>{{personalized_opener}}</p>

<p>Just following up in case my earlier note got buried. Many creators say the hard part is not filming — it is the cleanup after: clips, captions, thumbnails, titles, descriptions, and posts.</p>

<p><b>Clipzy's purpose is simple:</b> turn <b>one long-form video</b> into short clips, captions, social posts, and show notes — all from <b>one studio</b>.</p>

<p>You can record live podcasts, edit video and audio, generate thumbnails, write titles and descriptions, cut short clips, and prepare captions plus show notes in one session.</p>

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
