import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Input, Textarea } from '../components/ui/Input'
import ChocolateRating from '../components/ui/ChocolateRating'
import SunflowerDivider from '../components/motifs/SunflowerDivider'
import ChocolateBar from '../components/motifs/ChocolateBar'
import RiptidePen from '../components/motifs/RiptidePen'
import LoadingPun from '../components/ui/LoadingPun'
import { useState } from 'react'

export default function StyleguidePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [rating, setRating] = useState<number | null>(3)

  return (
    <PageWrapper pageKey="styleguide">
      <h1 className="font-display text-5xl text-chocolate mb-2">Design System</h1>
      <p className="font-hand text-orchid-deep text-xl mb-10">every primitive in one place 🌻</p>

      {/* Colors */}
      <section className="mb-10">
        <h2 className="font-display text-2xl mb-4">Colors</h2>
        <div className="flex gap-3 flex-wrap">
          {[
            ['#F5C842', 'sunflower'],
            ['#E2A500', 'sunflower-dark'],
            ['#9B7FD4', 'orchid'],
            ['#6A5ACD', 'orchid-deep'],
            ['#FFFDF4', 'cream'],
            ['#3B1F0E', 'chocolate'],
            ['#FFFFFF', 'surface'],
            ['#3B82C4', 'riptide'],
          ].map(([hex, name]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div
                className="w-14 h-14 rounded-xl shadow-soft border border-chocolate/10"
                style={{ background: hex }}
              />
              <span className="text-xs font-hand text-chocolate/60">{name}</span>
            </div>
          ))}
        </div>
      </section>

      <SunflowerDivider />

      {/* Typography */}
      <section className="mb-10">
        <h2 className="font-display text-2xl mb-4">Typography</h2>
        <p className="font-display text-4xl text-chocolate mb-2">Playfair Display — headings</p>
        <p className="font-body text-lg text-chocolate mb-2">Inter — body text, clean and readable</p>
        <p className="font-hand text-2xl text-orchid-deep">Caveat — handwritten labels & notes 💛</p>
      </section>

      <ChocolateBar />

      {/* Buttons */}
      <section className="mb-10">
        <h2 className="font-display text-2xl mb-4">Buttons</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" size="sm">Small Primary</Button>
          <Button variant="ghost" size="sm">Small Ghost</Button>
        </div>
      </section>

      <SunflowerDivider />

      {/* Cards */}
      <section className="mb-10">
        <h2 className="font-display text-2xl mb-4">Cards</h2>
        <div className="flex gap-4 flex-wrap">
          <div className="card w-48">
            <p className="font-hand text-orchid-deep text-lg">a regular card</p>
            <p className="text-sm text-chocolate/60 mt-1">soft shadow, rounded</p>
          </div>
          <div className="polaroid w-40">
            <div className="bg-sunflower/20 h-28 rounded mb-2 flex items-center justify-center text-3xl">📸</div>
            <p className="font-hand text-chocolate/70 text-sm text-center">a polaroid</p>
          </div>
        </div>
      </section>

      <ChocolateBar />

      {/* Inputs */}
      <section className="mb-10">
        <h2 className="font-display text-2xl mb-4">Form Inputs</h2>
        <div className="flex flex-col gap-4 max-w-sm">
          <Input label="Name" placeholder="type something..." />
          <Textarea label="Memory" placeholder="write a little note..." rows={3} />
          <div>
            <p className="text-sm font-medium text-chocolate/70 mb-2">Chocolate Rating</p>
            <ChocolateRating value={rating} onChange={setRating} />
          </div>
        </div>
      </section>

      <SunflowerDivider />

      {/* Modal */}
      <section className="mb-10">
        <h2 className="font-display text-2xl mb-4">Modal</h2>
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Hello from the modal 💌">
          <p className="text-chocolate/70">Press Esc or click outside to close. This is where letters unfold, photos expand, notes appear.</p>
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>close</Button>
          </div>
        </Modal>
      </section>

      <ChocolateBar />

      {/* Motifs */}
      <section className="mb-10">
        <h2 className="font-display text-2xl mb-4">Motifs</h2>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <RiptidePen />
            <p className="text-xs font-hand text-chocolate/50 mt-1">hover me</p>
          </div>
          <div className="text-center">
            <span className="text-2xl opacity-10 hover:opacity-100 transition-opacity cursor-pointer">🐸</span>
            <p className="text-xs font-hand text-chocolate/50 mt-1">frog (hidden)</p>
          </div>
        </div>
      </section>

      <SunflowerDivider />

      {/* Loading pun preview */}
      <section className="mb-10">
        <h2 className="font-display text-2xl mb-4">Loading State</h2>
        <div className="card max-w-xs">
          <LoadingPun />
        </div>
      </section>

    </PageWrapper>
  )
}
