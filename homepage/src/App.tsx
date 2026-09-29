import type { ReactNode } from 'react';
import { homepageContent, homepageSectionOrder } from './homepage-content.mjs';

const INLINE_FILE_PATTERN = /[A-Za-z0-9_][A-Za-z0-9_./-]*\.md\b/g;

function renderWithInlineCode(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  INLINE_FILE_PATTERN.lastIndex = 0;

  for (let match = INLINE_FILE_PATTERN.exec(text); match !== null; match = INLINE_FILE_PATTERN.exec(text)) {
    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index));
    }

    parts.push(<code key={'inline-' + key}>{match[0]}</code>);
    key += 1;
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

type Action = { label: string; href: string; external?: boolean };

function ActionButton({ action, variant }: { action: Action; variant: 'primary' | 'secondary' }) {
  const { label, href, external } = action;

  return (
    <a
      className={'button ' + variant}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      {label}
    </a>
  );
}

export default function App() {
  const sectionContent = {
    hero: (
      <header key="hero" className="hero shell" aria-labelledby={homepageContent.hero.headingId}>
        <div className="hero-grid">
          <div className="hero-intro">
            <div className="eyebrow">
              <span className="pulse" aria-hidden="true"></span>
              {homepageContent.hero.eyebrow}
            </div>
            <h1 id={homepageContent.hero.headingId}>{homepageContent.hero.headline}</h1>
            <p className="hero-copy">{homepageContent.hero.lede}</p>
            <div className="hero-actions" aria-label="Primary actions">
              {homepageContent.hero.actions.map((action) => (
                <ActionButton
                  key={action.label}
                  action={action}
                  variant={action.variant === 'primary' ? 'primary' : 'secondary'}
                />
              ))}
            </div>
          </div>

          <aside className="product-card" aria-label="WayFold proof surface">
            <div className="trio-card" aria-label="The three durable task files">
              <div className="trio-head">
                <span className="trio-title">{homepageContent.hero.trio.title}</span>
                <span className="trio-caption">{homepageContent.hero.trio.caption}</span>
              </div>
              <ul className="file-list">
                {homepageContent.hero.trio.files.map((file) => (
                  <li className="file-row" key={file.name}>
                    <code className="file-name">{file.name}</code>
                    <span className="file-role">{file.role}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="terminal">
              <div className="terminal-top">
                <div className="dots" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span>{homepageContent.hero.terminal.title}</span>
              </div>
              <div className="terminal-body">
                {homepageContent.hero.terminal.lines.map((line, index) => {
                  if (line.tone === 'break') {
                    return <br key={'break-' + index} />;
                  }

                  const text = String(line.text ?? '');
                  const prefix = typeof line.prefix === 'string' ? line.prefix : '';
                  const showPrefix = prefix.length > 0 && !text.startsWith(prefix);

                  return (
                    <div key={text + '-' + index} className={line.tone}>
                      {showPrefix ? <span className="cmd">{prefix}</span> : null}
                      {showPrefix ? ' ' : null}
                      {text}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="route-card">
              <div className="route-title">
                {homepageContent.hero.route.title}
                <span className="pill">{homepageContent.hero.route.badge}</span>
              </div>
              <ol className="flow">
                {homepageContent.hero.route.steps.map((step) => (
                  <li className="flow-step" key={step.number}>
                    <span className="num" aria-hidden="true">
                      {step.number}
                    </span>
                    <div className="flow-text">
                      <strong>{step.title}</strong>
                      <span>{renderWithInlineCode(step.body)}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>

        <dl className="hero-facts">
          {homepageContent.hero.facts.map((fact) => (
            <div className="fact" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </header>
    ),
    problem: (
      <section key="problem" id={homepageContent.problem.id} className="shell" aria-labelledby="problem-title">
        <div className="section-head">
          <span className="kicker">{homepageContent.problem.kicker}</span>
          <h2 id="problem-title">{homepageContent.problem.title}</h2>
          <p>{homepageContent.problem.body}</p>
        </div>
        <div className="boundary-grid">
          <article className="authority-card">
            <h3>{homepageContent.problem.authority.title}</h3>
            <p>{renderWithInlineCode(homepageContent.problem.authority.body)}</p>
            <ul className="file-list file-list--dark">
              {homepageContent.problem.authority.files.map((file) => (
                <li className="file-row" key={file.name}>
                  <code className="file-name">{file.name}</code>
                  <span className="file-role">{file.role}</span>
                </li>
              ))}
            </ul>
          </article>
          <div className="boundary-list">
            {homepageContent.problem.boundaries.map((boundary) => (
              <article className="boundary" key={boundary.title}>
                <span className="icon" aria-hidden="true">
                  {boundary.icon}
                </span>
                <h3>{boundary.title}</h3>
                <p>{renderWithInlineCode(boundary.body)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    ),
    skills: (
      <section key="skills" id={homepageContent.skills.id} className="shell" aria-labelledby="skills-title">
        <div className="section-head">
          <span className="kicker">{homepageContent.skills.kicker}</span>
          <h2 id="skills-title">{homepageContent.skills.title}</h2>
          <p>{homepageContent.skills.body}</p>
        </div>
        <div className="skill-grid">
          {homepageContent.skills.entries.map((entry) => (
            <article className="skill-card" key={entry.name}>
              <code className="skill-name">{entry.name}</code>
              <h3>{entry.role}</h3>
              <p>{renderWithInlineCode(entry.body)}</p>
            </article>
          ))}
        </div>
        <div className="skill-boundary">
          <h3>{homepageContent.skills.layersTitle}</h3>
          <ol className="layer-stack">
            {homepageContent.skills.layers.map((layer) => (
              <li className="layer-row" key={layer.name}>
                <div className="layer-head">
                  <strong>{layer.name}</strong>
                  <span className="layer-role">{layer.role}</span>
                </div>
                <p>{renderWithInlineCode(layer.body)}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="route-strip">
          <div className="route-strip-head">
            <h3>{homepageContent.skills.routesTitle}</h3>
            <p>{renderWithInlineCode(homepageContent.skills.routesNote)}</p>
          </div>
          <ul className="lane-list">
            {homepageContent.skills.routes.map((route) => (
              <li className="lane" key={route.name}>
                <code>{route.name}</code>
                <span>{renderWithInlineCode(route.body)}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="section-note">{renderWithInlineCode(homepageContent.skills.note)}</p>
      </section>
    ),
    hooks: (
      <section key="hooks" id={homepageContent.hooks.id} className="shell" aria-labelledby="hooks-title">
        <div className="section-head">
          <span className="kicker">{homepageContent.hooks.kicker}</span>
          <h2 id="hooks-title">{homepageContent.hooks.title}</h2>
          <p>{homepageContent.hooks.body}</p>
        </div>
        <div className="hook-grid">
          {homepageContent.hooks.steps.map((step) => (
            <article className="hook-step" key={step.event}>
              <span className="hook-event">{step.event}</span>
              <p>{renderWithInlineCode(step.body)}</p>
            </article>
          ))}
        </div>
        <div className="hook-foot">
          <article className="hook-receipt">
            <h3>{homepageContent.hooks.receipts.title}</h3>
            <p>{renderWithInlineCode(homepageContent.hooks.receipts.body)}</p>
          </article>
          <div className="code-block hook-command">
            <span className="command-label">{homepageContent.hooks.command.label}</span>
            <code>{homepageContent.hooks.command.text}</code>
          </div>
        </div>
        <p className="section-note">{renderWithInlineCode(homepageContent.hooks.note)}</p>
      </section>
    ),
    proof: (
      <section key="proof" id={homepageContent.proof.id} className="shell" aria-labelledby="proof-title">
        <div className="section-head">
          <span className="kicker">{homepageContent.proof.kicker}</span>
          <h2 id="proof-title">{homepageContent.proof.title}</h2>
        </div>
        <div className="split">
          {homepageContent.proof.tracks.map((track) => (
            <article className="feature-card" key={track.title}>
              <h3>{track.title}</h3>
              <p>{renderWithInlineCode(track.body)}</p>
              <div className="matrix">
                {track.rows.map((row, rowIndex) => (
                  <div className="matrix-row" key={track.title + '-' + rowIndex}>
                    {row.map((cell) => (
                      <div className="matrix-cell" key={cell.title}>
                        <strong>{cell.title}</strong>
                        <span>{renderWithInlineCode(cell.body)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="evidence-band">
          <div>
            <h3>{homepageContent.proof.evidence.title}</h3>
            <p>{renderWithInlineCode(homepageContent.proof.evidence.body)}</p>
          </div>
          <ul className="evidence-items">
            {homepageContent.proof.evidence.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    ),
    start: (
      <section key="start" id={homepageContent.start.id} className="shell" aria-labelledby="start-title">
        <div className="split">
          <div className="section-head">
            <span className="kicker">{homepageContent.start.kicker}</span>
            <h2 id="start-title">{homepageContent.start.title}</h2>
            <p>{homepageContent.start.body}</p>
            <div className="doc-links">
              {homepageContent.start.docs.map((doc) => (
                <a
                  key={doc.label}
                  href={doc.href}
                  target={doc.external ? '_blank' : undefined}
                  rel={doc.external ? 'noreferrer' : undefined}
                >
                  {doc.label}
                </a>
              ))}
            </div>
          </div>
          <div className="install-card">
            <h3>{homepageContent.start.checksTitle}</h3>
            <p>{renderWithInlineCode(homepageContent.start.checksBody)}</p>
            <ol className="code-block" id="cli-proof" aria-label="Candidate commands">
              {homepageContent.start.commands.map((command) => (
                <li className="command" key={command}>
                  <span className="command-prompt" aria-hidden="true">
                    $
                  </span>
                  <code>{command}</code>
                </li>
              ))}
            </ol>
            <div className="skill-block">
              <span className="command-label">{homepageContent.start.skillsLabel}</span>
              <ul>
                {homepageContent.start.skills.map((skill) => (
                  <li key={skill}>
                    <code>{skill}</code>
                  </li>
                ))}
              </ul>
            </div>
            <p className="trust-note">{homepageContent.start.trustNote}</p>
          </div>
        </div>
        <div className="cta">
          <div>
            <h2>{homepageContent.start.cta.title}</h2>
            <p>{renderWithInlineCode(homepageContent.start.cta.body)}</p>
          </div>
          <div className="cta-actions">
            <ActionButton action={homepageContent.start.cta.action} variant="primary" />
            <ActionButton action={homepageContent.start.cta.secondaryAction} variant="secondary" />
          </div>
        </div>
      </section>
    )
  };

  return (
    <>
      <a className="skip-link" href="#top">
        Skip to content
      </a>

      <nav className="nav shell" aria-label="Main navigation">
        <a className="brand" href={homepageContent.topbar.brandHref} aria-label="WayFold Harness home">
          <span className="mark" aria-hidden="true">
            WFH
          </span>
          <span>{homepageContent.topbar.brandLabel}</span>
        </a>
        <div className="nav-links">
          {homepageContent.topbar.links.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
          <a
            href={homepageContent.topbar.docs.href}
            target={homepageContent.topbar.docs.external ? '_blank' : undefined}
            rel={homepageContent.topbar.docs.external ? 'noreferrer' : undefined}
          >
            {homepageContent.topbar.docs.label}
          </a>
        </div>
        <div className="nav-actions">
          <a
            className="button primary"
            href={homepageContent.topbar.cta.href}
            target={homepageContent.topbar.cta.external ? '_blank' : undefined}
            rel={homepageContent.topbar.cta.external ? 'noreferrer' : undefined}
          >
            {homepageContent.topbar.cta.label}
          </a>
        </div>
      </nav>

      <main id="top" tabIndex={-1}>
        {homepageSectionOrder.map((sectionKey) => sectionContent[sectionKey as keyof typeof sectionContent])}
      </main>

      <footer className="shell">
        <div className="footer-row">
          <span>{homepageContent.footer.left}</span>
          <div className="footer-links">
            <span>{homepageContent.footer.right}</span>
            {homepageContent.footer.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
