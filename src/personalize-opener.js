/**
 * Personalized subject / opener / closing for Clipzy outreach.
 * Short, personal, spam-safe. Avoid repeating first name after "Hi Name,".
 */

const SITE_URL = 'https://clipzy.xynovix.com/';

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pickVariant(seed, variants) {
  const idx = hashCode(seed || 'default') % variants.length;
  return variants[idx];
}

function firstName(contact) {
  const raw = contact.first_name || (contact.name || '').split(' ')[0] || 'there';
  if (!raw || raw.toLowerCase() === 'there') return 'there';
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function hasChannel(contact) {
  return Boolean(contact.company && String(contact.company).trim());
}

function channelName(contact) {
  if (hasChannel(contact)) return contact.company.trim();
  return '';
}

function profileSnippet(profile, max = 110) {
  if (!profile || profile.length < 20) return '';
  const clean = profile.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim() + '...';
}

function detectCreatorType(contact = {}) {
  const blob = [
    contact.title,
    contact.industry,
    contact.company_profile,
    contact.company,
  ].filter(Boolean).join(' ').toLowerCase();

  if (!blob) return 'creator';
  if (/\b(podcast|podcaster)\b/.test(blob)) return 'podcaster';
  if (/\b(agency|studio|media team|content team|production)\b/.test(blob)) return 'agency';
  if (/\b(founder|ceo|co-founder|cofounder|startup)\b/.test(blob)) return 'founder';
  if (/\b(fitness|health|wellness)\b/.test(blob)) return 'fitness';
  if (/\b(gaming|gamer|stream|twitch)\b/.test(blob)) return 'gamer';
  if (/\b(tech|saas|software|ai|developer)\b/.test(blob)) return 'tech';
  if (/\b(educator|course|teacher|instructor)\b/.test(blob)) return 'educator';
  if (/\b(youtube|youtuber|creator|influencer|vlog|content|coach)\b/.test(blob)) return 'youtuber';
  return 'creator';
}

// Do NOT start with first name — greeting already says "Hi Name,"
const NAME_ONLY_OPENERS = [
  () => `I noticed a lot of creators lose more time after publishing than they do while filming.`,
  () => `Quick question — after a long video goes live, how long does clipping and posting usually take?`,
  () => `I wanted to share something simple that may help your content workflow.`,
  () => `Most creators I talk to love filming, then get stuck rebuilding the same video for every platform.`,
  () => `I am writing because one strong video should do more than sit as a single upload.`,
  () => `Curious if turning long videos into short clips and posts is still a time sink for you.`,
  () => `I put this note together for creators who want more from each recording without another edit day.`,
  () => `After publish, the second job usually starts: clips, captions, and posts. That is what I wanted to mention.`,
  () => `I thought this might be useful if you are posting long-form and still need short content around it.`,
  () => `Wanted to reach out about a cleaner way to reuse the videos you already make.`,
  () => `I keep seeing the same bottleneck: great long videos, slow multi-platform follow-through.`,
  () => `This is a short note about getting more reach from the same filming time.`,
  () => `If clipping highlights still takes longer than filming, this may be worth a look.`,
  () => `I wanted to introduce a simple studio workflow for long-form creators.`,
  () => `Hope this is relevant — I work with creators who ship one video and still need clips and posts after.`,
  () => `I am reaching out because your kind of long-form content usually has a lot of unused short-form moments.`,
  () => `Quick thought on content workflow: filming is only half the work for most channels.`,
  () => `I wanted to ask whether multi-platform posting still slows things down after each upload.`,
  () => `Sharing this in case a simpler clip-and-post workflow would help right now.`,
  () => `I built Clipzy around one problem: too much manual work after a video is done.`,
];

const NAME_ONLY_CLOSINGS = [
  () => `If it is useful, take a look when you have a minute.`,
  () => `No pressure either way — happy to hear your thoughts if you check it out.`,
  () => `Would appreciate your feedback as a creator if you open it.`,
  () => `If timing is better later, all good.`,
  () => `Hope this helps even a little.`,
  () => `Curious what you think if you try it on one recent video.`,
  () => `Thanks for reading.`,
  () => `Happy to answer anything if useful.`,
  () => `Appreciate your time.`,
  () => `If it is not a fit, feel free to ignore this.`,
  () => `Looking forward to your thoughts if you explore it.`,
  () => `Open it only if it seems relevant.`,
  () => `I will leave it with you.`,
  () => `Thanks either way.`,
  () => `Hope your next upload takes less follow-up work.`,
];

const NAME_ONLY_SUBJECTS = [
  (f) => `${f}, quick question on your videos`,
  (f) => `${f} — thought on your content workflow`,
  (f) => `Quick note, ${f}`,
  (f) => `${f}, after you publish a video`,
  (f) => `${f}, one idea for your channel`,
  (f) => `Question for you, ${f}`,
  (f) => `${f} — shorter note on clipping`,
  (f) => `${f}, may be useful for your uploads`,
  (f) => `${f}, about your video workflow`,
  (f) => `Hi ${f}, quick thought`,
  (f) => `${f} — content workflow note`,
  (f) => `${f}, something small that may help`,
  (f) => `${f}: after the long video is done`,
  (f) => `${f}, wanted to share this`,
  (f) => `${f} — quick creator note`,
  (f) => `${f}, on reusing your videos`,
  (f) => `${f}, short note from Clipzy`,
  (f) => `${f} — one question`,
  (f) => `${f}, about clips after upload`,
  (f) => `${f}, hope this is relevant`,
];

const FOLLOW_UP_SUBJECTS = [
  (f) => `${f}, following up once`,
  (f) => `Quick follow-up, ${f}`,
  (f) => `${f}, did this come through?`,
  (f) => `${f} — second short note`,
  (f) => `Re: my note, ${f}`,
];

const FOLLOW_UP_OPENERS = [
  () => `Just looping back once in case my first note got buried.`,
  () => `Sending a short follow-up — no need to reply if the timing is off.`,
  () => `One more brief note from me on this.`,
  () => `Wanted to bump this once in case it helps.`,
];

function generatePersonalizedOpener(contact) {
  const first = firstName(contact);
  const email = contact.email || first;
  const channel = channelName(contact);
  const snippet = profileSnippet(contact.company_profile, 90);
  const isFollowUp = contact._is_follow_up === true;

  if (isFollowUp) {
    return pickVariant(email + '|fu-opener', FOLLOW_UP_OPENERS.map((fn) => fn()));
  }

  if (channel) {
    const rich = [
      `I came across ${channel} and wanted to reach out about your content workflow.`,
      `Your work around ${channel} stood out, so I thought a short note made sense.`,
      `I wanted to share something that may help with the post-publish work around ${channel}.`,
      `Creators behind channels like ${channel} often spend a lot of time on clips and posts after filming.`,
    ];
    if (snippet) {
      rich.push(`Noticed ${channel}'s focus — ${snippet} That usually has strong short-form moments.`);
    }
    return pickVariant(email + '|opener-rich', rich);
  }

  return pickVariant(email + '|opener', NAME_ONLY_OPENERS.map((fn) => fn()));
}

function generatePersonalizedClosing(contact) {
  const first = firstName(contact);
  const email = contact.email || first;
  const channel = channelName(contact);

  if (channel) {
    return pickVariant(email + '|close-channel', [
      `If it helps ${channel}, the link above is the easiest place to start.`,
      `Happy to hear what you think if you try it with a ${channel} upload.`,
      `No rush — sharing in case it fits the ${channel} workflow.`,
      `Appreciate your time either way.`,
    ]);
  }

  return pickVariant(email + '|closing', NAME_ONLY_CLOSINGS.map((fn) => fn()));
}

function generatePersonalizedSubject(contact) {
  const first = firstName(contact);
  const email = contact.email || first;
  const channel = channelName(contact);
  const isFollowUp = contact._is_follow_up === true;

  if (isFollowUp) {
    return pickVariant(email + '|fu-subject', FOLLOW_UP_SUBJECTS.map((fn) => fn(first)));
  }

  if (channel) {
    const subjects = [
      `${first}, quick note about ${channel}`,
      `${first} — thought on ${channel}`,
      `Quick question for ${channel}`,
      `${first}, about the ${channel} workflow`,
      `${first}: short note on ${channel}`,
    ].filter((s) => s.length <= 60);
    return pickVariant(email + '|subject-channel', subjects);
  }

  return pickVariant(email + '|subject', NAME_ONLY_SUBJECTS.map((fn) => fn(first)));
}

module.exports = {
  generatePersonalizedOpener,
  generatePersonalizedClosing,
  generatePersonalizedSubject,
  detectCreatorType,
  detectRoleType: detectCreatorType,
  SITE_URL,
};
