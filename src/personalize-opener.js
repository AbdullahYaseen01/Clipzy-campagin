/**
 * Personalized subject / opener / closing for Clipzy outreach.
 * Spam-safe: no "free", "click here", "subscribe", hype, or multi-link CTAs.
 * Works with only name + email.
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

const NAME_ONLY_OPENERS = [
  (f) => `${f}, I am writing because most creators lose hours after every upload — not during filming.`,
  (f) => `Quick thought for you, ${f}: the creators growing fastest are not filming more. They are getting more from each video.`,
  (f) => `${f}, after you publish a long video, how much time still goes into clips, captions, and posts?`,
  (f) => `I built Clipzy for creators who want Shorts, Reels, and posts without a second editing day, ${f}.`,
  (f) => `${f}, one strong video should feed every platform. Most people still rebuild that pack by hand.`,
  (f) => `Wanted to share a cleaner workflow for your content, ${f} — one recording, full content set.`,
  (f) => `${f}, if long-form is already your strength, the next lever is usually faster repurposing.`,
  (f) => `I will keep this short, ${f}. Clipzy helps you leave a recording with clips, captions, and posts ready.`,
  (f) => `${f}, curious whether multi-platform content still slows you down after each video.`,
  (f) => `A lot of creators love filming and hate the work that comes after. Sound familiar, ${f}?`,
  (f) => `${f} — long-form creators get the most from a real content engine, not another disconnected tool.`,
  (f) => `Quick note, ${f}: your next upload can become Shorts, Reels, threads, and show notes in one pass.`,
  (f) => `${f}, the bottleneck is rarely ideas. It is turning one video into everywhere-content fast.`,
  (f) => `Cold notes are noisy, ${f}, so here is the point: one studio for the episode, the reel, and the post.`,
  (f) => `${f}, if clipping and posting still eat your evenings, this may be worth a look.`,
  (f) => `Creators who stay consistent across platforms usually win. Clipzy is built for that cadence, ${f}.`,
  (f) => `${f} — upload once, get clips, social posts, and show notes without stacking five tools.`,
  (f) => `Thought this could help your workflow, ${f}. One connected studio instead of a messy production stack.`,
  (f) => `${f}, after every long video there is usually a second job. Clipzy handles that second job.`,
  (f) => `Writing because creators like you should not need a bigger team just to stay visible everywhere, ${f}.`,
];

const NAME_ONLY_CLOSINGS = [
  (f) => `If it looks useful, open the studio with one of your recent videos and judge the output, ${f}.`,
  (f) => `${f}, no pressure — if cleaner repurposing would help, the site is ready when you are.`,
  (f) => `Would value your take as a creator if you pressure-test it on a real upload, ${f}.`,
  (f) => `If multi-platform growth is on your list, this is a high-leverage ten minutes, ${f}.`,
  (f) => `${f}, start with one upload — you will see clips, posts, and notes come out of a single file.`,
  (f) => `Happy to let the product speak for itself whenever timing is right, ${f}.`,
  (f) => `${f}, if the post-publish grind is draining you, this was built for exactly that.`,
  (f) => `Appreciate you reading this, ${f}. The studio link is above if useful.`,
  (f) => `${f}, most creators feel the time-save on the very first video they process.`,
  (f) => `If Shorts and social still take longer than filming, Clipzy is worth opening, ${f}.`,
  (f) => `${f} — upload one episode and decide based on the output, not the pitch.`,
  (f) => `Hope this helps you ship more without working more, ${f}.`,
  (f) => `${f}, if you try it, I would genuinely like your feedback.`,
  (f) => `When you want more reach from the same filming time, the studio is ready, ${f}.`,
  (f) => `${f}, built specifically for long-form creators who need a content engine.`,
  (f) => `If timing is off, no worries at all, ${f}.`,
  (f) => `${f}, one studio covering the work of five tools — that is the whole idea.`,
  (f) => `Curious what your latest video would produce inside Clipzy, ${f}.`,
  (f) => `${f}, more platforms, same filming time — that is the outcome if you give it a spin.`,
  (f) => `Thanks for your time, ${f}. Hope this saves you hours this month.`,
];

const NAME_ONLY_SUBJECTS = [
  (f) => `${f}, after you hit publish — then what?`,
  (f) => `${f} — more from every video you already film`,
  (f) => `Quick idea for your channel, ${f}`,
  (f) => `${f}, your clipping workflow may be the bottleneck`,
  (f) => `${f}: one upload, full content set`,
  (f) => `${f}, more reach without more editing days`,
  (f) => `Built this for creators like you, ${f}`,
  (f) => `${f} — episode, reel, and post in one studio`,
  (f) => `${f}, thought on your content workflow`,
  (f) => `Idea for you, ${f}: more output per video`,
  (f) => `${f}, ship Shorts the same day you upload`,
  (f) => `${f} — less editing, more platforms`,
  (f) => `Two minutes on this, ${f}?`,
  (f) => `${f}, your next video can feed every platform`,
  (f) => `${f}: clips + posts + notes from one file`,
  (f) => `${f}, grow from content you already make`,
  (f) => `For creators tired of the post-publish grind`,
  (f) => `${f} — one studio instead of five tools`,
  (f) => `${f}, curious about your content workflow`,
  (f) => `${f}: open Clipzy on your next upload`,
];

const FOLLOW_UP_SUBJECTS = [
  (f) => `${f}, did my last note make it through?`,
  (f) => `Following up, ${f}`,
  (f) => `${f} — one more thought on your content workflow`,
  (f) => `${f}, quick second note`,
  (f) => `Re: your content workflow, ${f}`,
];

const FOLLOW_UP_OPENERS = [
  (f) => `${f}, looping back once in case the first note landed under other mail.`,
  (f) => `Just a short second note, ${f} — no need to reply if the timing is off.`,
  (f) => `${f}, last thing from me on this unless it is useful.`,
  (f) => `Bumping this once, ${f}, because the time-save usually shows up on the first video.`,
];

function generatePersonalizedOpener(contact) {
  const first = firstName(contact);
  const email = contact.email || first;
  const channel = channelName(contact);
  const snippet = profileSnippet(contact.company_profile, 90);
  const isFollowUp = contact._is_follow_up === true;

  if (isFollowUp) {
    return pickVariant(email + '|fu-opener', FOLLOW_UP_OPENERS.map((fn) => fn(first)));
  }

  if (channel) {
    const rich = [
      `I have been looking at creators behind channels like ${channel}, and the long-form work stands out — the hard part is usually everything after publish.`,
      `${channel} deserves more reach than just the main upload.`,
      `Came across ${channel} and wanted to reach out personally, ${first}. Long-form is strong; turning every video into Shorts and posts is usually the bottleneck.`,
      `${first}, creators behind ${channel} usually do not need more ideas — they need a faster way to ship everywhere after one upload.`,
    ];
    if (snippet) {
      rich.push(
        `Noticed ${channel}'s focus — ${snippet} That kind of content usually clips well across Shorts and Reels.`,
      );
    }
    return pickVariant(email + '|opener-rich', rich);
  }

  return pickVariant(email + '|opener', NAME_ONLY_OPENERS.map((fn) => fn(first)));
}

function generatePersonalizedClosing(contact) {
  const first = firstName(contact);
  const email = contact.email || first;
  const channel = channelName(contact);
  const snippet = profileSnippet(contact.company_profile, 100);

  if (channel && snippet) {
    return pickVariant(email + '|close-profile', [
      `Since ${channel} is focused on ${snippet.toLowerCase().replace(/\.\.\.$/, '')}, Clipzy can turn each recording into clips and posts without a bigger team.`,
      `Based on what ${channel} creates (${snippet}), I think you would feel the time-save quickly, ${first}.`,
    ]);
  }

  if (channel) {
    return pickVariant(email + '|close-channel', [
      `If growing ${channel} across Shorts and social is on your list, Clipzy is built for that.`,
      `Open the studio with a recent ${channel} upload and judge the clips, posts, and notes yourself.`,
      `For ${channel}, the upside is simple: more platforms, same filming time.`,
      `${first}, run one ${channel} video through the studio and decide from the output.`,
    ]);
  }

  return pickVariant(email + '|closing', NAME_ONLY_CLOSINGS.map((fn) => fn(first)));
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
      `${first}, more from every ${channel} video`,
      `${first} — ${channel} after publish`,
      `Idea for ${channel}: one upload, full content set`,
      `${first}, thought on the ${channel} workflow`,
      `${channel}: episode, reel, and post in one place`,
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
