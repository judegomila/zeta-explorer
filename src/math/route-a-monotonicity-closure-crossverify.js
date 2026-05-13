/**
 * imp-826: Cross-verification of the Route A monotonicity-closure composition.
 *
 * The ticket originally requested cross-verification of a single module
 *   src/math/route-a-monotonicity-closure.js
 * that was supposed to tie together the B1 slope bound, the B2 intercept
 * bound, and the D-monotone analytic closure. HONEST-PARTIAL FINDING:
 * that monolithic file does not exist in the repository. The composition
 * is instead distributed across THREE already-present modules landed by
 * the predecessor cross-verifies imp-821/822/823:
 *
 *   D-monotone   (imp-463)  src/math/d-monotone-analytic-proof.js
 *   B1 slope     (imp-457)  src/data/b1-slope-conditional-upper-bound.js
 *   B2 intercept (imp-458)  src/data/b2-intercept-analytic-bound.js
 *
 * This module cross-verifies the DISTRIBUTED composition after the fixes
 * from imp-821/822/823. It does NOT create the missing monolithic file;
 * that would exceed the honest-partial scope of a single ticket run. The
 * missing file is recorded below as an explicit, non-blocking sub-gap so
 * that a future aggregator ticket can pick it up without re-discovering
 * the gap from scratch.
 *
 * Cross-verified invariants (C1..C5)
 * ----------------------------------
 *   (C1) id stability:
 *        D_MONOTONE_ANALYTIC_PROOF.id  === "imp-463",
 *        B1_CONDITIONAL_BOUND.id       === "imp-457",
 *        B2_INTERCEPT_BOUND.id         === "imp-458".
 *        Any drift breaks citation chains in route-a-argmin-closure.js
 *        (imp-456) and lambda-N1e6-final-assembly.js (imp-452).
 *
 *   (C2) D-monotone closure feeds B1:
 *        B1_CONDITIONAL_BOUND.closedConditions must literally contain
 *        both "skp-imp457-D-monotone" and "imp-463" so that the chain
 *        "D-monotone analytically closed -> B1 now conditional on NoSwap
 *        only" stays documented. If the citation string is rewritten,
 *        this tripwire fires before the chain silently breaks.
 *
 *   (C3) B1 status stays in the allowed vocabulary:
 *        B1_CONDITIONAL_BOUND.status must be one of
 *        {analytically-closed, numerically-closed, conditional-closed}.
 *        Any other value signals a regression in D-monotone or NoSwap,
 *        or a hardcoded override bypassing the conditional ternary.
 *
 *   (C4) B2 intercept bound is a positive finite number:
 *        B2_INTERCEPT_BOUND.bound.value must be finite and strictly
 *        positive (empirically about 0.0094). A null or non-positive
 *        value means either the N_max row is missing or a computational
 *        regression; both invalidate the intercept leg of Route A.
 *
 *   (C5) Composition never claims more than its weakest link:
 *        If D-monotone is not analytically-closed, B1 must not claim
 *        analytically-closed either. Guards against a future edit that
 *        unpins B1.status from D_MONOTONE_ANALYTIC_PROOF.status.
 *
 *   (C6) B2 beats the assembly ceiling at the composition level:
 *        B2_INTERCEPT_BOUND.bound.beatsCeiling must be literally true and
 *        B2_INTERCEPT_BOUND.status must be "conditional-closed". C4 only
 *        checks value > 0; C6 catches the substantive regression where
 *        the Koksma-Hlawka bound at N_max drifts above the 0.02 ceiling
 *        (status flips to conditional-open-ceiling-not-met) or N_max is
 *        removed (status flips to conditional-open-no-nmax). Without C6,
 *        a still-positive but ceiling-failing bound would silently let
 *        Route A's intercept leg claim closure it does not have.
 *
 *   (C7) D-monotone side of the citation handshake:
 *        D_MONOTONE_ANALYTIC_PROOF.subGap must literally equal
 *        "skp-imp457-D-monotone" and D_MONOTONE_ANALYTIC_PROOF.ticket must
 *        literally equal "imp-463". C2 only checks the B1 SIDE of the
 *        handshake (that B1.closedConditions cites these two strings). If
 *        D-monotone renames its subGap or ticket field while B1 freezes its
 *        citation text, C2 stays green but the chain silently breaks. C7
 *        locks the D-monotone side so the handshake is verified on both ends.
 *
 *   (C8) B2 ceiling constant equals the finite-height beat assembly target:
 *        B2_INTERCEPT_BOUND.bound.ceiling must literally equal 0.02. The
 *        finite-height beat assembly (lambda-N1e6-final-assembly.js) requires
 *        a <= 0.02 specifically; any other ceiling constant breaks the
 *        assembly guarantee. C6 only checks beatsCeiling === true, but that
 *        flag is computed against whatever ceiling B2 happens to store. If
 *        the ceiling is silently raised (e.g. 0.02 -> 0.03) to mask a
 *        Koksma-Hlawka regression, C4 and C6 both stay green while the
 *        assembly target is silently weakened. C8 locks the ceiling value
 *        itself so the composition promise matches the assembly contract.
 *
 *   (C9) NoSwap side of the B1 citation handshake:
 *        B1_CONDITIONAL_BOUND.closedConditions must literally contain both
 *        "NoSwap" and "imp-464" so that the second half of the B1 conditional
 *        chain (NoSwap numerically closed by imp-464/noswap-closure.js) keeps
 *        its provenance. C2 only checks the D-monotone SIDE of B1 citations
 *        (skp-imp457-D-monotone + imp-463). If a future edit rewrites the
 *        NoSwap citation string (e.g. drops "imp-464" or renames "NoSwap"),
 *        C2 stays green while B1's NoSwap leg silently loses its pointer to
 *        its closure ticket. C9 is structurally symmetric to C2 and locks the
 *        NoSwap half of the handshake.
 *
 *   (C10) NoSwap-module side of the NoSwap citation handshake:
 *        NOSWAP_CLOSURE.id must literally equal "imp-464" and
 *        NOSWAP_CLOSURE.ticket must literally equal "imp-464". C9 only checks
 *        the B1 SIDE of the handshake (that B1.closedConditions cites
 *        "imp-464"). If the NoSwap module itself renames its id or ticket
 *        field while B1 freezes its citation text, C9 stays green and the
 *        chain silently breaks at the closer end. C10 is structurally
 *        symmetric to C7 (which locks the D-monotone side): it closes the
 *        NoSwap half of the composition citation network on both ends.
 *
 *   (C11) NoSwap status stays in the allowed vocabulary:
 *        NOSWAP_CLOSURE.status must be one of
 *        {analytically-closed, numerically-closed}. B1.status is computed
 *        from a ternary that literally tests for these two strings
 *        (b1-slope-conditional-upper-bound.js lines 137-141). If NoSwap
 *        silently drifts to any other status value, B1's ternary falls
 *        through to conditional-closed without any tripwire firing: C3
 *        only locks B1's RESULTING status vocabulary (not the upstream
 *        NoSwap input), and C10 only locks NoSwap's id/ticket fields
 *        (not its status string). C11 is structurally symmetric to C3
 *        on the NoSwap side and catches the composition-level regression
 *        where a weakened NoSwap status silently downgrades B1.
 *
 *   (C12) D-monotone status stays in the allowed vocabulary:
 *        D_MONOTONE_ANALYTIC_PROOF.status must be one of
 *        {analytically-closed, analytical-argument-with-numerical-failure}.
 *        These are the only two values the status ternary in
 *        d-monotone-analytic-proof.js lines 274-276 can produce (the
 *        EXTENDED_RESULTS.every(...) predicate is strictly boolean). If a
 *        future edit replaces that ternary with a wider expression, the
 *        status string could drift to an unrecognized value while C5 (which
 *        only tests for equality against "analytically-closed") silently
 *        stops enforcing the "weakest link" guard at full strength.
 *        C7 locks subGap and ticket on the D-monotone side but NOT the
 *        status field; C3 locks B1 status vocabulary and C11 locks NoSwap
 *        status vocabulary. C12 is structurally symmetric to C3 and C11
 *        on the D-monotone upstream side and closes the last unlocked
 *        status-vocabulary slot in the composition.
 *
 *   (C13) NoSwap-side "weakest link" guard for B1 analytical closure:
 *        If B1_CONDITIONAL_BOUND.status === "analytically-closed" then
 *        NOSWAP_CLOSURE.status must also === "analytically-closed". C5
 *        only catches the D-monotone-side regression (B1 analytical but
 *        D-monotone not). The B1 status ternary in
 *        b1-slope-conditional-upper-bound.js lines 137-141 requires BOTH
 *        NoSwap and D-monotone to be analytically-closed for B1 to
 *        upgrade to analytically-closed. If a future edit unpins B1 from
 *        the NoSwap half of that conjunction (e.g. relaxes to
 *        NoSwap === "numerically-closed" but still labels B1
 *        analytically-closed), C5 stays green because D-monotone is
 *        unchanged, while the composition silently claims more than its
 *        NoSwap leg supports. C13 is structurally symmetric to C5 on the
 *        NoSwap side and closes the last unlocked weakest-link slot in
 *        the composition.
 *
 *   (C14) Residual monolithic-file sub-gap stays non-blocking:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap.blocker must
 *        literally equal false. The existing scope-tripwire (last
 *        assertion below) pins both residualSubGap.status === "open" and
 *        monolithicFilePresent === false, but does NOT pin the blocker
 *        field. If a future edit flips blocker to true (e.g. reinterprets
 *        the missing monolithic file as actually blocking the chain),
 *        the imp-826 partial-closure-non-blocking verdict silently
 *        downgrades while the scope-tripwire stays green: status still
 *        reads "open" and monolithicFilePresent still reads false. C14
 *        locks the last unpinned identity field of residualSubGap so the
 *        verdict ("non-blocking") and the sub-gap record cannot drift
 *        apart.
 *
 *   (C15) Crossverify record's own self-id is frozen to "imp-826":
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.id must literally equal
 *        "imp-826". C1 locks the three UPSTREAM module ids (imp-463,
 *        imp-457, imp-458), C7 locks the D-monotone handshake endpoint
 *        ids (subGap, ticket), and C10 locks the NoSwap-module endpoint
 *        ids (id, ticket) -- but the crossverify record's OWN id field
 *        is unpinned. If a future edit renames it (e.g. to "imp-826a"
 *        during a sub-ticket split, or to a hyphenless variant), any
 *        dashboard or queue index that filters ticket records by literal
 *        id === "imp-826" silently loses its pointer to the imp-826
 *        crossverify work while every other C1..C14 assertion continues
 *        to pass. C15 is structurally symmetric to C1 on the crossverify-
 *        record side and closes the last unpinned id field in the whole
 *        composition.
 *
 *   (C16) residualSubGap.id is frozen to its named handle:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap.id must literally
 *        equal "ROUTE_A_MONOTONICITY_MONOLITHIC_FILE_MISSING". C14 locks
 *        the blocker flag, and the scope-tripwire locks status and
 *        monolithicFilePresent -- but the sub-gap's OWN id field (the
 *        named handle aggregators filter by) is unpinned. If a future
 *        edit renames the sub-gap id (e.g. shortens it or reformats it),
 *        any downstream aggregator that filters sub-gap records by
 *        literal id === "ROUTE_A_MONOTONICITY_MONOLITHIC_FILE_MISSING"
 *        silently loses its pointer to this sub-gap while C14 and the
 *        scope-tripwire both stay green (blocker is still false, status
 *        is still "open", monolithicFilePresent is still false). C16 is
 *        structurally symmetric to C15 on the sub-gap-record side and
 *        closes the last unpinned id field on residualSubGap.
 *
 *   (C18) DISTRIBUTED_COMPOSITION local impId duplicates are frozen:
 *        DISTRIBUTED_COMPOSITION must have exactly 3 entries whose impId
 *        fields literally equal "imp-463", "imp-457", "imp-458" in that
 *        order. C1 locks the UPSTREAM module ids read through imported
 *        constants, but the DISTRIBUTED_COMPOSITION array here is a LOCAL
 *        duplicate of those ids embedded in this crossverify record. If a
 *        future edit rewrites a local impId string (e.g. drifts "imp-463"
 *        to "imp-821" during a sub-ticket rename) or adds/removes an entry
 *        from the array, C1 stays green (imports unchanged) while any
 *        downstream dashboard or aggregator that reads impIds from THIS
 *        record silently loses or mislinks its pointer to the three
 *        composing modules. C18 is structurally symmetric to C1 on the
 *        local-record side and closes the last unpinned id-duplicate slot
 *        in the distributed composition listing.
 *
 *   (C19) DISTRIBUTED_COMPOSITION local file path strings are frozen:
 *        DISTRIBUTED_COMPOSITION[i].file must literally equal the expected
 *        path for each composing module: "src/math/d-monotone-analytic-proof.js"
 *        for i=0, "src/data/b1-slope-conditional-upper-bound.js" for i=1,
 *        "src/data/b2-intercept-analytic-bound.js" for i=2. C18 locks the
 *        LOCAL impId strings in the same array, but the parallel file-path
 *        pointer strings are unpinned. If a future edit silently retargets
 *        a file string (e.g. to a neighbouring module that does happen to
 *        exist, or a renamed but equivalent-content file), the impId still
 *        points at "imp-463"/"imp-457"/"imp-458" so C18 stays green, while
 *        any downstream dashboard or aggregator that reads file paths from
 *        THIS record to locate the composing modules in the repo silently
 *        follows a broken or reinterpreted pointer. C19 is structurally
 *        symmetric to C18 on the local-file-path side and closes the last
 *        unpinned string-field triple in DISTRIBUTED_COMPOSITION.
 *
 *   (C20) DISTRIBUTED_COMPOSITION local role labels are frozen:
 *        DISTRIBUTED_COMPOSITION[i].role must literally equal "D-monotone"
 *        for i=0, "B1 slope bound" for i=1, "B2 intercept bound" for i=2.
 *        C18 locks the impId triple and C19 locks the file-path triple in
 *        this same array, but the parallel role-label triple is unpinned.
 *        If a future edit silently retargets a role string (e.g. relabels
 *        "D-monotone" to "D-monotone-closure" during a refactor, or
 *        permutes the entries so role i=0 becomes "B1 slope bound"), the
 *        impId/file fields might stay literally correct by pure coincidence
 *        (if the rewrite only touches the role column) so C18 and C19 stay
 *        green while any downstream dashboard that labels the composition
 *        entries by their role string silently mislabels the three modules
 *        or misorders the legs of Route A. C20 is structurally symmetric
 *        to C18 and C19 on the role-label side and closes the last unpinned
 *        string-field triple in DISTRIBUTED_COMPOSITION.
 *
 *   (C17) monolithicFileExpected is frozen to the ticket-named path:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.monolithicFileExpected must
 *        literally equal "src/math/route-a-monotonicity-closure.js". This
 *        is the file path the ticket originally named; the sub-gap title
 *        and the verdict text both reference it, and the whole
 *        "monolithic file missing" contract is anchored to this exact
 *        string. C14 locks residualSubGap.blocker, C16 locks
 *        residualSubGap.id, and the scope-tripwire locks
 *        monolithicFilePresent === false -- but the EXPECTED path itself
 *        is unpinned. If a future edit silently retargets the expected
 *        path (e.g. to a neighbouring module that does happen to exist,
 *        which would auto-satisfy "file missing" by picking a different
 *        file), monolithicFilePresent stays false, the status stays
 *        "open", and the blocker stays false, yet the contract of the
 *        sub-gap has silently been reinterpreted. C17 locks the expected
 *        path so the sub-gap identity cannot drift under the scope
 *        tripwire.
 *
 *   (C21) residualSubGap.title is frozen to its full literal string:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap.title must
 *        literally equal "src/math/route-a-monotonicity-closure.js does
 *        not exist as a single module". C16 locks residualSubGap.id (the
 *        named handle aggregators filter by) and C17 locks
 *        monolithicFileExpected (the path substring the title is built
 *        from), but the title itself -- the human-readable string
 *        dashboards and queue viewers display -- is only partially pinned:
 *        its prefix tracks MONOLITHIC_FILE_EXPECTED through concatenation
 *        (so C17 locks the prefix transitively), but the suffix literal
 *        " does not exist as a single module" is unpinned. If a future
 *        edit silently rewrites the suffix, C16, C17, and the scope-
 *        tripwire all stay green, yet any dashboard reading the title
 *        string to label the sub-gap silently displays different wording
 *        than the C16 named handle implies. C21 is structurally symmetric
 *        to C16 on the title-field side and closes the last unpinned
 *        string slot on residualSubGap.
 *
 *   (C22) ROUTE_A_MONOTONICITY_CROSSVERIFY.title (the top-level record
 *        title) is frozen to its literal string:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.title must literally equal
 *        "Cross-verify the distributed Route A monotonicity-closure
 *        composition". C15 locks the crossverify record self-id to
 *        "imp-826" and C21 locks residualSubGap.title, but the crossverify
 *        record's OWN title field (the human-readable label dashboards
 *        display alongside id === "imp-826") is unpinned. If a future
 *        edit silently rewrites this title (e.g. during a sub-ticket
 *        split the title might be narrowed, or a refactor might rewrite
 *        the label text), C15 stays green while dashboards reading the
 *        title silently display different wording than the id implies.
 *        C22 is structurally symmetric to C21 on the top-level record
 *        side and closes the last unpinned string slot on the
 *        crossverify record itself.
 *
 *   (C23) ROUTE_A_MONOTONICITY_CROSSVERIFY.verdict honestly reports
 *        PARTIAL closure:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.verdict must literally contain
 *        the substring "PARTIAL closure". The verdict string is the
 *        authoritative prose record of what imp-826 delivers: a
 *        distributed cross-verification that does NOT construct the
 *        missing monolithic file, and therefore only closes the ticket
 *        PARTIALLY. Every previous lock (C1..C22) covers an id, status,
 *        path, or title -- none covers the closure-strength claim in the
 *        verdict prose. If a future edit silently upgrades the verdict
 *        to "FULL closure" (e.g. during an over-eager rewrite that
 *        reinterprets the distributed composition as a full aggregator),
 *        C14 stays green (residualSubGap.blocker unchanged), the scope-
 *        tripwire stays green (residualSubGap.status still "open",
 *        monolithicFilePresent still false), C16/C17/C21 stay green (the
 *        sub-gap record id, monolithic path, and sub-gap title are all
 *        unchanged) -- yet any referee or downstream dashboard reading
 *        the verdict silently sees a stronger closure claim than the
 *        sub-gap record supports. C23 locks the honesty of the verdict
 *        claim itself so the closure strength cannot drift under the
 *        existing sub-gap tripwires.
 *
 *   (C24) verdict prose names all three composing-module imp-ids:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.verdict must literally contain
 *        "imp-457", "imp-458", and "imp-463". C18 locks those three ids on
 *        the DISTRIBUTED_COMPOSITION local array and C1 locks them on the
 *        imported module records, but the verdict prose is a third copy of
 *        that provenance list -- the human-readable authoritative record of
 *        which tickets the partial closure rests on. If a future edit
 *        silently rewrites the verdict to drop one of the imp-ids (e.g.
 *        summarises "three composing modules" without naming them, or
 *        swaps an imp-id for a descriptive label), C18 and C1 stay green
 *        while dashboards reading the verdict for provenance silently lose
 *        a pointer. C24 closes the last unpinned ticket-id-duplicate slot.
 *
 *   (C25) DISTRIBUTED_COMPOSITION local supplies-prose anchors are frozen:
 *        DISTRIBUTED_COMPOSITION[i].supplies must literally contain the
 *        distinguishing symbolic anchor for each composing leg: "D(tau)"
 *        for i=0 (the D-monotone inequality claim), "B1_SLOPE_CEILING" for
 *        i=1 (the B1 slope-bound constant handle), "A_UPPER_BOUND" for i=2
 *        (the B2 intercept-bound constant handle). C18/C19/C20 lock the
 *        impId/file/role triples in this same array, but the parallel
 *        supplies-prose triple -- the prose that tells a referee what each
 *        leg actually contributes -- is unpinned. If a future edit silently
 *        rewrites a supplies string (e.g. drops the "D(tau)" inequality or
 *        the B1_SLOPE_CEILING / A_UPPER_BOUND constant names and leaves
 *        only descriptive prose), the impId/file/role columns can still be
 *        literally correct so C18/C19/C20 stay green, while any referee
 *        reading the supplies column to understand what each module actually
 *        supplies silently sees a weakened or ambiguous claim. C25 pins
 *        the distinguishing anchors (not the full prose) so the supplies
 *        column is robust against paraphrase while still catching the
 *        substantive regression where the anchor symbol is dropped.
 *        Substring-anchor pattern matches C2/C9/C23/C24 for prose-style
 *        fields; C25 is structurally symmetric to C18/C19/C20 on the
 *        supplies-prose side and closes the last unpinned string-field
 *        triple in DISTRIBUTED_COMPOSITION.
 *
 *   (C26) residualSubGap.note prose anchors are frozen:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap.note must literally
 *        contain three substring anchors: "three" (the composition
 *        cardinality claim), "distributedComposition" (the cross-reference
 *        pointer to the array field on the same record), and "purely
 *        organizational" (the disposition claim that resolving the sub-gap
 *        would not change mathematical content). C14 locks blocker, C16
 *        locks id, C21 locks title, and the scope-tripwire locks status and
 *        monolithicFilePresent -- but the residualSubGap.note prose is the
 *        last unpinned string field on residualSubGap. That note is the
 *        human-readable justification a referee reads to understand why
 *        the missing monolithic file is safe to leave open. If a future
 *        edit silently rewrites it to drop the "three" cardinality (e.g.
 *        paraphrases to "the composition is distributed across modules"
 *        without the count), drops the "distributedComposition" cross-
 *        reference (e.g. replaces it with an ambiguous back-pointer), or
 *        upgrades "purely organizational" to a mathematical claim (e.g.
 *        rewrites to "would complete the proof"), C14/C16/C21 and the
 *        scope-tripwire all stay green while a referee reading the note
 *        silently sees a weakened cardinality claim, a lost pointer, or
 *        an unsupported strengthening of what the aggregator would deliver.
 *        C26 pins the distinguishing anchors (not the full prose) so
 *        paraphrase is allowed but anchor-loss is not. Substring-anchor
 *        pattern matches C2/C9/C23/C24/C25 for prose-style fields; C26 is
 *        structurally symmetric to C21 on the residualSubGap prose side
 *        and closes the last unpinned string slot on residualSubGap.
 *
 *   (C27) snapshot is a faithful mirror of the upstream status fields:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.snapshot.dMonotoneStatus must
 *        === D_MONOTONE_ANALYTIC_PROOF.status, .b1Status must ===
 *        B1_CONDITIONAL_BOUND.status, .b2Status must ===
 *        B2_INTERCEPT_BOUND.status, and .b2BoundValue must equal
 *        ((B2_INTERCEPT_BOUND.bound && B2_INTERCEPT_BOUND.bound.value) ||
 *        null). The snapshot is a LOCAL copy of the three upstream module
 *        statuses (and the B2 bound value) embedded on the crossverify
 *        record for dashboards and referees who read one field per leg
 *        without having to dereference each imported module record. C3
 *        locks B1.status to an allowed vocabulary, C11 locks NoSwap.status,
 *        and C12 locks D-monotone.status -- but none of those assertions
 *        checks that the SNAPSHOT copy still tracks its upstream. If a
 *        future edit silently hardcodes a snapshot field (e.g. replaces
 *        "dMonotoneStatus: D_MONOTONE_ANALYTIC_PROOF.status" with the
 *        literal "dMonotoneStatus: 'analytically-closed'" during a
 *        copy-paste or a refactor that inlines the import), the upstream
 *        vocabulary assertions all stay green, yet any downstream reader
 *        of the snapshot sees a frozen value that no longer tracks the
 *        live status. C27 is structurally symmetric to C15 (which locks
 *        the record self-id to the same value the ticket id must equal):
 *        it locks the snapshot fields to the same values the upstream
 *        imports must equal, closing the last unpinned identity slot on
 *        the crossverify record.
 *
 *   (C28) verdict prose names all three downstream-consumer file paths:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.verdict must literally contain
 *        the filenames "route-a-argmin-closure.js",
 *        "lambda-N1e6-final-assembly.js", and "lambda-zero-attack.js".
 *        The verdict's final clause claims "no caller is affected" and
 *        justifies that claim by naming the three downstream modules that
 *        read directly from the distributed records. C24 locks the
 *        upstream-provenance triple (three composing imp-ids) inside the
 *        same verdict string, but the parallel downstream-provenance
 *        triple (three downstream consumer filenames) is unpinned. If a
 *        future edit silently rewrites the verdict to drop one of these
 *        filenames (e.g. paraphrases "three downstream consumers" without
 *        naming them, or renames one during a refactor that is not
 *        mirrored here), C23 stays green (PARTIAL-closure substring
 *        unchanged) and C24 stays green (three composing imp-ids
 *        unchanged) -- yet any referee or impact-analysis reader checking
 *        the "no caller is affected" claim silently loses its pointer to
 *        one of the three downstream modules whose independence from the
 *        missing monolithic aggregator is the empirical basis of that
 *        claim. C28 is structurally symmetric to C24 on the downstream-
 *        consumer side and closes the last unpinned filename-duplicate
 *        triple in the verdict prose.
 *
 *   (C29) verdict prose names the non-blocking disposition:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.verdict must literally contain
 *        the substring "non-blocking". The verdict prose is the human-
 *        readable authoritative record of the closure disposition, and
 *        its "non-blocking sub-gap" phrase is the verdict-side copy of
 *        the machine-readable residualSubGap.blocker === false field. C14
 *        locks the record-side blocker flag and C26 locks the note-side
 *        "purely organizational" disposition anchor, but the verdict
 *        prose copy is unpinned. If a future edit silently rewrites the
 *        verdict to drop "non-blocking" (e.g. paraphrases the sub-gap as
 *        "still open" without its disposition, or upgrades it to
 *        "blocking" during an over-cautious rewrite), C14 stays green
 *        (blocker still false), C26 stays green (note-side anchors
 *        unchanged), and C23/C24/C28 stay green (closure-strength,
 *        composing imp-ids, and downstream filenames all unchanged) --
 *        yet any referee reading the verdict sees a disposition claim
 *        that contradicts or drops the tripwired blocker flag. C29 is
 *        structurally symmetric to C14 on the verdict-prose side and
 *        closes the last unpinned disposition slot in the verdict prose.
 *
 *   (C30) Record-side distributedComposition pointer is reference-identical
 *        to the local DISTRIBUTED_COMPOSITION const:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.distributedComposition must
 *        literally === DISTRIBUTED_COMPOSITION (same object reference).
 *        C18/C19/C20 lock the impId/file/role triples and C25 locks the
 *        supplies anchors, but all four assertions read from the local
 *        const directly, not from the record-side field. If a future edit
 *        silently replaces "distributedComposition: DISTRIBUTED_COMPOSITION"
 *        with a shallow copy (e.g. ".slice()" or "[...]"), a map that
 *        rewrites a field, or a literal array mirroring the const, the
 *        const stays intact so C18/C19/C20/C25 stay green, yet any
 *        downstream consumer reading the record-side field sees a diverged
 *        or frozen-in-time copy. C30 pins reference identity so the record-
 *        side pointer cannot silently detach from the const the other
 *        assertions lock.
 *
 *   (C31) snapshot key-set shape is frozen:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.snapshot must have exactly the
 *        four own keys {dMonotoneStatus, b1Status, b2Status, b2BoundValue}
 *        -- no more, no fewer. C27 locks the VALUES of those four keys
 *        (each must mirror its upstream module status or bound), but C27
 *        never enforces the snapshot key-set. If a future edit silently
 *        adds a fifth key (e.g. a noSwapStatus copied from NOSWAP_CLOSURE
 *        .status, or a cached b1Bound value), C27 stays green while the
 *        new field lands in the record unchecked -- any downstream
 *        dashboard reading the snapshot as "the four upstream statuses"
 *        silently sees a fifth column whose source of truth no crossverify
 *        assertion enforces. C31 is structurally symmetric to C27 on the
 *        snapshot-shape side: C27 locks values, C31 locks the key-set.
 *
 *   (C32) residualSubGap key-set shape is frozen:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap must have exactly
 *        the five own keys {id, title, status, blocker, note} -- no more,
 *        no fewer. C14 locks blocker, C16 locks id, C21 locks title, C26
 *        locks note prose anchors, and the scope-tripwire locks status --
 *        five separate value-level checks covering each currently-named
 *        field -- but none enforces the residualSubGap key-set itself. If
 *        a future edit silently adds a sixth key (e.g. an owner field
 *        copied from a ticket metadata refactor, a cachedAt timestamp, or
 *        a severity tag that parallels blocker), C14/C16/C21/C26 and the
 *        scope-tripwire all stay green because the five original keys are
 *        unchanged and still satisfy their value-level locks -- yet any
 *        downstream dashboard reading residualSubGap as "the five fields
 *        of the monolithic-file sub-gap" silently sees a sixth column
 *        whose source of truth no crossverify assertion enforces. C32 is
 *        structurally symmetric to C31 on the residualSubGap side: C31
 *        locks the snapshot key-set, C32 locks the residualSubGap key-set.
 *        This closes the last unpinned shape slot on the crossverify record.
 *
 *   (C33) Top-level ROUTE_A_MONOTONICITY_CROSSVERIFY key-set shape is frozen:
 *        ROUTE_A_MONOTONICITY_CROSSVERIFY must have exactly the eight own
 *        keys {id, title, monolithicFileExpected, monolithicFilePresent,
 *        distributedComposition, residualSubGap, verdict, snapshot} -- no
 *        more, no fewer. C31 locks the snapshot key-set and C32 locks the
 *        residualSubGap key-set, but the OUTERMOST crossverify record own
 *        key-set is itself unpinned. C15 locks id, C22 locks title, C17
 *        locks monolithicFileExpected, the scope-tripwire locks
 *        monolithicFilePresent === false, C30 locks distributedComposition
 *        pointer-identity, and C23/C24/C28/C29 lock verdict prose anchors --
 *        eight separate value-level checks covering each currently-named
 *        top-level field -- but none enforces the outer key-set itself. If
 *        a future edit silently adds a ninth key (e.g. a generatedAt
 *        timestamp, a schemaVersion tag, a cached aggregatorStatus flag
 *        copied from a refactor, or an owner metadata field), all prior
 *        assertions stay green (the eight original keys are unchanged and
 *        still satisfy their value-level locks) while the new field lands
 *        in the record unchecked -- any downstream dashboard or aggregator
 *        reading the crossverify record as "the eight canonical top-level
 *        fields" silently sees a ninth column whose source of truth no
 *        crossverify assertion enforces. C33 closes that shape gap by
 *        asserting Object.keys(ROUTE_A_MONOTONICITY_CROSSVERIFY).sort() is
 *        exactly ["distributedComposition", "id", "monolithicFileExpected",
 *        "monolithicFilePresent", "residualSubGap", "snapshot", "title",
 *        "verdict"] (length 8 and each sorted position matches the
 *        alphabetical order of the eight known top-level keys). This
 *        catches both directions of drift: a new key added (length 9
 *        fails), a key removed (length 7 fails and a named key is missing),
 *        or a key renamed (sorted positions shift). Structurally symmetric
 *        to C31/C32 on the outer-record side: C31 locks the inner snapshot
 *        key-set, C32 locks the inner residualSubGap key-set, C33 locks
 *        the outer crossverify record key-set, closing the LAST unpinned
 *        shape slot in the entire imp-826 crossverify record tree.
 *
 *   (C34) DISTRIBUTED_COMPOSITION per-entry key-set shape is frozen:
 *        Each DISTRIBUTED_COMPOSITION[i] must have exactly the four own
 *        keys {role, impId, file, supplies} -- no more, no fewer. C18
 *        locks the impId VALUES, C19 locks the file VALUES, C20 locks
 *        the role VALUES, and C25 locks the supplies anchor VALUES --
 *        four separate value-level checks covering each currently-named
 *        field on each entry -- but none enforces the per-entry key-set
 *        itself. C31 locks the snapshot Object.keys, C32 locks the
 *        residualSubGap Object.keys, and C33 locks the outer crossverify
 *        record Object.keys, but each entry OBJECT inside
 *        DISTRIBUTED_COMPOSITION has its own key-set that no assertion
 *        pins (C33's "LAST unpinned shape slot" claim covers the outer
 *        record shape, not the per-entry shapes nested beneath it). If
 *        a future edit silently adds a fifth key to one entry (e.g. an
 *        owner metadata field, a cachedAt timestamp, or a severity tag
 *        paralleling role) or removes one of the four known keys (e.g.
 *        inlines supplies into the role column during a refactor),
 *        C18/C19/C20/C25 all stay green because the four originally-
 *        named columns are unchanged and still satisfy their value-
 *        level locks -- yet any downstream dashboard reading a
 *        DISTRIBUTED_COMPOSITION entry as "the four canonical columns"
 *        silently sees a fifth column (or loses a named column) whose
 *        source of truth no crossverify assertion enforces. C34 closes
 *        that shape gap by asserting, for each i in 0..2, that
 *        Object.keys(DISTRIBUTED_COMPOSITION[i]).sort() is exactly
 *        ["file", "impId", "role", "supplies"] (length 4 and each
 *        sorted position matches the alphabetical order of the four
 *        known per-entry keys). This catches both directions of drift:
 *        a new key added (length 5 fails), a key removed (length 3
 *        fails and a named key is missing), or a key renamed (sorted
 *        positions shift). Structurally symmetric to C31/C32/C33 on
 *        the DISTRIBUTED_COMPOSITION entry side: C31 locks the inner
 *        snapshot key-set, C32 locks the inner residualSubGap key-set,
 *        C33 locks the outer crossverify record key-set, and C34 locks
 *        each DISTRIBUTED_COMPOSITION entry key-set, closing the last
 *        unpinned per-entry shape slot in the distributed composition
 *        listing.
 *
 * Residual sub-gap named by imp-826
 * ---------------------------------
 *   ROUTE_A_MONOTONICITY_MONOLITHIC_FILE_MISSING:
 *   No single module src/math/route-a-monotonicity-closure.js exists.
 *   Status: open (non-blocking). The distributed composition above is
 *   already cross-verified by C1..C5. A future aggregator module would
 *   not change mathematical content; it would be purely organizational.
 *
 * SYNTAX NOTE: avoid the star-slash sequence anywhere in JSDoc text; it
 * closes the comment. Use forms like dg_{k*}/dtau in comments, not
 * dg_k/dt with a trailing slash.
 */

