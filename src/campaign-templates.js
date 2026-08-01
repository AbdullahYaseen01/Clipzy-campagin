const SITE_URL = 'https://clipzy.xynovix.com/';

const DEFAULT_EMAIL = {
  id: 'default',
  version: 17,
  name: 'Clipzy — YouTuber outreach',
  subject: '{{personalized_subject}}',
  preheader: '',
  body_html: `<p>Hi {{first_name}},</p>

<p>{{personalized_opener}}</p>

<p>Here is the pattern I keep seeing with long-form creators:</p>

<p>You film a strong episode. Then the real work starts — pulling Shorts and Reels, writing captions, drafting posts, and rebuilding the same ideas for every platform. That second job is what slows growth.</p>

<p>Clipzy is one studio for the episode, the reel, and the post. Upload once and leave with:</p>

<ul style="margin-top:0;padding-left:22px;">
<li>Short-form clips ready for Shorts, Reels, and TikTok</li>
<li>Captions, titles, and social posts</li>
<li>Show notes, chapters, and newsletter copy</li>
</ul>

<p>Creators use it to ship more from the same recording time — without stacking five tools or hiring a bigger edit team.</p>

<p>If you want more reach from the videos you already make, open the studio here:</p>

<p>${SITE_URL}</p>

<p>Plans start at $19/month. Cancel anytime.</p>

<p>{{personalized_closing}}</p>

<p>Best,<br>
Ahmad<br>
Clipzy</p>`,
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
  version: 6,
  name: 'Clipzy — Follow-up',
  subject: '{{personalized_subject}}',
  preheader: '',
  body_html: `<p>Hi {{first_name}},</p>

<p>{{personalized_opener}}</p>

<p>Quick follow-up in case my last note got buried.</p>

<p>Clipzy takes one long-form video and turns it into clips, captions, posts, and show notes in the same workflow — so you are not rebuilding the content pack by hand after every upload.</p>

<p>If that would help your channel, the studio is here:</p>

<p>${SITE_URL}</p>

<p>{{personalized_closing}}</p>

<p>Best,<br>
Ahmad<br>
Clipzy</p>`,
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
