const SITE_URL = 'https://clipzy.xynovix.com/';

const DEFAULT_EMAIL = {
  id: 'default',
  version: 26,
  name: 'Clipzy — YouTuber outreach',
  subject: '{{personalized_subject}}',
  preheader: '',
  body_html: `<p>Hi {{first_name}},</p>

<p>{{personalized_opener}}</p>

<p>The hard part is usually the 6 hours after you hit stop:</p>

<p>→ Editing the full episode<br>
→ Cutting 3 Shorts for TikTok / YouTube<br>
→ Writing show notes that don't sound like a robot<br>
→ Scheduling posts across 4 platforms<br>
→ Doing it all again next week</p>

<p><b>Clipzy was built to kill that workflow.</b> One recording. One studio. Here is what you can do inside it:</p>

<p>→ Record live podcasts with guests<br>
→ Edit video and audio in one place<br>
→ Generate thumbnails, titles, and descriptions<br>
→ Cut Shorts / Reels / TikTok clips from the same episode<br>
→ Get captions, social posts, and show notes ready to publish</p>

<p>Episode + reels + captions + posts — done before you leave your desk.</p>

<p>Try the studio here:</p>

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
  version: 16,
  name: 'Clipzy — Follow-up',
  subject: '{{personalized_subject}}',
  preheader: '',
  body_html: `<p>Hi {{first_name}},</p>

<p>{{personalized_opener}}</p>

<p>Quick follow-up in case my last note got buried. After filming, most creators still have to:</p>

<p>→ Edit the full episode<br>
→ Cut Shorts for TikTok / YouTube<br>
→ Write show notes<br>
→ Schedule posts across platforms</p>

<p><b>Clipzy puts that in one studio:</b></p>

<p>→ Record with guests<br>
→ Edit video + audio<br>
→ Make thumbnails, titles, and descriptions<br>
→ Cut Shorts / Reels / TikTok clips<br>
→ Export captions, posts, and show notes</p>

<p>One recording in. Episode + reels + captions + posts out — before you leave your desk.</p>

<p>See it here:</p>

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