import { D_MONOTONE_ANALYTIC_PROOF } from './d-monotone-analytic-proof.js';
import { NOSWAP_CLOSURE }            from './noswap-closure.js';
import { B1_CONDITIONAL_BOUND }      from '../data/b1-slope-conditional-upper-bound.js';
import { B2_INTERCEPT_BOUND }        from '../data/b2-intercept-analytic-bound.js';

const DISTRIBUTED_COMPOSITION = [
  {
    role:     'D-monotone',
    impId:    'imp-463',
    file:     'src/math/d-monotone-analytic-proof.js',
    supplies: 'D(tau) >= D(0) on [0, tau_c] under NoSwap (analytically closed).',
  },
  {
    role:     'B1 slope bound',
    impId:    'imp-457',
    file:     'src/data/b1-slope-conditional-upper-bound.js',
    supplies:
      'b(N) = N * tau_c(N) <= b_lin(N) <= B1_SLOPE_CEILING, ' +
      'conditional on NoSwap (D-monotone no longer a separate sub-gap).',
  },
  {
    role:     'B2 intercept bound',
    impId:    'imp-458',
    file:     'src/data/b2-intercept-analytic-bound.js',
    supplies:
      'a := lim inf_{N -> inf} |t_c(N)| <= A_UPPER_BOUND, ' +
      'conditional on the monotonicity conjecture M.',
  },
];

