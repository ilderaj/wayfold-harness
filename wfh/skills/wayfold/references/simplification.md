# Read-only simplification review

Select the requested mode explicitly:

1. Propose simplification: identify redundant state, indirection, ceremony, and maintenance. For each proposed removal record its consumer, smallest replacement, preserved behavior, verification, and rollback. Do not remove a guard merely because it is verbose.
2. Inventory existing simplification limits: find the current ceiling, known tradeoffs, evidence, and the trigger/conditions for upgrading it. Read historical markers as evidence. Missing triggers are unknown; do not invent a decision or misrepresent an inventory as a new recommendation.

Keep the result a short task artifact or findings section. Do not create a mandatory ledger, second authority, or automatic mutation. Apply changes only within the user's authorized scope.
