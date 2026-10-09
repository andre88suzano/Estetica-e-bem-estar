# Design Engineering Standards

Use these instructions for every visual change in this repository. Apply them to other projects when the user asks; for a different repository, copy and adapt this file instead of assuming these rules are already in scope.

## Before implementation

1. Read the existing application structure, local project instructions, and relevant components before changing code.
2. Identify the business, audience, primary action, verified content, and any facts or assets that are missing.
3. Write a short visual direction for substantial interfaces: brand character, composition, information hierarchy, color, type, image treatment, and motion.
4. Choose section compositions to serve their content. Avoid repeating grids, cards, backgrounds, and spacing patterns by default.
5. Preserve working behavior and useful architecture. Do not rebuild a project when a focused change will do.

## Visual quality

- Give every section a clear focal point, supporting information, and useful next action.
- Prefer editorial composition, considered negative space, asymmetry, and typographic contrast where they suit the brand.
- Avoid generic AI page patterns: repeated card grids, decorative icons without purpose, excess rounded surfaces or shadows, filler sections, invented statistics, vague marketing claims, and ornamental gradients.
- Maintain a small set of design tokens for color, typography, spacing, content width, breakpoints, borders, and interaction timing. Keep contrast and focus states legible.
- Treat each visual element as purposeful. Remove details that compete with the message.

## Photography and other assets

- Prefer relevant, authorized real assets supplied in the repository or by the user. Preserve the identity of real people.
- Do not fabricate people, clients, testimonials, results, workplaces, credentials, or business history. Never use stock imagery as evidence of the business's work.
- If a required image is unavailable locally, continue with an honest, restrained composition and document the missing asset. Do not present a decorative placeholder as a real photo.
- Optimize images for responsive delivery and reserve their layout dimensions to prevent layout shifts.

## Motion and interaction

- Give motion a purpose: focus, feedback, spatial explanation, or gentle environmental depth.
- Use a consistent timing scale, short interaction transitions, and restrained environmental movement. Never make animation a prerequisite for understanding or interaction.
- Respect `prefers-reduced-motion`, preserve native scrolling, and keep mobile performance in mind.
- Prefer CSS for simple effects; add a dependency only when it provides a concrete benefit.
- Ensure menus and controls expose their state, work by keyboard, and have visible focus styles.

## Visual review workflow

For substantial visual work:

1. Inspect the running page in a browser, including the first viewport and the full page.
2. Review desktop and mobile layouts, section rhythm, responsive image crops, text wrapping, focus, and interactive states.
3. Record the main visual weaknesses before adjusting the implementation.
4. Reinspect after the corrections. A successful build alone is not visual approval.
5. If browser inspection is unavailable, say so and report only the checks that were actually run.

Before declaring a visual project complete, score direction, composition, typography, assets, design-system consistency, motion, responsiveness, accessibility, performance, and commercial clarity from 0–10. Scores below 8 for direction, composition, typography, assets, or motion require another improvement pass when the issue can be addressed with available material. Scores are a review aid, not a guarantee.

## Penha Andreia project facts

- Brand: Penha Andreia — Estética & Bem-Estar. Home visits in Grande Vitória, Espírito Santo.
- Verified brief: more than 30 years in aesthetics; professional experience at Anna Pegova in São Paulo; degrees in Estética and Biomedicina; postgraduate study in progress.
- Do not describe Penha as a doctor. Do not add unsupported institutions, completed specialties, awards, outcomes, or operating hours.
- The postoperative section must be careful, individual, within scope, and defer to the responsible medical team. Do not imply every resource is indicated for every patient.
- The current requested service list excludes Massagem Modeladora. Keep it out of the site and its contact CTAs.
- Use WhatsApp and Instagram details only from the existing verified project configuration; confirm their current validity before publication.
- No portrait or gallery image is checked into this repository. Do not synthesize a portrait. Keep the page honest until an authorized real image is added.
- Treat reviews and testimonials as unpublished unless real, authorized source material is available.