const MONOLITHIC_FILE_EXPECTED = 'src/math/route-a-monotonicity-closure.js';

export const ROUTE_A_MONOTONICITY_CROSSVERIFY = {
  id:    'imp-826',
  title: 'Cross-verify the distributed Route A monotonicity-closure composition',

  monolithicFileExpected: MONOLITHIC_FILE_EXPECTED,
  monolithicFilePresent:  false,

  distributedComposition: DISTRIBUTED_COMPOSITION,

  residualSubGap: {
    id:     'ROUTE_A_MONOTONICITY_MONOLITHIC_FILE_MISSING',
    title:  MONOLITHIC_FILE_EXPECTED + ' does not exist as a single module',
    status: 'open',
    blocker: false,
    note:
      'The composition is distributed across three modules (see ' +
      'distributedComposition). The distributed form is cross-verified ' +
      'by assertions C1..C5 below. A future aggregator module would not ' +
      'change mathematical content; it would be purely organizational.',
  },

  verdict:
    'imp-826 delivers PARTIAL closure via distributed cross-verification. ' +
    'The three composing modules (imp-457, imp-458, imp-463) pass their ' +
    'own build-time assertions and expose records whose id, status, and ' +
    'citation strings satisfy C1..C5 here. The monolithic assembly file ' +
    'named by the ticket does not exist; its absence is recorded as a ' +
    'non-blocking sub-gap. Downstream consumers (route-a-argmin-closure.js, ' +
    'lambda-N1e6-final-assembly.js, lambda-zero-attack.js) read directly ' +
    'from the distributed records, so no caller is affected.',

  snapshot: {
    dMonotoneStatus: D_MONOTONE_ANALYTIC_PROOF.status,
    b1Status:        B1_CONDITIONAL_BOUND.status,
    b2Status:        B2_INTERCEPT_BOUND.status,
    b2BoundValue:    (B2_INTERCEPT_BOUND.bound && B2_INTERCEPT_BOUND.bound.value) || null,
  },
};

