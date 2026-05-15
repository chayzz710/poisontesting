# Phase 4 — Photo Gallery ✅

## What was built

### New files
- `src/pages/GalleryPage.tsx` — main page: header, view-mode toggle, empty state, upload trigger, delegates to MessyView or TimeView; renders PhotoModal on click
- `src/hooks/usePhotos.ts` — fetches all photos from Supabase (joined with profiles), generates signed URLs (1hr TTL) for each, exposes `refetch()`
- `src/components/features/gallery/MessyView.tsx` — scattered polaroid layout; positions are seeded by photo ID so they're stable across re-renders; seeded tilt (−8°..+8°), seeded XY offset per item; three size buckets (sm/md/lg); hover lifts + de-rotates via Framer Motion spring
- `src/components/features/gallery/TimeView.tsx` — CSS grid grouped by month; month headers in Caveat; lazy-loaded images; staggered fade-in per group
- `src/components/features/gallery/UploadModal.tsx` — drag-and-drop OR file picker; client-side compression via `browser-image-compression` (max 1MB / 1920px); upload to Supabase `photos` bucket; animated progress bar; caption, date, chocolate rating inputs
- `src/components/features/gallery/PhotoModal.tsx` — full-image view; shows uploader nickname + date; inline caption + chocolate-rating editing (owner only); delete with confirm dialog; spring-animated open/close

### Type updates
- `src/types/index.ts` — `Photo` type updated: added `url: string | null` (signed URL populated at fetch time, not a DB column) and optional `profiles` join shape

### Utils additions
- `src/lib/utils.ts` — added `seededOffset(seed, min, max)` if not already present

---

## How the data flow works

```
GalleryPage
  └── usePhotos()
        ├── supabase.from('photos').select('*, profiles(...)')
        └── for each photo: supabase.storage.createSignedUrl(path, 3600)
              → photo.url = signedUrl (cached in state for the session)

Upload flow:
  UploadModal
    ├── imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 })
    ├── supabase.storage.from('photos').upload(path, compressed)
    └── supabase.from('photos').insert({ ... })
        → onSuccess() → GalleryPage calls refetch()
```

---

## Key decisions

| Decision | Reason |
|---|---|
| Signed URLs (not public bucket) | Gallery content is private — public bucket would expose all photos to anyone with a URL |
| Seed positions by photo ID | Without seeding, photos jump on every re-render; UUID → deterministic hash → stable layout |
| Client-side compression before upload | Supabase free tier = 1GB; uncompressed iPhone photos = 4MB each; 250 photos without compression fills the bucket |
| `loading="lazy"` on all `<img>` | Gallery can get heavy; off-screen images don't load until needed |
| `refetch()` after upload/delete | Simpler than optimistic updates; correct; signed URLs stay fresh |

---

## Supabase storage setup reminder

If not done in Phase 0, create these buckets:
- `photos` — **private** (RLS handled by policies)
- Add storage policy: `authenticated` users can `INSERT` into `photos/[their user id]/*`
- Add storage policy: `authenticated` users can `SELECT` from `photos` (to generate signed URLs)

```sql
-- Storage policy for uploads (in Supabase dashboard → Storage → Policies)
-- Or via SQL:
create policy "authenticated upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

create policy "authenticated read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'photos');

create policy "owner delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## What's next

**Phase 5 — Letters + Memory Jar + Pun Wall**

- `LettersPage` — envelope grid, flip animation, "Open When" sealed letters
- `MemoryJarPage` — Kinder Joy illustrated jar, scattered notes, "shake the jar" random pick
- `PunWallPage` — sticky-note masonry, emoji rating, add-a-pun form
