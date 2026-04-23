import { test, expect } from "@playwright/test"

test.describe("MOBILE-02 — Filter bar collapse (/events)", () => {
  test.describe("mobile (375px)", () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test("collapsed default — toggle visible, filter chips hidden", async ({ page }) => {
      await page.goto("/events")
      await page.waitForLoadState("networkidle")
      const toggle = page.getByRole("button", { name: /필터/ })
      await expect(toggle).toBeVisible()
      // 결제사 "전체" button lives inside the filter panel; collapsed = hidden
      const providerAll = page.getByRole("button", { name: "전체" }).first()
      await expect(providerAll).toBeHidden()
    })

    test("expand on tap — filter chips become visible", async ({ page }) => {
      await page.goto("/events")
      await page.waitForLoadState("networkidle")
      await page.getByRole("button", { name: /필터/ }).click()
      const providerAll = page.getByRole("button", { name: "전체" }).first()
      await expect(providerAll).toBeVisible()
    })

    test("collapse again on second tap", async ({ page }) => {
      await page.goto("/events")
      await page.waitForLoadState("networkidle")
      const toggle = page.getByRole("button", { name: /필터/ })
      await toggle.click()
      await expect(page.getByRole("button", { name: "전체" }).first()).toBeVisible()
      await toggle.click()
      await expect(page.getByRole("button", { name: "전체" }).first()).toBeHidden()
    })
  })

  test.describe("desktop (≥ 640px)", () => {
    test.use({ viewport: { width: 1024, height: 768 } })

    test("always expanded — toggle hidden, chips visible without interaction", async ({ page }) => {
      await page.goto("/events")
      await page.waitForLoadState("networkidle")
      await expect(page.getByRole("button", { name: /필터/ })).toBeHidden()
      // 결제사 "전체" button visible immediately on load
      await expect(page.getByRole("button", { name: "전체" }).first()).toBeVisible()
    })
  })
})
