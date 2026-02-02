import { ContactForm } from "./components/ContactForm";

const SECTION_CLASSES =
  "mx-auto w-full max-w-5xl px-6 sm:px-8 lg:px-10 xl:max-w-6xl";

export default function Home() {
  return (
    <main className="bg-[#f7f1e9] text-[#241a11]">
      {/* Top logo bar */}
      <div className="border-b border-black/5 bg-[#f7f1e9]/90 backdrop-blur">
        <div className={`${SECTION_CLASSES} flex items-center justify-center py-4`}>
          <img src="/blondage_logo.png" alt="Blondage & Co" className="h-64 w-auto" />
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className={`${SECTION_CLASSES} py-16 sm:py-20 lg:py-24`}>
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-6">
              <p className="inline-flex items-center rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-[#7c6750] shadow-sm backdrop-blur">
                Home-based hair studio · By appointment
              </p>
              <div className="space-y-4">
                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Professional Care, Personal Space.
                </h1>
                <p className="max-w-xl text-balance text-sm sm:text-base text-[#6f5a45]">
                  Blondage &amp; Co is a home-based salon created by Candice for
                  clients who love effortless, lived-in colour, healthy blondes,
                  and hair that feels as good as it looks.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full bg-[#cab69c] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2b2115] shadow-sm transition hover:shadow-md hover:brightness-105"
                >
                  Enquire now
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center rounded-full border border-[#cab69c]/70 bg-white/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#5a4632] shadow-sm transition hover:bg-[#f3e5d5]"
                >
                  View services
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-[#7c6750]">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#cab69c]" />
                  Specialising in modern blonding &amp; dimensional colour
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#cab69c]" />
                  Located in a private, home-based studio
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#f4e4d3] via-[#f7f1e9] to-[#e5d3c0] blur-3xl" />
              <div className="relative rounded-[2.25rem] border border-white/70 bg-white/70 p-1 shadow-[0_24px_60px_rgba(50,34,12,0.18)] backdrop-blur">
                <div className="grid h-full grid-rows-[1.5fr_auto] overflow-hidden rounded-[1.9rem] bg-[#f9f3eb]">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,#fff3e0,transparent_60%),radial-gradient(circle_at_80%_0,#e8d1b7,transparent_55%),radial-gradient(circle_at_50%_100%,#d1b89a,transparent_55%)]" />
                    <div className="relative flex h-full flex-col justify-end p-6 sm:p-7">
                      <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#8a7157]/80">
                        Blondage by Candice
                      </p>
                      <p className="mt-3 max-w-xs text-sm text-[#58422f]">
                        Soft, seamless blondes, low-maintenance colour, and
                        tailored cuts — all in a space that feels like a calm,
                        warm afternoon.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/70 bg-white/80 px-5 py-4">
                    <div className="flex items-center justify-between gap-4 text-xs text-[#7b634c]">
                      <div>
                        <p className="font-semibold text-[#3c2617]">
                          Perfect for:
                        </p>
                        <p>Blonding · Balayage · Lived-in colour</p>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <p className="text-[0.65rem] uppercase tracking-[0.24em] text-[#b29578]">
                          Home-based studio
                        </p>
                        <p className="mt-1 rounded-full bg-[#f0e0cf] px-3 py-1 text-[0.65rem] font-medium text-[#3c2617]">
                          One-on-one appointments only
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-y border-black/5 bg-[#f6ede3]/70">
        <div className={`${SECTION_CLASSES} py-12 sm:py-14 lg:py-16`}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a48663]">
                Meet Candice
              </h2>
              <p className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Thoughtful hair, tailored to how you actually live in it.
              </p>
              <p className="max-w-xl text-sm sm:text-base text-[#6f5a45]">
                Candice believes great hair should feel effortless — soft,
                dimensional colour that grows out beautifully, with cuts that
                work with your natural texture. In a private, home-based space,
                each appointment is calm, unhurried, and completely
                one-on-one.
              </p>
              <p className="max-w-xl text-sm sm:text-base text-[#6f5a45]">
                Whether you&apos;re maintaining your signature blonde, easing
                into lighter tones, or refreshing your cut, you&apos;ll leave
                with hair that fits your lifestyle and feels like you.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b29578]">
                    Specialties
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-[#5a4632]">
                    <li>• Lived-in blondes &amp; balayage</li>
                    <li>• Soft, dimensional colour</li>
                    <li>• Glossing &amp; toning services</li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-[#2f2318] p-4 text-[#f7f1e9] shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#cab69c]">
                    Experience
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#f3e3d0]">
                    Candice has worked with a range of blonde clients and hair
                    types, with a focus on keeping the hair as healthy as it is
                    beautiful.
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#8a7157]">
                New clients are welcome. Share a little about your hair in the
                enquiry form below and Candice will recommend the best service
                for your first visit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services">
        <div className={`${SECTION_CLASSES} py-14 sm:py-16 lg:py-18`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a48663]">
                Services
              </h2>
              <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Designed for soft blondes &amp; easy maintenance.
              </p>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-[#7c6750]">
              Every appointment is personalised. After you submit an enquiry,
              Candice will confirm the best service and timing for your hair.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="flex flex-col justify-between rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-black/5">
              <div className="space-y-2.5">
                <h3 className="text-sm font-semibold text-[#3c2617]">
                  Blonding &amp; Balayage
                </h3>
                <p className="text-xs text-[#7c6750]">
                  For brightening your overall look or refreshing an existing
                  blonde with soft, seamless blends.
                </p>
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-[#b29578]">
                Ideal every 8–12 weeks
              </p>
            </article>

            <article className="flex flex-col justify-between rounded-2xl bg-[#2f2318] p-5 text-[#f7f1e9] shadow-sm">
              <div className="space-y-2.5">
                <h3 className="text-sm font-semibold">Colour &amp; Toner</h3>
                <p className="text-xs text-[#f1dfcb]">
                  Perfect for refreshing tone, adding gloss, or shifting your
                  shade slightly warmer or cooler.
                </p>
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-[#cab69c]">
                Ideal every 4–8 weeks
              </p>
            </article>

            <article className="flex flex-col justify-between rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-black/5">
              <div className="space-y-2.5">
                <h3 className="text-sm font-semibold text-[#3c2617]">
                  Cut, Style &amp; Treatment
                </h3>
                <p className="text-xs text-[#7c6750]">
                  Shape-refreshing cuts, blow-dries and nourishing in-salon
                  treatments to keep your blonde feeling soft and healthy.
                </p>
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-[#b29578]">
                Customised to your hair
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Gallery / vibes */}
      <section className="border-y border-black/5 bg-[#f2e7db]">
        <div className={`${SECTION_CLASSES} py-12 sm:py-14 lg:py-16`}>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a48663]">
                The vibe
              </h2>
              <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Soft light, warm tones, and space to exhale.
              </p>
              <p className="max-w-md text-sm sm:text-base text-[#6f5a45]">
                The studio is intentionally small and calm — think soft music,
                warm neutrals, and a cosy chair you won&apos;t want to leave.
              </p>
              <p className="max-w-md text-sm sm:text-base text-[#6f5a45]">
                It&apos;s a space designed for you to slow down while your hair
                is taken care of.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="col-span-2 rounded-3xl bg-[radial-gradient(circle_at_0_0,#fff5e8,transparent_60%),radial-gradient(circle_at_100%_100%,#d9bda0,transparent_55%)] p-4 shadow-md ring-1 ring-black/5">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b29578]">
                  For the blondes
                </p>
                <p className="mt-2 text-sm text-[#4a3726]">
                  From bright, creamy blondes to soft, sandy tones — the focus
                  is always on keeping the hair healthy and touchable.
                </p>
              </div>
              <div className="flex flex-col justify-between rounded-3xl bg-[#2f2318] p-4 text-[#f7f1e9] shadow-md">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#cab69c]">
                  Little details
                </p>
                <p className="mt-2 text-xs text-[#f1dfcb]">
                  Refreshments, curated haircare recommendations, and a
                  one-on-one experience every time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="bg-[#f7f1e9] pb-14 pt-14 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-18"
      >
        <div className={`${SECTION_CLASSES} space-y-8`}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a48663]">
                Enquiries
              </h2>
              <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready for hair that feels like you?
              </p>
              <p className="max-w-md text-sm sm:text-base text-[#6f5a45]">
                Share a little about your current hair, goals, and ideal days or
                times. Candice will be in touch via your preferred contact
                method to confirm details and suggest the best first visit.
              </p>

              <div className="space-y-3 rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-black/5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b29578]">
                  Prefer social?
                </p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <a
                    href="https://m.me/blondagebycandice"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#cab69c]/70 bg-[#f9f3eb] px-4 py-2 font-medium text-[#3c2617] transition hover:bg-[#f1e3d4]"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#cab69c]" />
                    Facebook Messenger
                  </a>
                  <a
                    href="https://www.instagram.com/blondagebycandice"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#cab69c]/70 bg-[#f9f3eb] px-4 py-2 font-medium text-[#3c2617] transition hover:bg-[#f1e3d4]"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#cab69c]" />
                    Instagram · @blondagebycandice
                  </a>
                </div>
                <p className="text-[0.7rem] text-[#8a7157]">
                  Candice manages all messages personally — there is no online
                  booking system.
                </p>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
