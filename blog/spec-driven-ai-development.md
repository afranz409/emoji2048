# The Spec-Driven Build: From Ten-Year-Old Idea to Live Game in an Hour

*Alex Franz · 5/24/2026 · [X min read]*

---

Like so many others I spent much of 2014 hooked on 2048. Addictively simple, brutally hard to put down; achievable yet challenging.

At some point I got the idea in my head to build a version that replaced numbers with Emoji.  The same satisfying game-play with a fun visual twist! I fiddled with the idea briefly, but lost interest soon after. But the idea has lived in the back of my head for the last decade.

Last week I finally built it. Start to finish in about an hour using Claude Code. But the impressive piece wasn't the pace, it was the flow, moving from concept to architecture to specs to build meant the implementation was nearly perfect with a one-shot command in Claude Code. This wasn't repeated cycles of vibe-code iteration. I focused on a solid spec which resulted in a solid build.

---

## The Game

![Screenshot](http://afranz409.github.io/emoji2048/blog/screenshot.png)

Emoji 2048 is a modernized clone of the original, replacing numbers with an emotion arc — from 😶 to 🌈. Built with React, deployed on GitHub Pages, open source.

👉 [Play it here](https://afranz409.github.io/emoji2048)  
👉 [Source on GitHub](https://github.com/afranz409/emoji2048)
👉 [The original 2048](https://mgarciaisaia.github.io/2048/)  


---

## The Process

The workflow had three distinct phases:

**Phase 1 — Design conversation (~20 min in Claude.ai)**  
Before any code, a conversation to make every decision that would otherwise derail implementation: emoji theme, visual aesthetic, color progression, game mechanics, what's in scope, what's not. The output was a full markdown spec.  It only took 20 minutes, and I did the entire design conversation from my phone.

> We will design a clone of the popular free viral game 2048 which uses emoji instead of numbers.  Get started with the general design, decisions we need to make, and spec.  While we start as a clone principle we want to modernize to a truly stunning look

Claude broke this down into a core set of decisions:
* The Emoji Progression
* The Visual Aesthetic
* The Mechanics (clone vs modernization)
* Tech Stack
* Spec Summary

Most of the defaults were on-point, but we needed to iterate on the Emoji Progression.  Here was the initial recommendation:

| Theme | Progression Example | Vibe |
|---|---|---|
| **Nature / Evolution** | 🌱→🌿→🌳→🌲→🌴→🔥→💥→🌋→🌍→🌌→🪐→⭐ | Organic, satisfying |
| **Cosmic / Scale** | 🪨→💧→🔥→🌪️→⚡→🌙→🌟→🌞→🪐→🌌→🌀→✨ | Epic, mysterious |
| **Food / Chaos** | 🍇→🍕→🍔→🌮→🦞→🥩→🍱→👑🍽️ | Playful, absurd |
| **Civilization** | 🪵→🔨→⚔️→🏰→🚀→🤖→🧬→🌐→🪐→🧠→♾️ | Narrative arc |

A nudge (the human-side input) got us to the progression of Emoji 2048:

```
😶→🙂→😊→😄→😂→😍→🤩→😱→🤯→💀→👻→🌈
```

**Phase 2 — Spec + CLAUDE.md**  
From here we moved into the spec. I wanted to take a first pass in the chat:
> Let’s spec the code so it’s easy to change as a feature in the future

The response was solid, laying out progression, React state, logic modules, rendering, file structure, and constraints. Not "build-ready", but the right framing. It offered to start coding, but I wanted to hand-off a build-ready spec to Claude Code instead:
> Don’t code.  Build me a full and comprehensive spec as a markdown file so any engineer or agent could implement.

The spec lives at `/specs/Emoji2048-spec.md` — 13 sections covering game logic, state architecture, component design, animation system, accessibility, and acceptance criteria.

But I wasn't ready to hit "run" quite yet.

Building the right context and enforcing a step-by-step build process is important. I had the chat also generate a `CLAUDE.md` and a 5-10 step `build-plan.md` at this point. We could have saved this for a `plan` stage in Claude Code. I wanted to build in chat to retain the full non-technical context and give Claude Code the best start possible.

**Phase 3 — One Claude Code call**  
Coding was the easy part! After dropping those three files into a fresh git repo there was just one command left:
`/batch implement full project step by step based on build plan found in specs/emoji2048-buildplan.md`

Eight incremental build steps, each with a specific prompt referencing the spec by section number. Executed as a single `/batch` call. Fifteen minutes and 8 seconds later the game came out fully functional!

A few subsequent commits were needed for perfection (the background color progression was less-than intuitive, and there were a couple additions to be "deploy-ready"). This was trivial, and the pace for a 0-1 build was incredible!

---

## Why it Worked

### The build plan became the multiplier

Having a spec is great, but anybody building complex software will know that how you approach implementation is just as important. Breaking problems into atomic units which can be constructed independently and build incrementally is what can make a project easy or painful. Providing Claude with a plan (even if self-created) is an unlock.

### Decisions got forced early

We zeroed in on differentiating decisions early, which enabled key architectural decisions to happen before a line-of-code was written. Iterating on the spec lets you do this in ways free-form vibe coding may not.


### The "easy to change" constraint

Early in the conversation I said I wanted emoji themes to be swappable in the future. That one sentence shaped the entire architecture — a single `TILE_CONFIG` array as the source of truth for all emoji, colors, and game logic. Intent captured before implementation means the right abstractions get built the first time.

## I used Sonnet only, Not Opus

Opus is often overkill. The right move is making Sonnet successful — through design, CLAUDE.md, and a thoughtful build plan. The spec is the multiplier, not the model.

---

## The Friction Is Gone

As somebody whose career has progressed from coder to architect to leader, sometimes it seems like starting a new project is intractable. Not because it's hard, but because time is scarce. This was just a small snapshot project, but a great opportunity to illustrate just how impactful this technology can be.

Here are my top 3 takeaways from this project:
- Claude Code is an incredible tool - I would estimate this build 10x faster than a similar project when I was "in my prime" coding professionally every day.
- I get to engage at a higher level - I'm still making key decisions and can influence a "good" versus "great" outcome. Engineering Principles apply, we are simply stepping up a level. Revolutionary, but we've transformations like this before.
- Most importantly - I'm motivated to take on those ideas that I put aside years ago. The friction is gone; the door is open, and the cost to experiment is trivial.

---

## Resources

- 🎮 [Play Emoji 2048](https://afranz409.github.io/emoji2048)
- 💻 [GitHub repo](https://github.com/afranz409/emoji2048)
- 📄 [Full spec](https://github.com/afranz409/emoji2048/blob/main/spec/emoji2048-spec.md)
- ☕ [Buy me a coffee](https://ko-fi.com/afranz409)