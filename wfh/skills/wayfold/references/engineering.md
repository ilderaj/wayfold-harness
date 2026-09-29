# Engineering checks

Freeze the relevant diff/ref and inspect the actual code before reviewing. Distinguish project Standards (established rules) from Spec (required behavior) and proposals. Reproduce a reported failure where practical; distinguish observed cause from a hypothesis. Match project terminology and public interfaces. Prefer the smallest change that satisfies the goal; preserve unrelated dirty work.

Test externally observable behavior and meaningful failure cases. Do not add implementation-mirroring tests or elaborate frameworks to a reversible trivial edit. Use an independently installed test-first/debugging/review method when specifically needed. Run required project checks, then broaden only for new changes or unresolved risk. Report commands, outcomes, and remaining limitations. A review finding needs a concrete trigger, impact, and source location.
