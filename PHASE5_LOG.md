# Phase 5 — Letters + Memory Jar + Pun Wall ✅

## Files built

### Letters (`/letters`)
```
src/pages/LettersPage.tsx
src/hooks/useLetters.ts
src/components/features/letters/EnvelopeCard.tsx
src/components/features/letters/LetterModal.tsx
src/components/features/letters/WriteLetterModal.tsx
```

### Memory Jar (`/jar`)
```
src/pages/MemoryJarPage.tsx
src/hooks/useMemoryJar.ts
src/components/features/memoryjar/KinderJarSVG.tsx
src/components/features/memoryjar/NoteModal.tsx
src/components/features/memoryjar/AddNoteModal.tsx
```

### Pun Wall (`/puns`)
```
src/pages/PunWallPage.tsx
src/hooks/usePuns.ts
src/components/features/puns/PunCard.tsx
src/components/features/puns/AddPunModal.tsx
```

### Types
```
src/types/index.ts  — merge in Letter, MemoryNote, Pun interfaces
```

---

## Feature summary

### Letters
- Envelope grid with colour-coded cards per letter
- Each card shows: title, sealed/opened badge, "open when" lock badge + condition hint
- Click → 3-stage modal:
  - **confirm** (for sealed "open when" letters): "are you sure this is the right moment?"
  - **opening**: flap rotates open animation (rotateX), paper slides up
  - **reading**: full letter body, authored date, opened date
- Write modal: title, body, open-when toggle, unlock condition field
- Opened letters set `opened_at` timestamp in DB (irreversible)

### Memory Jar
- Illustrated Kinder egg SVG (cracked open, notes peeking out)
- Notes scattered as folded paper triangles with seeded stable positions
- Click any note → unfolds in a spring-animated modal
- "Shake the jar" button: wiggles the egg, picks a random note
- Add note modal: body textarea + chocolate rating

### Pun Wall
- CSS `columns-3` masonry layout — no JS masonry library needed
- Each card is a sticky note with subtle seeded tilt + pastel colour cycling
- Emoji rating row (😩 😐 🙂 😆 🤣) — hover highlights, click saves to DB
- Authors cannot rate their own puns
- Sort toggle: newest / best / worst
- Add pun modal

---

## Notes / things to watch

- **`LetterModal`** has three internal stages managed by local state. The `opening` stage triggers a DB update after 1.2s (matches animation duration). If the update fails, a toast fires but the modal stays open — user can try again.
- **Pun rating** updates `puns.rating` and `puns.rated_by` in one DB call. There's no multi-vote system — last rating wins. That's fine for two people.
- **Memory jar layout** uses the same `seededOffset` / `seededTilt` from Phase 4 utils. Make sure those are in `src/lib/utils.ts`.
- **`columns-3`** masonry in Tailwind works as `className="columns-3"` — no plugin needed. Items must have `break-inside-avoid` to prevent splitting across columns (already on PunCard).

---

## What's next

**Phase 6 — Map + Playlist + Bucket List**
- Interactive Leaflet map with custom frog/sunflower pins
- Spotify playlist with anthem embed + add-song form
- Bucket list with two-column done/undone layout + chess watermark
