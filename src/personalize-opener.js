/**
 * Personalized subject / opener / closing for Clipzy outreach.
 * Works well with only name + email (no channel/company needed).
 */

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
  return contact.first_name || (contact.name || '').split(' ')[0] || 'there';
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

/** Large name-only pools — unique per email via hash */
const NAME_ONLY_OPENERS = [
  (f) => `${f}, quick question — after you publish a long YouTube video, how long does clipping + posting usually take?`,
  (f) => `Most creators I talk to love filming and hate everything that comes after. Figured that might sound familiar, ${f}.`,
  (f) => `${f}, I built Clipzy for YouTubers who want Shorts, Reels, and posts without another editing marathon.`,
  (f) => `Reaching out because creators like you usually leave a lot of reach on the table after each upload.`,
  (f) => `${f} — one strong video should feed Shorts, TikTok, Reels, and social posts. Most people still cut that by hand.`,
  (f) => `Wanted to share something useful for your channel, ${f}. Clipzy turns one recording into a full content set.`,
  (f) => `${f}, if you're already making long-form content, the fastest growth lever is usually better repurposing — not more filming.`,
  (f) => `I'll keep this short, ${f}. Clipzy helps YouTubers ship clips, captions, and posts from a single upload.`,
  (f) => `${f}, curious if multi-platform content is still a time sink for you after each video.`,
  (f) => `Creators burn hours rewriting the same video into Shorts and posts. Built Clipzy so you don't have to, ${f}.`,
  (f) => `${f} — thought of you because long-form YouTubers get the most value from a real content engine.`,
  (f) => `Quick note, ${f}: what if your next upload automatically became Shorts, Reels, threads, and show notes?`,
  (f) => `${f}, the bottleneck for most YouTubers isn't ideas — it's turning one video into everywhere-content fast.`,
  (f) => `I know cold emails are noisy, ${f}, so here's the point: Clipzy = one studio for the episode, the reel, and the post.`,
  (f) => `${f}, if clipping highlights still eats your evenings, this might be worth 2 minutes.`,
  (f) => `YouTubers who grow fastest usually ship on more platforms from the same shoot. That's what Clipzy is for, ${f}.`,
  (f) => `${f} — no fluff: upload once, get clips + social posts + show notes without stacking five tools.`,
  (f) => `Figured this could help your content workflow, ${f}. One premium studio instead of a messy production stack.`,
  (f) => `${f}, after every long video there's usually a second job: Shorts, captions, posts. Clipzy handles that second job.`,
  (f) => `Sending this because creators like you shouldn't need a bigger team just to stay consistent across platforms, ${f}.`,
];

const NAME_ONLY_CLOSINGS = [
  (f) => `If it looks useful, try Clipzy free on your next upload and see what it generates, ${f}.`,
  (f) => `${f}, no pressure — if cleaner repurposing would help, it's ready when you are: clipzy.com`,
  (f) => `Would love for you to pressure-test it on one real video and tell me what you think, ${f}.`,
  (f) => `If multi-platform growth is on your list, this is probably the highest-leverage 10 minutes this week, ${f}.`,
  (f) => `${f}, start with one upload — you'll immediately see clips, posts, and notes come out of a single file.`,
  (f) => `Happy to let the product speak for itself. Try it free whenever timing is right, ${f}.`,
  (f) => `${f}, if you're tired of the post-publish grind, Clipzy was built for exactly that.`,
  (f) => `Either way, appreciate you reading this, ${f}. Link again if useful: clipzy.com`,
  (f) => `${f}, creators using Clipzy usually feel the time-save on the very first video.`,
  (f) => `If Shorts + social still take longer than filming, Clipzy is worth a look, ${f}.`,
  (f) => `${f} — upload one episode and judge it on the output, not the pitch.`,
  (f) => `Hope this helps you ship more without working more, ${f}.`,
  (f) => `${f}, if you try it, I'd genuinely like your feedback as a creator.`,
  (f) => `When you're ready for more reach from the same filming time, Clipzy is here, ${f}.`,
  (f) => `${f}, free to try — and built specifically for long-form creators who need a content engine.`,
  (f) => `If this isn't relevant right now, no worries at all, ${f}. Timing matters.`,
  (f) => `${f}, one studio, five tools worth of workflow — that's the whole idea.`,
  (f) => `Curious what you'd generate from your latest video inside Clipzy, ${f}.`,
  (f) => `${f}, more platforms, same filming time — that's the promise if you give it a spin.`,
  (f) => `Thanks for your time, ${f}. Hope Clipzy saves you a few hours this week.`,
];

