<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Keep homepage scroll choreography in ScrollShowcase, with passive frame-scheduled scroll listeners and a non-pinned reduced-motion mode, so the collection remains accessible without animation libraries or scroll hijacking.
- Keep below-hero motion in the useHomeChoreography hook exported by ScrollShowcase, scoped to the homepage and reset when motion preferences change, so other pages and accessible static content remain unaffected.
