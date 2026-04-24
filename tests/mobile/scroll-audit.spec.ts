import { test, expect } from "@playwright/test"

// Routes audited at 375×667 (iPhone SE). Slugs resolved autonomously from GET /api/events?limit=24
// (auto-mode W2-1 resolution): shortest title, longest title, and median-length title as
// representative samples. All 24 synthetic seeds have image_url=null, so no image-bearing slug
// is available — documented in 04-02-SUMMARY.md (Open Q3 closure).
// "/" is included defensively per RESEARCH Open Q1 — 404-skip guard handles non-resolution.
const PUBLIC_ROUTES = [
  "/",
  "/home",
  "/events",
  "/events/payco-homeplus-202604",
  "/events/naverpay-oliveyoung-202604",
  "/events/naverpay-starbucks-202604",
  "/categories",
  "/newsletter",
  "/submit",
  "/about",
  "/privacy",
] as const

test.describe("Phase 4 Success #3 — zero horizontal scroll at 375×667", () => {
  test.use({ viewport: { width: 375, height: 667 } })

  for (const route of PUBLIC_ROUTES) {
    test(`no horizontal overflow at 375px: ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "networkidle" })
      // Skip the assertion on 404 pages — they're out of scope
      if (response && response.status() === 404) {
        test.skip(true, `${route} returned 404 — not built yet`)
      }
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement
        return doc.scrollWidth - doc.clientWidth
      })
      expect(overflow, `${route} has ${overflow}px horizontal overflow`).toBeLessThanOrEqual(0)
    })
  }
})
