/**
 * Personalized subject / opener / closing for Clipzy outreach.
 * Medium length: warm + specific, without spammy sales language.
 * Do not repeat first name right after "Hi Name,".
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

function detectCreatorType() {
  return 'creator';
}

const NAME_ONLY_OPENERS = [
  () => `I wanted to reach out personally because a lot of creators tell us the same thing: filming is the fun part, and everything after publish is what slows them down.`,
  () => `Hope you are doing well. I am writing because creators who publish long-form content often still spend hours turning each video into clips, captions, and posts.`,
  () => `Quick question that comes up a lot with creators — after a long video goes live, how much time still goes into short clips and social posts?`,
  () => `I put this note together for creators who already make strong long videos and want those same recordings to travel further across platforms.`,
  () => `I noticed many creators leave a lot of value inside long videos. The best moments are there, but cutting and rewriting them for every platform takes too long.`,
  () => `I am reaching out because your kind of content usually has more than one usable angle in each upload — clips, captions, and posts included.`,
  () => `Wanted to share a cleaner content workflow. Most creators we talk to do not need more ideas. They need less manual work after each recording.`,
  () => `I keep hearing the same bottleneck from creators: one good video, then a second full job of clipping, captioning, and posting.`,
  () => `Hope this is relevant. I work with creators who want more reach from the videos they already film, without stacking more tools or more editing hours.`,
  () => `I wanted to introduce Clipzy in a simple way. It is built for creators who film once and still need short-form content and posts afterward.`,
  () => `Curious whether multi-platform content still feels heavy after each upload. That post-publish work is exactly what Clipzy was built to reduce.`,
  () => `I am writing with a practical idea for your workflow: use the long video you already made as the source for clips, captions, and posts in one place.`,
  () => `A lot of creators love the recording session and dislike the cleanup after. If that sounds familiar, this note may be useful.`,
  () => `I wanted to check in about your content process. When long-form is done, turning it into short clips and posts is usually where consistency breaks.`,
  () => `Sharing this because creators grow faster when every upload can support more than one platform — without another late-night edit session.`,
  () => `I thought this might help if you are already filming regularly. The missing piece for many channels is a faster way to reuse each video.`,
  () => `I wanted to share one clear goal with you: help creators spend less time rebuilding the same content after they hit publish.`,
  () => `Hope your week is going well. I wanted to send a short note about making long-form content work harder across Shorts, Reels, and posts.`,
  () => `I built this note around a simple creator problem: great videos, slow distribution. That gap is where a lot of time disappears.`,
  () => `Wanted to connect because long-form creators often have unused short-form moments sitting inside every episode or video.`,
];

const NAME_ONLY_CLOSINGS = [
  () => `If it looks useful, open the studio with one recent video and see whether the workflow feels right for you.`,
  () => `No pressure at all — if cleaner repurposing would help, the link above is there whenever timing is better.`,
  () => `I would genuinely value your feedback as a creator if you take a look.`,
  () => `If multi-platform growth is on your list, this may save real time on the next few uploads.`,
  () => `Start with one upload if you try it. That is usually enough to see whether it fits your process.`,
  () => `Happy to leave this with you. If it helps even one upload feel easier, it was worth sending.`,
  () => `If the post-publish work is still draining your schedule, Clipzy was built for exactly that.`,
  () => `Appreciate you reading this. The studio link is above if you want to explore it.`,
  () => `Most creators can tell quickly whether this helps once they run a real video through it.`,
  () => `If Shorts and social posts still take longer than filming, it may be worth a look this week.`,
  () => `Open it only if it feels relevant. Either way, thanks for your time.`,
  () => `Hope this helps you ship more from the same filming time.`,
  () => `If you check it out, I would like to know what you think.`,
  () => `When you want more from each recording, the studio is ready.`,
  () => `If timing is off right now, no worries at all.`,
  () => `Thanks for considering it. Happy to answer anything if useful.`,
  () => `Curious what your latest video would look like once clips and posts are pulled from it.`,
  () => `More platforms from the same filming time is the outcome we aim for.`,
  () => `Thanks again for your time — hope this makes the next upload lighter.`,
  () => `I will leave the link with you in case it helps your channel this month.`,
];

const NAME_ONLY_SUBJECTS = [
  (f) => `${f}, quick note on your content workflow`,
  (f) => `${f} — after you publish a long video`,
  (f) => `Quick idea for your channel, ${f}`,
  (f) => `${f}, thought this may help your uploads`,
  (f) => `${f}: one video, more usable content`,
  (f) => `${f}, about clips and posts after upload`,
  (f) => `A note for creators like you, ${f}`,
  (f) => `${f} — making long videos work harder`,
  (f) => `${f}, question on your video workflow`,
  (f) => `Idea for you, ${f}`,
  (f) => `${f}, on reusing the videos you already make`,
  (f) => `${f} — short note from Clipzy`,
  (f) => `${f}, may be useful for your next upload`,
  (f) => `${f}: content workflow note`,
  (f) => `${f}, hope this is relevant`,
  (f) => `${f} — less work after you hit publish`,
  (f) => `Hi ${f}, quick creator note`,
  (f) => `${f}, about your post-publish workflow`,
  (f) => `${f} — one practical content idea`,
  (f) => `${f}, wanted to share this with you`,
];

const FOLLOW_UP_SUBJECTS = [
  (f) => `${f}, following up on my earlier note`,
  (f) => `Quick follow-up, ${f}`,
  (f) => `${f}, did my last note come through?`,
  (f) => `${f} — one more note on Clipzy`,
  (f) => `Re: your content workflow, ${f}`,
];

const FOLLOW_UP_OPENERS = [
  () => `Just looping back once in case my first note got buried under other mail.`,
  () => `Sending a short follow-up — no need to reply if the timing is not right.`,
  () => `One more brief note from me on this, then I will leave it with you.`,
  () => `Wanted to bump this once because the time-save usually shows up on the first real video.`,
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
      `I came across ${channel} and wanted to reach out about the work that usually happens after each upload.`,
      `Your work around ${channel} stood out, so I thought a personal note made sense.`,
      `I wanted to share something that may help with clips, captions, and posts around ${channel}.`,
      `Creators behind channels like ${channel} often spend more time repurposing content than filming it.`,
    ];
    if (snippet) {
      rich.push(`Noticed ${channel}'s focus — ${snippet} That kind of content usually has strong short-form moments.`);
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
      `If this helps ${channel}, start with one recent upload and see how the workflow feels.`,
      `Happy to hear what you think if you try it with a ${channel} video.`,
      `No rush — sharing in case it fits the way ${channel} already creates content.`,
      `Appreciate your time either way, and hope this is useful for ${channel}.`,
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
      `${first} — thought on the ${channel} workflow`,
      `Idea for ${channel}, ${first}`,
      `${first}, about content after ${channel} uploads`,
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