const NAME_ONLY_SUBJECTS = [
  (f) => `${f}, turn one video into a full content engine`,
  (f) => `${f} — Shorts, Reels, and posts from one upload`,
  (f) => `Quick idea for your channel, ${f}`,
  (f) => `${f}, stop clipping YouTube videos by hand`,
  (f) => `${f}: one upload → a week of content`,
  (f) => `${f}, more reach without more editing`,
  (f) => `Built this for YouTubers like you, ${f}`,
  (f) => `${f} — the production stack, without the stack`,
  (f) => `${f}, after you hit publish… then what?`,
  (f) => `Idea for you, ${f}: full content from one video`,
  (f) => `${f}, ship Shorts the same day you upload`,
  (f) => `${f} — less editing, more platforms`,
  (f) => `Worth 2 minutes, ${f}?`,
  (f) => `${f}, your next video can feed every platform`,
  (f) => `${f}: clips + posts + show notes in one studio`,
  (f) => `${f}, grow faster from content you already film`,
  (f) => `For YouTubers who hate the post-publish grind, ${f}`,
  (f) => `${f} — one studio for the episode, reel, and post`,
  (f) => `${f}, curious about your clipping workflow`,
  (f) => `${f}: try Clipzy free on your next upload`,
];

function generatePersonalizedOpener(contact) {
  const first = firstName(contact);
  const email = contact.email || first;
  const channel = channelName(contact);
  const snippet = profileSnippet(contact.company_profile, 90);

  // Prefer richer lines only when we actually have channel/company data
  if (channel) {
    const rich = [
      `I've been looking at creators like you behind ${channel}, and the long-form work stands out — the hard part is usually everything after publish.`,
      `${channel} is the kind of channel that deserves more reach than just the main upload.`,
      `Came across ${channel} and wanted to reach out personally, ${first}. Long-form is strong; turning every video into Shorts and posts is usually the bottleneck.`,
      `${first}, creators behind ${channel} usually don't need more ideas — they need a faster way to ship everywhere after one upload.`,
    ];
    if (snippet) {
      rich.push(
        `Noticed ${channel}'s focus — ${snippet} That kind of content usually clips extremely well across Shorts and Reels.`,
      );
    }
    return pickVariant(email + '|opener-rich', rich);
  }

  const variants = NAME_ONLY_OPENERS.map((fn) => fn(first));
  return pickVariant(email + '|opener', variants);
}

function generatePersonalizedClosing(contact) {
  const first = firstName(contact);
  const email = contact.email || first;
  const channel = channelName(contact);
  const snippet = profileSnippet(contact.company_profile, 100);

  if (channel && snippet) {
    return pickVariant(email + '|close-profile', [
      `Since ${channel} is focused on ${snippet.toLowerCase().replace(/\.\.\.$/, '')}, Clipzy could help turn each recording into clips and posts without a bigger team.`,
      `Based on what ${channel} creates (${snippet}), I think you'd feel the time-save quickly, ${first}.`,
    ]);
  }

  if (channel) {
    return pickVariant(email + '|close-channel', [
      `If growing ${channel} across Shorts and social is on your list, Clipzy is built for exactly that.`,
      `Happy to let you try Clipzy on a recent ${channel} upload — clips, posts, and notes from one file.`,
      `For ${channel}, the upside is simple: more platforms, same filming time.`,
      `${first}, try it free on your next ${channel} upload and judge the output.`,
    ]);
  }

  const variants = NAME_ONLY_CLOSINGS.map((fn) => fn(first));
  return pickVariant(email + '|closing', variants);
}

function generatePersonalizedSubject(contact) {
  const first = firstName(contact);
  const email = contact.email || first;
  const channel = channelName(contact);

  if (channel) {
    return pickVariant(email + '|subject-channel', [
      `${first}, one ${channel} video → Shorts, posts, and notes`,
      `${first} — more reach for ${channel} without more editing`,
      `Idea for ${channel}: full content from one upload`,
      `${first}, turn your next ${channel} video into a content week`,
      `${channel} + Clipzy — more reach, same filming time`,
    ]);
  }

  const variants = NAME_ONLY_SUBJECTS.map((fn) => fn(first));
  return pickVariant(email + '|subject', variants);
}

module.exports = {
  generatePersonalizedOpener,
  generatePersonalizedClosing,
  generatePersonalizedSubject,
  detectCreatorType,
  detectRoleType: detectCreatorType,
};