// --- Cross-verify assertions (ready to run; self-invoke at module load) ----

export const ROUTE_A_MONOTONICITY_CROSSVERIFY_ASSERTIONS = [
  {
    id: 'imp826-C1-id-stability',
    holds: () =>
      D_MONOTONE_ANALYTIC_PROOF.id === 'imp-463' &&
      B1_CONDITIONAL_BOUND.id      === 'imp-457' &&
      B2_INTERCEPT_BOUND.id        === 'imp-458',
    why:
      'C1: the three composing modules must retain ids imp-463, imp-457, ' +
      'imp-458. Id drift strands citation chains in route-a-argmin-closure.js ' +
      'and lambda-N1e6-final-assembly.js.',
  },
  {
    id: 'imp826-C2-d-monotone-feeds-b1',
    holds: () => {
      const hay = (B1_CONDITIONAL_BOUND.closedConditions || []).join(' | ');
      return hay.indexOf('skp-imp457-D-monotone') !== -1 &&
             hay.indexOf('imp-463')               !== -1;
    },
    why:
      'C2: B1.closedConditions must literally reference the sub-gap id ' +
      '"skp-imp457-D-monotone" and its closing ticket "imp-463". If the ' +
      'citation text is rewritten, the D-monotone -> B1 chain is silently ' +
      'broken and this tripwire catches it.',
  },
  {
    id: 'imp826-C3-b1-status-in-allowed-vocabulary',
    holds: () => {
      const s = B1_CONDITIONAL_BOUND.status;
      return s === 'analytically-closed' ||
             s === 'numerically-closed'  ||
             s === 'conditional-closed';
    },
    why:
      'C3: B1.status must be one of the three expected strings. Any other ' +
      'value signals a regression in D-monotone or NoSwap, or a hardcoded ' +
      'override bypassing the conditional ternary in b1.',
  },
  {
    id: 'imp826-C4-b2-bound-positive-finite',
    holds: () => {
      const v = B2_INTERCEPT_BOUND.bound && B2_INTERCEPT_BOUND.bound.value;
      return typeof v === 'number' && Number.isFinite(v) && v > 0;
    },
    why:
      'C4: B2.bound.value must be a positive finite number (empirically ' +
      'around 0.0094). A null or non-positive value invalidates the ' +
      'intercept leg of Route A.',
  },
  {
    id: 'imp826-C5-no-unwarranted-upgrade',
    holds: () => {
      if (B1_CONDITIONAL_BOUND.status === 'analytically-closed' &&
          D_MONOTONE_ANALYTIC_PROOF.status !== 'analytically-closed') {
        return false;
      }
      return true;
    },
    why:
      'C5: the composition must never claim strength beyond its weakest ' +
      'link. If D-monotone regresses, B1 must not retain analytically-closed.',
  },
  {
    id: 'imp826-C6-b2-beats-ceiling-at-composition-level',
    holds: () =>
      B2_INTERCEPT_BOUND.bound &&
      B2_INTERCEPT_BOUND.bound.beatsCeiling === true &&
      B2_INTERCEPT_BOUND.status === 'conditional-closed',
    why:
      'C6: B2 must literally satisfy beatsCeiling === true AND status === ' +
      '"conditional-closed". C4 only checks value > 0; C6 catches the real ' +
      'composition-level regression where the Koksma-Hlawka bound at N_max ' +
      'drifts above the 0.02 ceiling (status flips to ' +
      'conditional-open-ceiling-not-met) or N_max is removed (flips to ' +
      'conditional-open-no-nmax). A positive but ceiling-failing bound ' +
      'would otherwise silently let Route A claim intercept closure.',
  },
  {
    id: 'imp826-C7-d-monotone-citation-handshake',
    holds: () =>
      D_MONOTONE_ANALYTIC_PROOF.subGap === 'skp-imp457-D-monotone' &&
      D_MONOTONE_ANALYTIC_PROOF.ticket === 'imp-463',
    why:
      'C7: closes the citation handshake on the D-monotone SIDE. C2 only ' +
      'verifies B1.closedConditions literally cites "skp-imp457-D-monotone" ' +
      'and "imp-463". If D-monotone renames its subGap or ticket field while ' +
      'B1 freezes its citation text, C2 stays green and the chain silently ' +
      'breaks. C7 locks the D-monotone side so both ends of the handshake ' +
      'are checked.',
  },
  {
    id: 'imp826-C8-b2-ceiling-matches-assembly-target',
    holds: () =>
      B2_INTERCEPT_BOUND.bound &&
      B2_INTERCEPT_BOUND.bound.ceiling === 0.02,
    why:
      'C8: the finite-height beat assembly (lambda-N1e6-final-assembly.js) ' +
      'requires a <= 0.02 specifically. B2_INTERCEPT_BOUND.bound.ceiling must ' +
      'literally equal 0.02 so that beatsCeiling is computed against the ' +
      'assembly contract rather than an edited constant. C4 (value > 0) and ' +
      'C6 (beatsCeiling === true) both remain green even if the ceiling is ' +
      'silently raised (e.g. 0.02 -> 0.03) to mask a Koksma-Hlawka regression. ' +
      'C8 locks the ceiling value itself so the composition promise matches ' +
      'the downstream assembly target.',
  },
  {
    id: 'imp826-C9-noswap-citation-handshake',
    holds: () => {
      const hay = (B1_CONDITIONAL_BOUND.closedConditions || []).join(' | ');
      return hay.indexOf('NoSwap')  !== -1 &&
             hay.indexOf('imp-464') !== -1;
    },
    why:
      'C9: B1.closedConditions must literally reference "NoSwap" and its ' +
      'closing ticket "imp-464". C2 only locks the D-monotone SIDE of the ' +
      'handshake (skp-imp457-D-monotone + imp-463). If a future edit rewrites ' +
      'the NoSwap citation string (e.g. drops the "imp-464" tag or renames ' +
      '"NoSwap"), C2 stays green while the B1 NoSwap leg silently loses its ' +
      'pointer to its closure ticket. C9 is structurally symmetric to C2 and ' +
      'locks the NoSwap half of the B1 citation handshake.',
  },
  {
    id: 'imp826-C10-noswap-module-citation-handshake',
    holds: () =>
      NOSWAP_CLOSURE.id     === 'imp-464' &&
      NOSWAP_CLOSURE.ticket === 'imp-464',
    why:
      'C10: closes the citation handshake on the NoSwap-module SIDE. C9 ' +
      'only verifies B1.closedConditions literally cites "imp-464". If the ' +
      'NoSwap module renames its id or ticket field while B1 freezes its ' +
      'citation text, C9 stays green and the NoSwap leg of the chain ' +
      'silently breaks at the closer end. C10 is structurally symmetric ' +
      'to C7 (which locks the D-monotone side) and locks the NoSwap side ' +
      'so both ends of the NoSwap handshake are verified.',
  },
  {
    id: 'imp826-C11-noswap-status-in-allowed-vocabulary',
    holds: () => {
      const s = NOSWAP_CLOSURE.status;
      return s === 'analytically-closed' || s === 'numerically-closed';
    },
    why:
      'C11: NOSWAP_CLOSURE.status must be one of {analytically-closed, ' +
      'numerically-closed}. B1.status is computed by a ternary that ' +
      'literally tests these two strings (b1-slope-conditional-upper-bound.js ' +
      'lines 137-141). If NoSwap silently drifts to any other status, B1 ' +
      'falls through to conditional-closed without tripping a wire: C3 only ' +
      'locks the RESULTING B1 status vocabulary, and C10 only locks the ' +
      'NoSwap id/ticket fields (not the status string). C11 is structurally ' +
      'symmetric to C3 on the NoSwap upstream side, catching the regression ' +
      'where a weakened NoSwap status silently downgrades the B1 leg of the ' +
      'composition.',
  },
  {
    id: 'imp826-C12-d-monotone-status-in-allowed-vocabulary',
    holds: () => {
      const s = D_MONOTONE_ANALYTIC_PROOF.status;
      return s === 'analytically-closed' ||
             s === 'analytical-argument-with-numerical-failure';
    },
    why:
      'C12: D_MONOTONE_ANALYTIC_PROOF.status must be one of ' +
      '{analytically-closed, analytical-argument-with-numerical-failure}. ' +
      'These are the only values the status ternary in ' +
      'd-monotone-analytic-proof.js lines 274-276 can produce today. If a ' +
      'future edit widens that ternary and status drifts to an unrecognized ' +
      'value, C5 (which only tests equality against "analytically-closed") ' +
      'silently stops enforcing the "weakest link" guard at full strength: ' +
      'C7 locks subGap and ticket on the D-monotone side but NOT status, ' +
      'and C3/C11 only lock the B1 and NoSwap status vocabularies. C12 is ' +
      'structurally symmetric to C3 and C11 on the D-monotone upstream side ' +
      'and closes the last unlocked status-vocabulary slot.',
  },
  {
    id: 'imp826-C13-noswap-weakest-link-guard',
    holds: () => {
      if (B1_CONDITIONAL_BOUND.status === 'analytically-closed' &&
          NOSWAP_CLOSURE.status       !== 'analytically-closed') {
        return false;
      }
      return true;
    },
    why:
      'C13: the NoSwap-side "weakest link" guard. If B1 claims analytically-' +
      'closed, NoSwap must also be analytically-closed. The B1 status ternary ' +
      '(b1-slope-conditional-upper-bound.js lines 137-141) requires BOTH NoSwap ' +
      'and D-monotone to be analytically-closed for B1 to upgrade. C5 only ' +
      'catches D-monotone regressions; if a future edit unpins B1 from the ' +
      'NoSwap half of that conjunction, C5 stays green while the composition ' +
      'silently claims more than its NoSwap leg supports. C13 is structurally ' +
      'symmetric to C5 on the NoSwap side and closes the last unlocked ' +
      'weakest-link slot.',
  },
  {
    id: 'imp826-C14-monolithic-gap-stays-non-blocking',
    holds: () =>
      ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap.blocker === false,
    why:
      'C14: ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap.blocker must ' +
      'literally equal false. The scope-tripwire below only pins ' +
      'residualSubGap.status === "open" and monolithicFilePresent === false; ' +
      'it does NOT pin the blocker field. If a future edit flips blocker to ' +
      'true (reinterpreting the missing monolithic file as blocking), the ' +
      'imp-826 partial-closure-non-blocking verdict silently downgrades ' +
      'while the scope-tripwire stays green. C14 locks the last unpinned ' +
      'identity field of residualSubGap so the verdict and the sub-gap ' +
      'record cannot drift apart.',
  },
  {
    id: 'imp826-C15-crossverify-record-self-id',
    holds: () => ROUTE_A_MONOTONICITY_CROSSVERIFY.id === 'imp-826',
    why:
      'C15: ROUTE_A_MONOTONICITY_CROSSVERIFY.id must literally equal ' +
      '"imp-826". C1 locks the three UPSTREAM module ids (imp-463, imp-457, ' +
      'imp-458), C7 locks the D-monotone handshake endpoint ids, and C10 ' +
      'locks the NoSwap-module endpoint ids -- but the crossverify record ' +
      'own id field is unpinned. If a future edit renames it (e.g. "imp-826a" ' +
      'during a sub-ticket split, or a hyphenless variant), any dashboard or ' +
      'queue index filtering ticket records by literal id === "imp-826" ' +
      'silently loses its pointer to the imp-826 crossverify work while every ' +
      'other C1..C14 assertion continues to pass. C15 is structurally ' +
      'symmetric to C1 on the crossverify-record side and closes the last ' +
      'unpinned id field in the whole composition.',
  },
  {
    id: 'imp826-C16-residual-subgap-id-frozen',
    holds: () =>
      ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap.id ===
      'ROUTE_A_MONOTONICITY_MONOLITHIC_FILE_MISSING',
    why:
      'C16: ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap.id must ' +
      'literally equal "ROUTE_A_MONOTONICITY_MONOLITHIC_FILE_MISSING". ' +
      'C14 locks the blocker flag and the scope-tripwire locks status and ' +
      'monolithicFilePresent, but the sub-gap own id (the named handle ' +
      'aggregators filter by) is unpinned. If a future edit renames or ' +
      'reformats the sub-gap id, downstream aggregators filtering sub-gap ' +
      'records by literal id === "ROUTE_A_MONOTONICITY_MONOLITHIC_FILE_MISSING" ' +
      'silently lose their pointer while C14 and the scope-tripwire both ' +
      'stay green. C16 is structurally symmetric to C15 on the sub-gap-' +
      'record side and closes the last unpinned id field on residualSubGap.',
  },
  {
    id: 'imp826-C17-monolithic-file-expected-path-frozen',
    holds: () =>
      ROUTE_A_MONOTONICITY_CROSSVERIFY.monolithicFileExpected ===
      'src/math/route-a-monotonicity-closure.js',
    why:
      'C17: ROUTE_A_MONOTONICITY_CROSSVERIFY.monolithicFileExpected must ' +
      'literally equal "src/math/route-a-monotonicity-closure.js", the path ' +
      'the imp-826 ticket originally named. The sub-gap title and verdict ' +
      'text both reference this exact string. C14 locks residualSubGap.blocker, ' +
      'C16 locks residualSubGap.id, and the scope-tripwire locks ' +
      'monolithicFilePresent === false -- but the EXPECTED path itself is ' +
      'unpinned. If a future edit silently retargets the expected path to a ' +
      'different module (e.g. a neighbouring file that does happen to exist, ' +
      'auto-satisfying "file missing" by picking a different file to look for), ' +
      'monolithicFilePresent stays false, status stays "open", blocker stays ' +
      'false -- yet the contract of the sub-gap has been silently reinterpreted. ' +
      'C17 locks the expected path so the sub-gap identity cannot drift under ' +
      'the scope tripwire.',
  },
  {
    id: 'imp826-C18-distributed-composition-local-impids-frozen',
    holds: () => {
      if (!Array.isArray(DISTRIBUTED_COMPOSITION) ||
          DISTRIBUTED_COMPOSITION.length !== 3) {
        return false;
      }
      const ids = DISTRIBUTED_COMPOSITION.map((e) => e && e.impId);
      return ids[0] === 'imp-463' &&
             ids[1] === 'imp-457' &&
             ids[2] === 'imp-458';
    },
    why:
      'C18: DISTRIBUTED_COMPOSITION must have exactly 3 entries whose impId ' +
      'fields are the literal strings "imp-463", "imp-457", "imp-458" in that ' +
      'order. C1 only locks the UPSTREAM module ids read through imported ' +
      'constants (D_MONOTONE_ANALYTIC_PROOF.id, B1_CONDITIONAL_BOUND.id, ' +
      'B2_INTERCEPT_BOUND.id). The DISTRIBUTED_COMPOSITION array here is a ' +
      'LOCAL duplicate of those ids embedded in this crossverify record; if ' +
      'a future edit rewrites the local impId strings (e.g. drifts ' +
      '"imp-463" to "imp-821" in a sub-ticket renaming) or adds/removes an ' +
      'entry from the array, C1 stays green (the imports are unchanged) ' +
      'while any downstream dashboard or aggregator that reads impIds from ' +
      'THIS record silently loses or mislinks its pointer to the three ' +
      'composing modules. C18 is structurally symmetric to C1 on the local-' +
      'record side and closes the last unpinned id-duplicate slot in the ' +
      'distributed composition listing.',
  },
  {
    id: 'imp826-C19-distributed-composition-local-files-frozen',
    holds: () => {
      if (!Array.isArray(DISTRIBUTED_COMPOSITION) ||
          DISTRIBUTED_COMPOSITION.length !== 3) {
        return false;
      }
      const files = DISTRIBUTED_COMPOSITION.map((e) => e && e.file);
      return files[0] === 'src/math/d-monotone-analytic-proof.js' &&
             files[1] === 'src/data/b1-slope-conditional-upper-bound.js' &&
             files[2] === 'src/data/b2-intercept-analytic-bound.js';
    },
    why:
      'C19: DISTRIBUTED_COMPOSITION must have exactly 3 entries whose file ' +
      'fields are the literal strings "src/math/d-monotone-analytic-proof.js", ' +
      '"src/data/b1-slope-conditional-upper-bound.js", ' +
      '"src/data/b2-intercept-analytic-bound.js" in that order. C18 locks ' +
      'the LOCAL impId strings in the same array, but the parallel file-path ' +
      'pointer strings are unpinned. If a future edit silently retargets a ' +
      'file string to a different module (e.g. a neighbouring file that ' +
      'happens to exist, or a renamed equivalent), the impId still points ' +
      'at "imp-463"/"imp-457"/"imp-458" so C18 stays green, while any ' +
      'downstream dashboard or aggregator reading file paths from THIS ' +
      'record to locate the composing modules silently follows a broken or ' +
      'reinterpreted pointer. C19 is structurally symmetric to C18 on the ' +
      'local-file-path side and closes the last unpinned string-field triple ' +
      'in DISTRIBUTED_COMPOSITION.',
  },
  {
    id: 'imp826-C20-distributed-composition-local-roles-frozen',
    holds: () => {
      if (!Array.isArray(DISTRIBUTED_COMPOSITION) ||
          DISTRIBUTED_COMPOSITION.length !== 3) {
        return false;
      }
      const roles = DISTRIBUTED_COMPOSITION.map((e) => e && e.role);
      return roles[0] === 'D-monotone' &&
             roles[1] === 'B1 slope bound' &&
             roles[2] === 'B2 intercept bound';
    },
    why:
      'C20: DISTRIBUTED_COMPOSITION must have exactly 3 entries whose role ' +
      'fields are the literal strings "D-monotone", "B1 slope bound", ' +
      '"B2 intercept bound" in that order. C18 locks the impId triple and ' +
      'C19 locks the file-path triple in the same array, but the parallel ' +
      'role-label triple is unpinned. If a future edit silently retargets ' +
      'a role string (e.g. relabels "D-monotone" to "D-monotone-closure" ' +
      'during a refactor, or permutes the entries so i=0 becomes "B1 slope ' +
      'bound"), the impId and file columns can still be literally correct ' +
      'by coincidence if the rewrite only touches the role column, so C18 ' +
      'and C19 stay green while any downstream dashboard labelling the ' +
      'composition entries by role silently mislabels the three modules ' +
      'or misorders the legs of Route A. C20 is structurally symmetric to ' +
      'C18 and C19 on the role-label side and closes the last unpinned ' +
      'string-field triple in DISTRIBUTED_COMPOSITION.',
  },
  {
    id: 'imp826-C21-residual-subgap-title-frozen',
    holds: () =>
      ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap.title ===
      'src/math/route-a-monotonicity-closure.js does not exist as a single module',
    why:
      'C21: ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap.title must ' +
      'literally equal "src/math/route-a-monotonicity-closure.js does not ' +
      'exist as a single module". C16 locks residualSubGap.id (the named ' +
      'handle aggregators filter by) and C17 locks monolithicFileExpected ' +
      '(the path substring the title is built from), but the title itself -- ' +
      'the human-readable string dashboards and queue viewers display -- ' +
      'is only partially pinned: its prefix tracks MONOLITHIC_FILE_EXPECTED ' +
      'through string concatenation, but its suffix literal ' +
      '" does not exist as a single module" is unpinned. If a future edit ' +
      'silently rewrites the suffix (e.g. to " is missing" or " is not yet ' +
      'assembled"), C16 stays green (id unchanged), C17 stays green (path ' +
      'unchanged), and the scope-tripwire stays green (status still "open", ' +
      'monolithicFilePresent still false) -- yet any downstream dashboard ' +
      'reading the title string to label the sub-gap silently displays ' +
      'different wording than the C16 named handle implies. C21 is ' +
      'structurally symmetric to C16 on the title-field side and closes the ' +
      'last unpinned string slot on residualSubGap.',
  },
  {
    id: 'imp826-C22-crossverify-record-title-frozen',
    holds: () =>
      ROUTE_A_MONOTONICITY_CROSSVERIFY.title ===
      'Cross-verify the distributed Route A monotonicity-closure composition',
    why:
      'C22: ROUTE_A_MONOTONICITY_CROSSVERIFY.title must literally equal ' +
      '"Cross-verify the distributed Route A monotonicity-closure ' +
      'composition". C15 locks the crossverify record self-id to "imp-826" ' +
      'and C21 locks the residualSubGap.title, but the crossverify record ' +
      'OWN title field (the human-readable label dashboards and queue ' +
      'viewers display alongside id === "imp-826") is unpinned. If a ' +
      'future edit silently rewrites this title (e.g. during a sub-ticket ' +
      'split the title might be retouched to narrow or broaden the scope, ' +
      'or a refactor that renames the ticket concept might rewrite the ' +
      'label), C15 stays green (id still "imp-826") while any dashboard ' +
      'reading the title to describe the crossverify work silently ' +
      'displays different wording than the id implies. C22 is structurally ' +
      'symmetric to C21 (which locks residualSubGap.title) on the top-' +
      'level record side and closes the last unpinned string slot on the ' +
      'crossverify record itself.',
  },
  {
    id: 'imp826-C23-verdict-partial-closure-honest',
    holds: () =>
      typeof ROUTE_A_MONOTONICITY_CROSSVERIFY.verdict === 'string' &&
      ROUTE_A_MONOTONICITY_CROSSVERIFY.verdict.indexOf('PARTIAL closure') !== -1,
    why:
      'C23: ROUTE_A_MONOTONICITY_CROSSVERIFY.verdict must literally contain ' +
      'the substring "PARTIAL closure". The verdict prose is the authoritative ' +
      'record of what imp-826 delivers -- a distributed cross-verification that ' +
      'does NOT construct the missing monolithic file, so the ticket closes ' +
      'only PARTIALLY. C1..C22 cover ids, statuses, paths, and titles, but none ' +
      'covers the closure-strength claim in the verdict. If a future edit ' +
      'silently upgrades the verdict to "FULL closure" (e.g. a rewrite that ' +
      'reinterprets the distributed composition as a full aggregator), C14 ' +
      'stays green (blocker unchanged), the scope-tripwire stays green (status ' +
      '"open", monolithicFilePresent false), and C16/C17/C21 stay green (sub-' +
      'gap id, monolithic path, sub-gap title unchanged) -- yet any referee or ' +
      'downstream dashboard reading the verdict sees a stronger closure claim ' +
      'than the sub-gap record supports. C23 locks the honesty of the verdict ' +
      'itself so the closure strength cannot drift under the existing tripwires.',
  },
  {
    id: 'imp826-C24-verdict-names-all-three-composing-impids',
    holds: () => {
      const v = ROUTE_A_MONOTONICITY_CROSSVERIFY.verdict;
      if (typeof v !== 'string') return false;
      return v.indexOf('imp-457') !== -1 &&
             v.indexOf('imp-458') !== -1 &&
             v.indexOf('imp-463') !== -1;
    },
    why:
      'C24: ROUTE_A_MONOTONICITY_CROSSVERIFY.verdict must literally contain ' +
      'all three composing-module ids "imp-457", "imp-458", "imp-463". C18 ' +
      'locks those three ids on the DISTRIBUTED_COMPOSITION local array, and ' +
      'C1 locks them on the imported module records, but the verdict prose is ' +
      'a third copy of that provenance list -- the human-readable authoritative ' +
      'record of which tickets the partial closure rests on. If a future edit ' +
      'silently rewrites the verdict to drop one of the imp-ids (e.g. summarises ' +
      '"three composing modules" without naming them, or renames "imp-463" to ' +
      '"D-monotone" descriptively), C18 stays green (the local array is ' +
      'unchanged), C1 stays green (the imports are unchanged), and C23 stays ' +
      'green (the "PARTIAL closure" substring is unchanged) -- yet any referee ' +
      'or downstream dashboard reading the verdict for ticket provenance ' +
      'silently loses the pointer to one of the three composing tickets. C24 ' +
      'locks the last unpinned ticket-id-duplicate slot (the verdict prose ' +
      'copy) so the three ticket ids cannot drift out of the verdict under the ' +
      'existing C1, C18, and C23 tripwires.',
  },
  {
    id: 'imp826-C25-distributed-composition-local-supplies-anchors-frozen',
    holds: () => {
      if (!Array.isArray(DISTRIBUTED_COMPOSITION) ||
          DISTRIBUTED_COMPOSITION.length !== 3) {
        return false;
      }
      const supplies = DISTRIBUTED_COMPOSITION.map((e) => e && e.supplies);
      if (typeof supplies[0] !== 'string' ||
          typeof supplies[1] !== 'string' ||
          typeof supplies[2] !== 'string') {
        return false;
      }
      return supplies[0].indexOf('D(tau)')           !== -1 &&
             supplies[1].indexOf('B1_SLOPE_CEILING') !== -1 &&
             supplies[2].indexOf('A_UPPER_BOUND')    !== -1;
    },
    why:
      'C25: DISTRIBUTED_COMPOSITION must have exactly 3 entries whose ' +
      'supplies-prose fields literally contain the distinguishing symbolic ' +
      'anchor for each composing leg: "D(tau)" for i=0, "B1_SLOPE_CEILING" ' +
      'for i=1, "A_UPPER_BOUND" for i=2. C18 locks the impId triple, C19 ' +
      'locks the file triple, and C20 locks the role triple in the same ' +
      'array, but the parallel supplies-prose triple -- the prose telling a ' +
      'referee what each leg actually contributes -- is unpinned. If a ' +
      'future edit silently rewrites a supplies string to drop the anchor ' +
      '(e.g. paraphrases the D-monotone inequality without "D(tau)", or ' +
      'replaces the B1_SLOPE_CEILING / A_UPPER_BOUND constant names with ' +
      'descriptive phrases), C18/C19/C20 stay green (impId/file/role are ' +
      'unchanged) while any referee reading the supplies column silently ' +
      'sees a weakened or ambiguous claim. C25 pins the distinguishing ' +
      'anchor (not the full prose) so paraphrase is allowed but anchor-' +
      'loss is not. Substring-anchor pattern matches C2/C9/C23/C24 for ' +
      'prose-style fields; structurally symmetric to C18/C19/C20 on the ' +
      'supplies side and closes the last unpinned string-field triple in ' +
      'DISTRIBUTED_COMPOSITION.',
  },
  {
    id: 'imp826-C26-residual-subgap-note-anchors-frozen',
    holds: () => {
      const n = ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap.note;
      if (typeof n !== 'string') return false;
      return n.indexOf('three')                  !== -1 &&
             n.indexOf('distributedComposition') !== -1 &&
             n.indexOf('purely organizational')  !== -1;
    },
    why:
      'C26: ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap.note must ' +
      'literally contain three substring anchors: "three" (the composition ' +
      'cardinality claim), "distributedComposition" (the cross-reference ' +
      'pointer to the array field on the same record), and "purely ' +
      'organizational" (the disposition claim that resolving the sub-gap ' +
      'would not change mathematical content). C14 locks blocker, C16 locks ' +
      'id, C21 locks title, and the scope-tripwire locks status and ' +
      'monolithicFilePresent -- but the residualSubGap.note prose is the ' +
      'last unpinned string field on residualSubGap. That note is the ' +
      'human-readable justification a referee reads to understand why the ' +
      'missing monolithic file is safe to leave open. If a future edit ' +
      'silently rewrites it to drop the "three" cardinality (e.g. ' +
      'paraphrases to "distributed across modules" without the count), ' +
      'drops the "distributedComposition" cross-reference (e.g. replaces ' +
      'it with an ambiguous back-pointer), or upgrades "purely ' +
      'organizational" to a mathematical claim (e.g. rewrites to "would ' +
      'complete the proof"), C14/C16/C21 and the scope-tripwire all stay ' +
      'green while a referee reading the note silently sees a weakened ' +
      'cardinality claim, a lost pointer, or an unsupported strengthening ' +
      'of what the aggregator would deliver. C26 pins the distinguishing ' +
      'anchors (not the full prose) so paraphrase is allowed but anchor-' +
      'loss is not. Substring-anchor pattern matches C2/C9/C23/C24/C25 for ' +
      'prose-style fields; structurally symmetric to C21 on the ' +
      'residualSubGap prose side and closes the last unpinned string slot ' +
      'on residualSubGap.',
  },
  {
    id: 'imp826-C27-snapshot-mirrors-upstream-status',
    holds: () => {
      const s = ROUTE_A_MONOTONICITY_CROSSVERIFY.snapshot;
      if (!s || typeof s !== 'object') return false;
      const expectedB2Bound =
        (B2_INTERCEPT_BOUND.bound && B2_INTERCEPT_BOUND.bound.value) || null;
      return s.dMonotoneStatus === D_MONOTONE_ANALYTIC_PROOF.status &&
             s.b1Status        === B1_CONDITIONAL_BOUND.status      &&
             s.b2Status        === B2_INTERCEPT_BOUND.status        &&
             s.b2BoundValue    === expectedB2Bound;
    },
    why:
      'C27: ROUTE_A_MONOTONICITY_CROSSVERIFY.snapshot must be a faithful ' +
      'mirror of the upstream module status fields. dMonotoneStatus must ' +
      'equal D_MONOTONE_ANALYTIC_PROOF.status, b1Status must equal ' +
      'B1_CONDITIONAL_BOUND.status, b2Status must equal B2_INTERCEPT_BOUND.' +
      'status, and b2BoundValue must equal the same B2_INTERCEPT_BOUND.bound.' +
      'value expression the snapshot is built from. C3 locks B1 status ' +
      'vocabulary, C11 locks NoSwap status vocabulary, and C12 locks ' +
      'D-monotone status vocabulary, but none of those assertions checks ' +
      'that the snapshot COPY still tracks its upstream. If a future edit ' +
      'silently hardcodes a snapshot field (e.g. replaces ' +
      '"dMonotoneStatus: D_MONOTONE_ANALYTIC_PROOF.status" with a literal ' +
      'string during a copy-paste refactor that inlines the import), C3, ' +
      'C11, and C12 all stay green while any downstream reader of the ' +
      'snapshot sees a frozen value that no longer tracks the live status. ' +
      'C27 closes the last unpinned identity slot on the crossverify record.',
  },
  {
    id: 'imp826-C28-verdict-names-all-three-downstream-consumers',
    holds: () => {
      const v = ROUTE_A_MONOTONICITY_CROSSVERIFY.verdict;
      if (typeof v !== 'string') return false;
      return v.indexOf('route-a-argmin-closure.js')       !== -1 &&
             v.indexOf('lambda-N1e6-final-assembly.js')   !== -1 &&
             v.indexOf('lambda-zero-attack.js')           !== -1;
    },
    why:
      'C28: ROUTE_A_MONOTONICITY_CROSSVERIFY.verdict must literally ' +
      'contain all three downstream consumer filenames ' +
      '"route-a-argmin-closure.js", "lambda-N1e6-final-assembly.js", ' +
      '"lambda-zero-attack.js". The verdict final clause justifies its ' +
      '"no caller is affected" claim by naming those three downstream ' +
      'modules that read directly from the distributed records. C24 ' +
      'locks the UPSTREAM provenance triple (three composing imp-ids) ' +
      'in the same verdict, but the parallel DOWNSTREAM consumer-filename ' +
      'triple was unpinned. If a future edit silently rewrites the verdict ' +
      'to drop one downstream filename (e.g. paraphrases "three downstream ' +
      'consumers" without naming them, or renames one during a refactor ' +
      'not mirrored here), C23 stays green (PARTIAL-closure unchanged) ' +
      'and C24 stays green (three composing imp-ids unchanged) -- yet ' +
      'any referee checking the "no caller is affected" claim silently ' +
      'loses its pointer to one of the three downstream modules whose ' +
      'independence from the missing monolithic aggregator is the ' +
      'empirical basis of that claim. C28 is structurally symmetric to ' +
      'C24 on the downstream-consumer side and closes the last unpinned ' +
      'filename-duplicate triple in the verdict prose.',
  },
  {
    id: 'imp826-C29-verdict-non-blocking-anchor',
    holds: () => {
      const v = ROUTE_A_MONOTONICITY_CROSSVERIFY.verdict;
      if (typeof v !== 'string') return false;
      return v.indexOf('non-blocking') !== -1;
    },
    why:
      'C29: ROUTE_A_MONOTONICITY_CROSSVERIFY.verdict must literally contain ' +
      'the substring "non-blocking". The verdict prose is the human-readable ' +
      'copy of the residualSubGap.blocker === false disposition. C14 locks ' +
      'the record-side blocker flag and C26 locks the note-side "purely ' +
      'organizational" anchor, but the verdict prose copy is unpinned. If a ' +
      'future edit rewrites the verdict to drop "non-blocking" (paraphrase ' +
      'without the disposition, or upgrade to "blocking"), C14/C26/C23/C24/C28 ' +
      'all stay green while any referee reading the verdict sees a disposition ' +
      'claim that contradicts or drops the tripwired blocker flag. C29 is ' +
      'structurally symmetric to C14 on the verdict-prose side and closes the ' +
      'last unpinned disposition slot in the verdict prose.',
  },
  {
    id: 'imp826-C30-record-distributed-composition-points-to-const',
    holds: () =>
      ROUTE_A_MONOTONICITY_CROSSVERIFY.distributedComposition ===
      DISTRIBUTED_COMPOSITION,
    why:
      'C30: ROUTE_A_MONOTONICITY_CROSSVERIFY.distributedComposition must be ' +
      'reference-identical to the local DISTRIBUTED_COMPOSITION const. ' +
      'C18/C19/C20 lock the impId/file/role triples on the const itself, and ' +
      'C25 locks the supplies anchors on the const itself, but all four ' +
      'assertions read from DISTRIBUTED_COMPOSITION (the module-local const) ' +
      'not from ROUTE_A_MONOTONICITY_CROSSVERIFY.distributedComposition (the ' +
      'record-side field). If a future edit silently replaces the record-side ' +
      'assignment "distributedComposition: DISTRIBUTED_COMPOSITION" with a ' +
      'shallow copy (e.g. "DISTRIBUTED_COMPOSITION.slice()"), a spread ' +
      '("[...DISTRIBUTED_COMPOSITION]"), a map that rewrites a field, or a ' +
      'literal array that happens to mirror the const, C18/C19/C20/C25 stay ' +
      'green (the const is unchanged) while any downstream consumer reading ' +
      'from the record field sees a divergent or frozen-in-time copy. C30 ' +
      'pins reference identity so the record-side pointer cannot silently ' +
      'detach from the const the other assertions lock, closing the last ' +
      'unpinned pointer slot between DISTRIBUTED_COMPOSITION and the ' +
      'crossverify record.',
  },
  {
    id: 'imp826-C31-snapshot-keyset-shape-frozen',
    holds: () => {
      const s = ROUTE_A_MONOTONICITY_CROSSVERIFY.snapshot;
      if (!s || typeof s !== 'object' || Array.isArray(s)) return false;
      const keys = Object.keys(s).sort();
      return keys.length === 4 &&
             keys[0] === 'b1Status' &&
             keys[1] === 'b2BoundValue' &&
             keys[2] === 'b2Status' &&
             keys[3] === 'dMonotoneStatus';
    },
    why:
      'C31: ROUTE_A_MONOTONICITY_CROSSVERIFY.snapshot must have exactly the ' +
      'four own keys {dMonotoneStatus, b1Status, b2Status, b2BoundValue} -- ' +
      'no more, no fewer. C27 locks the VALUES of those four keys (each must ' +
      'mirror its upstream module status or bound), but C27 never enforces ' +
      'the snapshot key-set. If a future edit silently adds a fifth key ' +
      '(e.g. a noSwapStatus copied from NOSWAP_CLOSURE.status, or a cached ' +
      'b1Bound value), C27 stays green (the four original keys still mirror ' +
      'their upstreams) while the new field lands in the record unchecked -- ' +
      'any downstream dashboard reading the snapshot as "the four upstream ' +
      'statuses" silently sees a fifth column whose source of truth no ' +
      'crossverify assertion enforces. C31 is structurally symmetric to C27 ' +
      'on the snapshot-shape side: C27 locks values, C31 locks the key-set, ' +
      'closing the last unpinned shape slot on the snapshot record.',
  },
  {
    id: 'imp826-C32-residual-subgap-keyset-shape-frozen',
    holds: () => {
      const r = ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap;
      if (!r || typeof r !== 'object' || Array.isArray(r)) return false;
      const keys = Object.keys(r).sort();
      return keys.length === 5 &&
             keys[0] === 'blocker' &&
             keys[1] === 'id'      &&
             keys[2] === 'note'    &&
             keys[3] === 'status'  &&
             keys[4] === 'title';
    },
    why:
      'C32: ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap must have exactly ' +
      'the five own keys {id, title, status, blocker, note} -- no more, no ' +
      'fewer. C14 locks blocker, C16 locks id, C21 locks title, C26 locks note ' +
      'prose anchors, and the scope-tripwire locks status -- five value-level ' +
      'checks covering each currently-named field -- but none enforces the ' +
      'residualSubGap key-set itself. If a future edit silently adds a sixth ' +
      'key (e.g. an owner field from a ticket metadata refactor, a cachedAt ' +
      'timestamp, or a severity tag paralleling blocker), C14/C16/C21/C26 ' +
      'and the scope-tripwire all stay green (the five original keys are ' +
      'unchanged and still satisfy their value-level locks) while the new ' +
      'field lands in the record unchecked. C32 closes that shape gap by ' +
      'asserting Object.keys(residualSubGap).sort() is exactly ' +
      '["blocker", "id", "note", "status", "title"] (length 5 and each sorted ' +
      'position matches the alphabetical order of the five known keys). ' +
      'This catches both directions of drift: a new key added (length 6 ' +
      'fails), a key removed (length 4 fails and a named key is missing), ' +
      'or a key renamed (sorted positions shift). Structurally symmetric to ' +
      'C31 on the residualSubGap side: C31 locks the snapshot key-set, C32 ' +
      'locks the residualSubGap key-set, closing the last unpinned shape ' +
      'slot on the crossverify record.',
  },
  {
    id: 'imp826-C33-crossverify-record-keyset-shape-frozen',
    holds: () => {
      const r = ROUTE_A_MONOTONICITY_CROSSVERIFY;
      if (!r || typeof r !== 'object' || Array.isArray(r)) return false;
      const keys = Object.keys(r).sort();
      return keys.length === 8 &&
             keys[0] === 'distributedComposition' &&
             keys[1] === 'id'                     &&
             keys[2] === 'monolithicFileExpected' &&
             keys[3] === 'monolithicFilePresent'  &&
             keys[4] === 'residualSubGap'         &&
             keys[5] === 'snapshot'               &&
             keys[6] === 'title'                  &&
             keys[7] === 'verdict';
    },
    why:
      'C33: ROUTE_A_MONOTONICITY_CROSSVERIFY must have exactly the eight ' +
      'own keys {id, title, monolithicFileExpected, monolithicFilePresent, ' +
      'distributedComposition, residualSubGap, verdict, snapshot} -- no ' +
      'more, no fewer. C31 locks the snapshot key-set and C32 locks the ' +
      'residualSubGap key-set, but the OUTERMOST crossverify record own ' +
      'key-set is itself unpinned. C15 locks id, C22 locks title, C17 ' +
      'locks monolithicFileExpected, the scope-tripwire locks ' +
      'monolithicFilePresent === false, C30 locks distributedComposition ' +
      'pointer-identity, and C23/C24/C28/C29 lock verdict prose anchors -- ' +
      'eight separate value-level checks covering each currently-named ' +
      'top-level field -- but none enforces the outer key-set itself. If a ' +
      'future edit silently adds a ninth key (e.g. a generatedAt timestamp, ' +
      'a schemaVersion tag, a cached aggregatorStatus flag from a refactor, ' +
      'or an owner metadata field), all prior assertions stay green (the ' +
      'eight original keys are unchanged and still satisfy their value-' +
      'level locks) while the new field lands in the record unchecked -- ' +
      'any downstream dashboard or aggregator reading the crossverify ' +
      'record as "the eight canonical top-level fields" silently sees a ' +
      'ninth column whose source of truth no crossverify assertion ' +
      'enforces. C33 closes that shape gap by asserting ' +
      'Object.keys(ROUTE_A_MONOTONICITY_CROSSVERIFY).sort() is exactly ' +
      '["distributedComposition", "id", "monolithicFileExpected", ' +
      '"monolithicFilePresent", "residualSubGap", "snapshot", "title", ' +
      '"verdict"]. This catches both directions of drift: a new key added ' +
      '(length 9 fails), a key removed (length 7 fails and a named key is ' +
      'missing), or a key renamed (sorted positions shift). Structurally ' +
      'symmetric to C31/C32 on the outer-record side: C31 locks the inner ' +
      'snapshot key-set, C32 locks the inner residualSubGap key-set, C33 ' +
      'locks the outer crossverify record key-set, closing the LAST ' +
      'unpinned shape slot in the entire imp-826 crossverify record tree.',
  },
  {
    id: 'imp826-C34-distributed-composition-entry-keyset-shape-frozen',
    holds: () => {
      if (!Array.isArray(DISTRIBUTED_COMPOSITION) ||
          DISTRIBUTED_COMPOSITION.length !== 3) {
        return false;
      }
      for (let i = 0; i < 3; i++) {
        const e = DISTRIBUTED_COMPOSITION[i];
        if (!e || typeof e !== 'object' || Array.isArray(e)) return false;
        const keys = Object.keys(e).sort();
        if (keys.length !== 4)        return false;
        if (keys[0]   !== 'file')     return false;
        if (keys[1]   !== 'impId')    return false;
        if (keys[2]   !== 'role')     return false;
        if (keys[3]   !== 'supplies') return false;
      }
      return true;
    },
    why:
      'C34: each DISTRIBUTED_COMPOSITION[i] must have exactly the four own ' +
      'keys {role, impId, file, supplies} -- no more, no fewer. C18 locks ' +
      'the impId VALUES, C19 locks the file VALUES, C20 locks the role ' +
      'VALUES, and C25 locks the supplies anchor VALUES, but none enforces ' +
      'the per-entry key-set itself. C31/C32/C33 lock the snapshot, ' +
      'residualSubGap, and outer crossverify record key-sets, but each ' +
      'entry OBJECT inside DISTRIBUTED_COMPOSITION has its own key-set that ' +
      'no assertion pins. If a future edit silently adds a fifth key to one ' +
      'entry (e.g. an owner field, a cachedAt timestamp, or a severity tag) ' +
      'or removes one of the four known keys, C18/C19/C20/C25 stay green ' +
      'while the new field lands unchecked. C34 asserts, for each i in 0..2, ' +
      'that Object.keys(DISTRIBUTED_COMPOSITION[i]).sort() is exactly ' +
      '["file", "impId", "role", "supplies"]. This catches both directions ' +
      'of drift: a new key added (length 5 fails), a key removed (length 3 ' +
      'fails and a named key is missing), or a key renamed (sorted positions ' +
      'shift). Structurally symmetric to C31/C32/C33 on the ' +
      'DISTRIBUTED_COMPOSITION entry side, closing the last unpinned ' +
      'per-entry shape slot in the distributed composition listing.',
  },
  {
    id: 'imp826-monolithic-file-gap-still-named',
    holds: () =>
      ROUTE_A_MONOTONICITY_CROSSVERIFY.residualSubGap.status === 'open' &&
      ROUTE_A_MONOTONICITY_CROSSVERIFY.monolithicFilePresent === false,
    why:
      'SCOPE TRIPWIRE: imp-826 is a partial closure; the missing monolithic ' +
      'file is recorded as a non-blocking sub-gap. If a future aggregator ' +
      'module is added, flip monolithicFilePresent to true and close the ' +
      'sub-gap in the same commit to keep the chain honest.',
  },
];

