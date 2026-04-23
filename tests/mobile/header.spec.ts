import { test, expect } from "@playwright/test"

const NAV_LINKS = [
  { href: "/home", label: "홈" },
  { href: "/events", label: "이벤트" },
  { href: "/categories", label: "카테고리" },
  { href: "/about", label: "소개" },
  { href: "/submit", label: "이벤트 제보" },
] as const

test.describe("MOBILE-01 — Hamburger drawer (375px)", () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test("hamburger visible at 375px on /home", async ({ page }) => {
    await page.goto("/home")
    const trigger = page.getByRole("button", { name: /메뉴/ })
    await expect(trigger).toBeVisible()
  })

  test("drawer opens on click", async ({ page }) => {
    await page.goto("/home")
    await page.getByRole("button", { name: /메뉴/ }).click()
    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    for (const link of NAV_LINKS) {
      await expect(dialog.getByRole("link", { name: link.label, exact: true })).toBeVisible()
    }
  })

  test("drawer nav — each link navigates to target route", async ({ page }) => {
    for (const link of NAV_LINKS) {
      await page.goto("/home")
      await page.getByRole("button", { name: /메뉴/ }).click()
      const dialog = page.getByRole("dialog")
      await expect(dialog).toBeVisible()
      await dialog.getByRole("link", { name: link.label, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`${link.href}$`))
    }
  })

  test("drawer closes on nav link click", async ({ page }) => {
    await page.goto("/home")
    await page.getByRole("button", { name: /메뉴/ }).click()
    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await dialog.getByRole("link", { name: "이벤트", exact: true }).click()
    await expect(page.getByRole("dialog")).toBeHidden()
  })

  test("ESC closes drawer", async ({ page }) => {
    await page.goto("/home")
    await page.getByRole("button", { name: /메뉴/ }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog")).toBeHidden()
  })
})

test.describe("MOBILE-01 — Desktop (≥ 640px) keeps existing actions", () => {
  test.use({ viewport: { width: 1024, height: 768 } })

  test("hamburger hidden at 1024px; 뉴스레터 구독 link visible", async ({ page }) => {
    await page.goto("/home")
    await expect(page.getByRole("button", { name: /메뉴/ })).toBeHidden()
    await expect(page.getByRole("link", { name: "뉴스레터 구독" })).toBeVisible()
  })
})
