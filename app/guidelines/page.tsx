import PageShell from "../components/PageShell";
import FadeIn from "../components/FadeIn";

export default function Guidelines() {
  return (
    <PageShell>
      <div className="max-w-2xl mx-auto px-8 space-y-12">
        <FadeIn className="space-y-2">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--muted)]">
            Before you write
          </p>
          <h1 className="font-display text-4xl md:text-5xl">
            Community Guidelines
          </h1>
        </FadeIn>

        <FadeIn className="font-body text-base leading-relaxed text-[var(--muted)] space-y-4">
          <p>
            This space exists for honest, personal writing. A few ground rules
            keep it a place worth writing in.
          </p>
        </FadeIn>

        <FadeIn className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl text-[var(--ember)]">
              Welcome here
            </h2>
            <ul className="font-body text-[var(--paper)] space-y-2 list-disc list-inside">
              <li>Personal essays, reflections, poetry, fiction, rants</li>
              <li>Any topic you're passionate about under any category</li>
              <li>
                Disagreement, criticism, and difficult opinions, argued in good
                faith
              </li>
              <li>Vulnerability. Say the thing you'd normally delete.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl text-[var(--ember)]">
              Not welcome here
            </h2>
            <ul className="font-body text-[var(--paper)] space-y-2 list-disc list-inside">
              <li>
                Harassment, hate speech, or content targeting someone's identity
              </li>
              <li>
                Doxxing or sharing someone's private information without consent
              </li>
              <li>Spam, advertising, or link-dropping unrelated to the post</li>
              <li>Plagiarized writing presented as your own</li>
              <li>AI generated writing</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl text-[var(--ember)]">
              Moderation
            </h2>
            <p className="font-body text-[var(--muted)] leading-relaxed">
              Posts and comments violating these guidelines may be removed by an
              admin without notice. Repeated violations may result in account
              restrictions.
            </p>
          </div>
        </FadeIn>
      </div>
    </PageShell>
  );
}
