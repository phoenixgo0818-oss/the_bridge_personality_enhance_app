/**
 * Landing page: solid olive green background, title box 100% width × 150px.
 */
export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#4f574d]">
      <div
        className="flex h-[150px] w-full items-center justify-center gap-4 bg-[#4f574d]/80 px-4"
        role="banner"
        aria-label="Site title"
      >
        <img src="/favicon.svg" alt="" className="h-[60px] w-[60px] shrink-0" />
        <h1 className="text-4xl font-medium text-white md:text-5xl" style={{ fontFamily: "'Caveat', cursive" }}>
          ᑌᑭᕼᑌᗰᗩᑎ
        </h1>
      </div>
      {/* Add your content here */}
    </div>
  )
}
