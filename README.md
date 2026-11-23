# World News Detective — ENHANCED Listening Adventure (editable draft)

A colourful, responsive, interactive Year 5 English **listening** website designed as an editable starting point for **Task 2: Showcase Materials**.

## Academic integrity

Your lecturer permits AI-generated plans/drafts but requires a **personally created final product**. This version is an **editable prototype**. Independently rewrite/adapt its scripts, content, instructional choices and visual design; record your own voice; test it with your own learner profile; and cite genuine academic evidence in the accompanying digital explanation. Do not submit the draft unchanged.

The school names and events are fictional, created for a learning scenario; they are **not real news reports**.

## New interactive activities

- **Mission HQ** — colourful homepage, optional personal welcome audio and four earned badges (no timed competition).
- **Get Ready** — choose two evidence-based topic predictions.
- **News Report A: Malaysia** — pupil-controlled playback, listening passport and **Sound Hunt** (four real audio clues, two decoys).
- **News Report B: New Zealand** — same choice-based listening experience, with new cues.
- **Detective Challenge** — six-question main-idea/detail quiz, **Story Scramble** sequencing with accessible Up/Down controls, and **Fact Check Newsroom** (true/false statements that require listening evidence).
- **Culture Connect** — **Country Connection** sorter (Malaysia, New Zealand, both), partner discussion and respectful-question sentence frames.
- **Mission Complete** — self-assessment and printable certificate; session badges based on successful activities.
- **Teacher Studio** — a demo-password screen followed by lesson stages, differentiation paths, editable transcripts, an optional mic recorder and instructions.

All answer/progress state stays in the current browser tab's memory; the site does not collect data or transmit pupil records. Name/avatar is optional and should be fictional. Refreshing resets progress. A basic password gate is included for the Teacher Studio as a **showcase convenience**, not for protecting private information. It does not store pupil data. No leaderboard.

## File structure

```text
world-news-detective/
├── index.html                # App structure and teacher scripts
├── styles.css                # Editable UI styles, including new games
├── app.js                    # All interactions and recorder
├── .nojekyll
├── README.md
├── VOICE_RECORDING_GUIDE.md  # Three scripts + recording + upload steps
└── assets/
    └── audio/
        └── README.txt        # File naming guide; YOUR audio goes here
```

## How to publish on GitHub Pages

1. Create a GitHub repository, e.g., `world-news-detective`.
2. Extract the ZIP and upload **the contents** to the repository root, so `index.html` is at the root of the branch.
3. Commit to `main`.
4. In **Settings → Pages**, under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/(root)`, then save.
5. Your GitHub Pages address generally follows `https://YOUR-USERNAME.github.io/world-news-detective/`.
6. Then add **your recorded audio**, as explained in `VOICE_RECORDING_GUIDE.md`.

Official docs: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Recording your voice

The website's **Teacher Studio** has **Start recording**, **Stop**, **Preview**, and **Download** controls. Select one of the three recordings. Browsers support recording on secure contexts (GitHub Pages is HTTPS) but may output `.webm` or `.m4a` rather than `.mp3`. Upload the files manually into `assets/audio/` using their exact names.

See **VOICE_RECORDING_GUIDE.md** for the full newsreader scripts and step-by-step directions.

## Learning design notes

**Intended core 30-minute lesson:** prediction (5 minutes), two short audio reports/passports and Sound Hunt (15 minutes), partner comparison and exit ticket (10 minutes). The Newsroom Quiz, Story Scramble, Fact Check, and extended sorting are **optional** and can be used for differentiation, extension, or a longer showcase. **Do not try to force all activities into a 30-minute lesson.**

- **Learner autonomy:** choose order, pause and replay audio, select optional hints, select extension games.
- **Listening strategy:** prediction, focused listening for details, sound recognition, sequence reconstruction, self-monitoring.
- **Co-learning:** respectful partner comparison before writing.
- **Scaffolding:** short scripts, pictured clue cards, optional word hints, actionable feedback, no countdown, and accessible reorder controls.
- **Intercultural competence:** avoid treating an individual school's story as representing all people of a country; discuss similarity/difference respectfully.
- **Showcase evaluation:** demonstrate actual pupil interaction, evidence from the audio, meaningful scaffolding and independent material adaptation, not just colourful design.

Please independently verify any educational literature used to justify these elements, and use APA 7th references (2020–2026 if required by your lecturer).

## Safety, accessibility, and privacy

- Keep pupil responses and nicknames non-identifiable. This version does not transmit or persist them.
- Publish **your own voice**, not pupil voice recordings, without approved consent and institutional clearance.
- There are no external scripts, trackers, external logins, analytics, data stores or uploads.
- The Teacher Studio password is checked in public JavaScript on the visitor’s device, so **anyone can find it in the page source or bypass the gate**. Do not store student records, private data, or real credentials here.
- Change the password in `app.js` at `TEACHER_DEMO_PASSWORD` if you want a different classroom demonstration code. The password unlocks only for the current browser tab until you refresh or press **Lock Teacher Studio**.
- Moving story cards uses buttons, not drag-and-drop, so keyboard/mobile users can participate.
- For low-connectivity schools, save an offline copy, use teacher playback via speaker and printed listening passports.

## After you change the scripts

Check and update all related answers in `app.js`: `keys`, `questions`, `storySteps`, `facts`, and `cultureTiles`; and review the Sound Hunt clue tiles in `index.html`. **Changing one fact without changing the question keys will mark correct listening answers wrong.**