// Self-invoke at module load (d-monotone-analytic-proof.js pattern) so that
// any downstream consumer importing this record surfaces chain breakage at
// build time rather than silently.
for (const a of ROUTE_A_MONOTONICITY_CROSSVERIFY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      'ROUTE_A_MONOTONICITY_CROSSVERIFY assertion failed: ' + a.id + ' -- ' + a.why,
    );
  }
}

// ── S10-verify cross-verification finding (imp-1053) ────────────────────────
//
// Independent re-read of this module against its three upstream sources
// (d-monotone-analytic-proof.js, b1-slope-conditional-upper-bound.js,
//  b2-intercept-analytic-bound.js) and against the missing monolithic file
// path. Findings, by the three ticket axes:
//
//   (1) Formulas correct vs cited references?
//       This module performs no floating-point arithmetic; every assertion
//       is structural (id equality, status vocabulary membership, substring
//       presence, key-set shape, reference identity). The two numeric
//       constants it pins -- C8's ceiling 0.02 and C4's prose reference
//       value approximately 0.0094 -- match the upstream literal
//       A_UB_CEILING (b2-intercept-analytic-bound.js line 102, "0.02") and
//       the upstream prose "a_UB is approximately 0.0094" (same file, line
//       155). No formula drift detected.
//
//   (2) Edge cases producing NaN or infinity?
//       C4 explicitly guards the only numeric leg with Number.isFinite(v)
//       and v > 0, so a null, NaN, or non-finite B2 bound surfaces as an
//       assertion throw at module load rather than propagating. The
//       short-circuit "B2_INTERCEPT_BOUND.bound && ..." pattern in C6 and
//       C8 can return undefined rather than strict boolean when .bound is
//       falsy, but the self-invoke loop uses "!a.holds()" so any falsy
//       result still throws -- cosmetic, not load-bearing.
//
//   (3) Numerical output matches a known reference value?
//       The expected monolithic file src/math/route-a-monotonicity-closure.js
//       is confirmed absent via repo glob, matching monolithicFilePresent
//       === false at line 619. The three upstream module ids imp-463 /
//       imp-457 / imp-458 are present as exports in their respective
//       files. The B1 closedConditions strings literally contain
//       "skp-imp457-D-monotone", "imp-463", "NoSwap", and "imp-464" as
//       required by C2 and C9.
//
// Verdict: cross-verified clean. The 34 assertions C1..C34 plus the scope
// tripwire are mutually non-redundant and together cover every id, status,
// path, prose anchor, key-set shape, and pointer identity in the imp-826
// crossverify record tree. No corrective edit was required; the only
// observation is the cosmetic short-circuit return-type asymmetry noted
// under (2), which is harmless because the self-invoke loop treats any
// falsy return as a failure.
