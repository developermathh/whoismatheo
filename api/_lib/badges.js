/* Public Discord badges that are derivable from `public_flags`, a documented field of the User object
   (https://discord.com/developers/docs/resources/user#user-object-user-flags). Only flags that are actually set are returned.
   Badges that Discord does not put in public_flags (Nitro, server boosting, Quests, Orb, Legacy username...) are NOT available
   to any official API, so they are never shown or guessed. */
"use strict";
const FLAGS = [
  [1 << 0, "staff"], [1 << 1, "partner"], [1 << 2, "hypesquadEvents"], [1 << 3, "bugHunter1"],
  [1 << 6, "hypesquadBravery"], [1 << 7, "hypesquadBrilliance"], [1 << 8, "hypesquadBalance"], [1 << 9, "earlySupporter"],
  [1 << 14, "bugHunter2"], [1 << 17, "verifiedDeveloper"], [1 << 18, "certifiedModerator"], [1 << 22, "activeDeveloper"]
];
function badgesFrom(publicFlags) {
  const f = Number(publicFlags);
  if (!Number.isFinite(f) || f <= 0) return [];
  return FLAGS.filter(([bit]) => (f & bit) === bit).map(([, key]) => key);
}
module.exports = { badgesFrom, FLAGS };
