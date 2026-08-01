const DEFAULT_EMAIL = {
  id: 'default',
  version: 15,
  name: 'Clipzy — YouTuber outreach',
  subject: '{{personalized_subject}}',
  preheader: 'One upload → Shorts, Reels, posts, and show notes.',
  body_html: `<p>Hi {{first_name}},</p>

<p>{{personalized_opener}}</p>

<p>Most creators film something great… then burn hours clipping highlights, writing captions, and rewriting the same ideas for Shorts, Reels, TikTok, X, and LinkedIn.</p>

<p><strong>Clipzy</strong> replaces that messy stack. One studio for the episode, the reel, and the post:</p>

<ul style="margin-top:0;padding-left:22px;">
<li>Viral-ready Shorts, Reels, and TikTok clips</li>
<li>Social posts, threads, and LinkedIn copy</li>
<li>Blog posts, newsletters, show notes, chapters, and timestamps</li>
</ul>

<p>Upload once. Get a full content engine — used by <strong>1,800+ creators</strong> already.</p>

<p>Try it free: <a href="https://clipzy.com" style="color:#e11d48;font-weight:600;">https://clipzy.com</a></p>

<p>{{personalized_closing}}</p>

<p>Best regards,<br>
The Clipzy Team<br>
<a href="https://clipzy.com" style="color:#e11d48;">clipzy.com</a></p>`,
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
  version: 4,
  name: 'Clipzy — Follow-up',
  subject: '{{first_name}}, quick follow-up on Clipzy',
  preheader: 'Still turning videos into clips the hard way?',
  body_html: `<p>Hi {{first_name}},</p>

<p>Just bumping my earlier note — Clipzy turns one long-form video into Shorts, Reels, social posts, and show notes in a single workflow.</p>

<p>If that would save you time, try it free here: <a href="https://clipzy.com" style="color:#e11d48;font-weight:600;">https://clipzy.com</a></p>

<p>{{personalized_closing}}</p>

<p>Best regards,<br>
The Clipzy Team<br>
<a href="https://clipzy.com" style="color:#e11d48;">clipzy.com</a></p>`,
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

module.exports = { getTemplate, listTemplates, DEFAULT_EMAIL, FOLLOW_UP_EMAIL };
