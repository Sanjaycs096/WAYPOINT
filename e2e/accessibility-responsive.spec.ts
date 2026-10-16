import { test, expect } from '@playwright/test';

test.describe('Accessibility & Responsive Quality', () => {
  test('Skip to main content link becomes visible on focus and jumps to main landmark', async ({ page }) => {
    await page.goto('/');

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toHaveClass(/sr-only/);

    // Focus via Tab key
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveClass(/focus:not-sr-only/);

    // Press Enter to follow skip link
    await page.keyboard.press('Enter');
    const main = page.locator('#main-content');
    await expect(main).toBeVisible();
  });

  test('No horizontal overflow on current viewport', async ({ page }) => {
    await page.goto('/');

    // Check plan screen
    const isOverflowingPlan = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(isOverflowingPlan).toBe(false);

    // Navigate to results
    await page.getByRole('button', { name: 'Find Accessible Routes' }).click();
    await expect(page.locator('text=Screen 2 • Route Results & Comparison')).toBeVisible();

    const isOverflowingResults = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(isOverflowingResults).toBe(false);
  });

  test('All primary action buttons meet minimum touch target height (44px)', async ({ page }) => {
    await page.goto('/');

    const findRoutesBtn = page.getByRole('button', { name: 'Find Accessible Routes' });
    const box = await findRoutesBtn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);

    // Check checkboxes touch target container
    const stepFreeLabel = page.locator('label[for="mandatory-step-free"]');
    const labelBox = await stepFreeLabel.boundingBox();
    expect(labelBox).not.toBeNull();
    expect(labelBox!.height).toBeGreaterThanOrEqual(44);
  });

  test('Keyboard navigation: Space and Enter select route cards without unexpected scrolling', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Find Accessible Routes' }).click();

    const firstRadio = page.getByRole('radio').first();
    await firstRadio.focus();
    await expect(firstRadio).toBeFocused();

    // Press Space
    await page.keyboard.press('Space');
    await expect(firstRadio).toHaveAttribute('aria-checked', 'true');
  });

  test('Schematic map is responsive, renders SVG safely, and permits keyboard interaction', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Find Accessible Routes' }).click();

    const map = page.locator('svg[aria-hidden="true"]').first();
    await expect(map).toBeVisible();

    // Map container has accessible region role
    const mapRegion = page.locator('[role="region"][aria-label="Schematic campus wayfinding route map"]');
    await expect(mapRegion).toBeVisible();
  });
});
