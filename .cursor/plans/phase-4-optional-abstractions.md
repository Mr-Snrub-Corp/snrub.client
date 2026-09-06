# Phase 4 — Optional abstractions

Deferred after Phases 0–3 (shared primitives, FormField/PageShell/LoadingState, Vuelidate + toast + AuthCallback/go-back fixes).

**Do not start unless there is a concrete need.** Phases 1–3 removed the high-ROI duplication. This phase is larger structural change for smaller gain.

Guiding rule (same as earlier phases):

1. `npm run test` + `npm run build` green.
2. If a target has no test, add one covering current behavior first.
3. Extract / refactor. No behavior change.
4. Tests + build green again. Keep existing `data-testid`s.

Recommended order if you do come back: **4c first**, then 4b, skip 4a.

---

## 4a. `EmployeeFormFields.vue` — skip unless a third form appears

**Status:** low payoff. Do not extract yet.

Shared already:

- `emailRules` / `nameRules` / `passwordRules` in `src/constants/validation.ts`
- `enumToSelectOptions()` for role/status
- `FormField.vue` for label + error

What is still duplicated: the email / name / role / status **markup** in:

- [src/views/dashboard/employees/EmployeeNew.vue](src/views/dashboard/employees/EmployeeNew.vue)
- [src/views/dashboard/employees/EmployeeEdit.vue](src/views/dashboard/employees/EmployeeEdit.vue)

What would stay in the views anyway:

- New-only password field
- Edit-only avatar upload + `isUserEditMode` (disables email/role/status)
- Different `data-testid`s (`employees.new-form.*` vs `employees.edit-form.*`) and error ids

A shared component would need `testidPrefix` / `errorIdPrefix` plus a `disabled` flag for two call sites. Not worth the API.

Revisit only if a third employee form (e.g. profile self-edit) would reuse the same four fields.

---

## 4b. `useEntityForm` — optional, edit views only

**Problem:** mount → fetch → `initFormData` → submit is hand-rolled in:

- [EmployeeEdit.vue](src/views/dashboard/employees/EmployeeEdit.vue) — `isLoading`, `initFormData()`, `onMounted` fetch
- [IncidentReportEdit.vue](src/views/dashboard/incidents/IncidentReportEdit.vue) — same shape

Detail views (`EmployeeDetail`, `IncidentReportDetail`) only do fetch + loading, not form init. Do not force them into this composable.

**Proposed API (keep it thin — only what both edit views share):**

```ts
useEntityForm({
  fetch: () => Promise<void>,
  init: () => void,
})
// returns { isLoading }
// onMounted: isLoading=true → await fetch() → init() → isLoading=false
```

Submit stays in the view (different store actions, payloads, toast copy, navigate targets). Do not invent a generic `submit` wrapper unless both handlers become identical.

**Do not add** unused options, cache checks, or abort controllers unless a view already needs them.

**Tests:** existing `EmployeeEdit.int.spec.ts` and `IncidentReportEdit.int.spec.ts` must stay green. Add a small unit spec beside the composable for the mount/fetch/init order.

---

## 4c. Split `ReactorMonitoring.vue` — highest remaining payoff

**File:** [src/views/dashboard/reactor-monitoring/ReactorMonitoring.vue](src/views/dashboard/reactor-monitoring/ReactorMonitoring.vue) (~520 lines).

Six near-identical KPI + chart cards (reactor power, core temp, radiation, coolant pressure, coolant flow) plus a doughnut for containment. Script mixes:

- `useReactorTelemetry()` wiring (keep)
- `cssVar` / `statusColor` / `statusBg` (Chart.js cannot read CSS vars)
- six threshold computeds
- `makeLineOptions` / `makeLineDataset` / per-metric chart data

### Extract

1. **`ReactorMetricCard.vue`** — presentational card: title, kpi value + unit, icon, status Tag, chart slot.
   - Keep existing testids on the **same rendered elements**. Pass them as props from static config (allowed: bindings from static config, not runtime/user data). Example:

     ```
     reactor-monitoring.reactor-power.kpi-value
     reactor-monitoring.reactor-power.status-badge
     reactor-monitoring.reactor-power.chart
     ```

     Registry: `.cursor/rules/data-testid-convention.mdc`.

2. **`useReactorCharts`** (or keep helpers in `src/utils/reactor.ts` if they stay pure) — `cssVar`, status color maps, `makeLineOptions`, `makeLineDataset`. Threshold functions can live next to telemetry types as a small map (`{ danger, warning }` per metric) instead of six copy-pasted computeds.

3. **Config array** in the view (or a `reactorMetrics.ts` constant) listing the five line metrics: id, title, unit, icon, buffer, status, chart min/max, testids. View becomes: telemetry + `v-for` of `ReactorMetricCard` + the containment doughnut (different chart type — leave as its own block).

### Do not

- Change threshold numbers or chart options.
- Stub Chart.js in a way that drops the existing `data-testid` chart containers.
- Add tests to this repo for Playwright flows (e2e lives in `snrub.e2e`). A unit spec for any new pure threshold/chart helpers is enough; the view itself is still untested (owned by `docs/testing-strategy.md` P3 backfill).

---

## Out of scope

- Coverage ratchet / list-page integration tests — `docs/testing-strategy.md`
- Design sandbox views (`src/views/dashboard/design/**`)
- New form abstractions beyond the two edit views
