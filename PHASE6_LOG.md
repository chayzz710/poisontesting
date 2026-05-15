# Phase 6 — Map + Playlist + Bucket List ✅

## Files built

### Map (`/map`)
```
src/pages/MapPage.tsx
src/hooks/useMapPins.ts
src/components/features/map/MapView.tsx
src/components/features/map/AddPinModal.tsx
src/components/features/map/PinDetailModal.tsx
```

### Playlist (`/playlist`)
```
src/pages/PlaylistPage.tsx
src/hooks/useSongs.ts
src/components/features/playlist/SongRow.tsx
src/components/features/playlist/AddSongModal.tsx
```

### Bucket List (`/bucketlist`)
```
src/pages/BucketListPage.tsx
src/hooks/useBucketList.ts
src/components/features/bucketlist/BucketItem.tsx
src/components/features/bucketlist/AddItemModal.tsx
```

### Types
```
src/types/index.ts — merge in MapPin, Song, BucketItem from phase6-type-additions.ts
```

---

## Feature summary

### Map
- Leaflet map (OpenStreetMap tiles, free) centred on India — **change the centre coordinates** in `MapView.tsx` to your actual city
- Emoji pin icons: 💛 first date, 🌻 favourite, 🐸 adventure, 📍 other — using `L.divIcon` (no SVG files needed)
- "Add a place" toggle → cursor turns crosshair → click map → `AddPinModal` opens with lat/lng pre-filled
- `AddPinModal`: title, story, pin type selector, visit date
- `PinDetailModal`: shows title, type, story, date, coordinates; owner can delete
- Filter chips: All / First Date / Favourites / Adventures
- Leaflet default icon Vite bug fixed (missing marker images) — handled in `MapView.tsx` via `L.Icon.Default.mergeOptions`

### Playlist
- Anthem embed at top — **set `ANTHEM_TRACK_ID`** in `PlaylistPage.tsx` to your Spotify track ID (get it from the URL: `open.spotify.com/track/THIS_PART`)
- Placeholder hint shown if anthem not set yet
- Song list below, each with Spotify embed (80px tall) + note
- `AddSongModal`: paste any Spotify track URL → `parseSpotifyTrackId()` extracts the ID → live preview embed shown before saving
- Songs deletable by owner

### Bucket List
- Chess queen watermark background (from Phase 1 `ChessWatermark` component)
- Two-column layout: "coming up" | "done!"
- Check off an item → bouncy checkbox animation, text strikes through, `done_at` timestamp saved, item moves to done column on next fetch
- Un-check to move back to coming up
- Delete on hover (owner only)
- Add item: title + optional description

---

## One thing to do after dropping these in

**Set your map centre.** In `MapView.tsx`, change:
```tsx
center={[20.5937, 78.9629]} // Centre of India
zoom={5}
```
to your actual city coordinates and a closer zoom (12–14 for a city). For example:
```tsx
center={[17.3850, 78.4867]} // Hyderabad
zoom={12}
```

**Set your anthem track ID.** In `PlaylistPage.tsx`, change:
```ts
const ANTHEM_TRACK_ID = 'YOUR_TRACK_ID_HERE'
```
to the ID from your Spotify song URL.

---

## Known limitations

- Map does not support photo uploads on pins yet (`photo_url` column exists in schema but UI doesn't use it — can be added in Phase 7 polish)
- Playlist has no "mark as anthem" toggle in the UI — the `is_anthem` DB column exists but the anthem is hardcoded as a constant for simplicity
- Bucket list has no category grouping yet (noted in build plan as "later if list grows")

---

## What's next

**Phase 7 — Polish, Easter Eggs, Deploy**
- Frog on every page, different corners
- Konami-style "riptide" keyboard shortcut
- Monthly anniversary banner (14th only)
- 404 page
- Performance audit + Lighthouse
- RLS tightening before launch
