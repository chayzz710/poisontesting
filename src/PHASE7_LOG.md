# Phase 7 — Polish, Easter Eggs, Deploy ✅

## Files built

```
src/hooks/useRiptide.ts
src/components/motifs/RiptideSlash.tsx
src/components/features/home/MonthlyAnniversaryBanner.tsx
src/pages/NotFoundPage.tsx
src/App.tsx                          ← two additions (see App-additions.ts)
src/styles/globals.css               ← paste in globals-additions.css
```

---

## What was built

### 🗡 Riptide keyboard easter egg
- `useRiptide.ts` hook — listens globally for the sequence `r-i-p-t-i-d-e` typed anywhere on the page (ignores input/textarea focus)
- `RiptideSlash.tsx` — when triggered: a diagonal sword-slash line in riptide blue + orchid purple sweeps across the full screen with a ⚔️ at the centre, lasts 1.5 seconds then disappears
- Mounted once in `App.tsx` so it works on every page without adding it to each page

### 🎂 Monthly anniversary banner
- `MonthlyAnniversaryBanner.tsx` — renders only when `today.getDate() === 9` (the 9th of each month)
- Shows: months count, a random old photo fetched from Supabase, dismissable with ✕
- Dismissal stored in `sessionStorage` so it doesn't reappear on the same day after refresh
- Drop it into `HomePage.tsx` at the top of the page content, above the days counter

### 🐸 404 page
- `NotFoundPage.tsx` — sad wiggling frog, "404 the frog got lost", "take me home 🌻" button
- Wired up in `App.tsx` via `<Route path="*" element={<NotFoundPage />} />`

### ♿ prefers-reduced-motion
- Added to `globals.css` — kills all CSS animations/transitions for users who have reduced motion enabled in their OS

---

## How to wire everything in

### App.tsx — two additions:
```tsx
// 1. Add imports:
import NotFoundPage from './pages/NotFoundPage'
import RiptideSlash from './components/motifs/RiptideSlash'

// 2. Add <RiptideSlash /> just inside <BrowserRouter>, before <Routes>
// 3. Add <Route path="*" element={<NotFoundPage />} /> as the last route
```

### HomePage.tsx — add the banner:
```tsx
import MonthlyAnniversaryBanner from '../components/features/home/MonthlyAnniversaryBanner'

// At the top of the page content, before the days counter:
<MonthlyAnniversaryBanner />
```

### globals.css — paste in the additions from globals-additions.css

---

## Pre-launch checklist

- [ ] Fill in `OWNERS` in `src/types/index.ts` once both users have logged in
- [ ] Tighten RLS policies to `auth.uid() in (OWNERS.char, OWNERS.rag)` on all tables
- [ ] Confirm Supabase redirect URLs include your Vercel production domain
- [ ] Test as both char and rag — make sure each sees the other's content
- [ ] Test the frog easter egg on every page
- [ ] Test typing `riptide` anywhere → sword slash appears
- [ ] Test the 404 page by going to `/anything-random`
- [ ] Check the anniversary banner — if today is the 9th it should show; otherwise temporarily change the check to `=== today.getDate()` to test it
- [ ] Back up Supabase DB (Supabase → Database → Backups)
- [ ] Add `<title>` tags per route using `react-helmet-async` (optional but nice)

---

## Notes

- The frog easter egg (`FrogEasterEgg`) was built in Phase 1 and is already inside `PageWrapper` — it shows on every page automatically. No changes needed.
- The `RiptidePen` (pen → sword on hover in the navbar) was built in Phase 1. No changes needed.
- Anniversary date updated to the **9th** (not 14th as originally planned).
