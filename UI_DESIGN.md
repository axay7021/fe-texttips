# Writing desk interface

Design guidance: UI UX Pro Max (nextlevelbuilder/ui-ux-pro-max-skill), reviewed 30 October 2026.

Direction: a calm writing workspace with warm paper, forest green, editorial serif headlines and the existing Space Grotesk for controls. The skill's productivity/flat-design recommendation informed the simple borders and restrained interaction. No invented testimonials or usage claims are displayed.

The landing editor retains the existing /api/enhance streaming integration and 100-character guest draft limit. Six tone controls select the corresponding real parsed result. Draft examples fill input only; they do not simulate model output. Empty/error/loading states are explicit, drafts survive failures, and copy failures produce feedback. Existing signed-in dashboard routing is retained. Only a configuration-ready boolean crosses the server/client boundary; secret values never do.

Checks: TypeScript, scoped Biome checks, desktop/mobile visual review, 375/768/1024/1440 widths, tone/example selection, clear, expected AI-not-configured feedback, and reduced motion. Live rewriting requires AI and database configuration.
