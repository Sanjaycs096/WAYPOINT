import { test, expect } from '@playwright/test';

test.describe('Waypoint Complete User Journey & Screen Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Flow 1: Plan route, compare qualifying options, and start/complete guidance', async ({ page }) => {
    await page.goto('/');

    // Verify Screen 1 (Plan)
    await expect(page.locator('h1')).toContainText('Plan Your Campus Route');
    await expect(page.getByRole('button', { name: 'Find Accessible Routes' })).toBeVisible();

    // Select Origin and Destination
    await page.locator('#origin-select').selectOption({ label: 'Campus Center Plaza (CCP)' });
    await page.locator('#destination-select').selectOption({ label: 'University Main Library (LIB) • Central Quad' });

    // Toggle mandatory and optional filters independently
    const stepFreeCheckbox = page.locator('#mandatory-step-free');
    await expect(stepFreeCheckbox).toBeChecked();

    const quieterCheckbox = page.locator('#optional-quieter-paths');
    await quieterCheckbox.check();
    await expect(quieterCheckbox).toBeChecked();

    // Click Find Routes
    await page.getByRole('button', { name: 'Find Accessible Routes' }).click();

    // Verify Screen 2 (Route Results)
    await expect(page.locator('text=Screen 2 • Route Results & Comparison')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Qualifying Route Options/ })).toBeVisible();

    // Verify candidate routes list and schematic map
    const routeRadios = page.getByRole('radio');
    const count = await routeRadios.count();
    expect(count).toBeGreaterThan(0);

    // Select an alternate route card and verify selection
    if (count > 1) {
      await routeRadios.nth(1).click();
      await expect(routeRadios.nth(1)).toHaveAttribute('aria-checked', 'true');
    }

    // Start Route Guidance
    await page.getByRole('button', { name: 'Start Guidance for Selected Route' }).click();

    // Verify Screen 3 (Route Guidance)
    await expect(page.locator('text=Guided Wayfinding')).toBeVisible();
    await expect(page.locator('text=Immediate Directive')).toBeVisible();
    await expect(page.getByRole('progressbar', { name: /Step 1 of/ })).toBeVisible();

    // Step forward through guidance
    const nextButton = page.getByRole('button', { name: /Next Step|Arrive at Destination/ });
    await expect(nextButton).toBeVisible();

    // Click next until arrival
    while (await nextButton.isVisible()) {
      const buttonText = await nextButton.innerText();
      await nextButton.click();
      if (buttonText.includes('Arrive')) {
        break;
      }
      await page.waitForTimeout(100);
    }

    // Verify Arrival screen
    await expect(page.getByRole('heading', { name: 'You Have Arrived' })).toBeVisible();
    await expect(page.locator('text=100% Satisfied (Sample data)')).toBeVisible();

    // Finish and return to plan
    await page.getByRole('button', { name: 'Finish & Plan Another Route' }).click();
    await expect(page.locator('h1')).toContainText('Plan Your Campus Route');
  });

  test('Flow 2: Persona presets update controls transparently without silently weakening mandatory requirements', async ({ page }) => {
    await page.goto('/');

    // 1. Click Wheelchair User preset
    await page.getByRole('button', { name: /Wheelchair User/ }).click();
    await expect(page.locator('#mandatory-step-free')).toBeChecked();
    await expect(page.locator('#mandatory-elevator')).toBeChecked();
    await expect(page.locator('#mandatory-power-door')).toBeChecked();
    await expect(page.locator('#optional-gentle-slopes')).toBeChecked();

    // Verify live region announcement exists
    await expect(page.locator('[role="status"]')).toContainText('Applied Wheelchair User profile');

    // 2. Click Sensory Sensitive preset
    // CRITICAL REQUIREMENT: Must not silently weaken active mandatory rules
    await page.getByRole('button', { name: /Sensory Sensitive/ }).click();
    await expect(page.locator('#optional-quieter-paths')).toBeChecked();
    await expect(page.locator('#optional-sheltered-walkways')).toBeChecked();
    // Step-free rule remains protected and was not silently turned off!
    await expect(page.locator('#mandatory-step-free')).toBeChecked();
    await expect(page.locator('[role="status"]')).toContainText('Applied Sensory Sensitive profile');
  });

  test('Flow 3: Validation errors when origin and destination match or destination is missing', async ({ page }) => {
    await page.goto('/');

    // 1. Same building error
    await page.locator('#origin-select').selectOption({ label: 'Campus Center Plaza (CCP)' });
    await page.locator('#destination-select').selectOption({ label: 'Campus Center Plaza (CCP) • Central Quad' });
    await page.getByRole('button', { name: 'Find Accessible Routes' }).click();

    await expect(page.getByRole('alert')).toContainText('Origin and destination cannot be the same building.');

    // 2. Missing destination error
    await page.locator('#destination-select').selectOption('');
    await page.getByRole('button', { name: 'Find Accessible Routes' }).click();
    await expect(page.getByRole('alert')).toContainText('Please select a destination campus building to find routes.');
  });

  test('Flow 4: No qualifying route barrier inspection state', async ({ page }) => {
    await page.goto('/');

    // Fine Arts to North Science with strict wheelchair mandatory settings (stairs and unknown elevator)
    await page.locator('#origin-select').selectOption({ label: 'Fine Arts & Design Pavilion (FAD)' });
    await page.locator('#destination-select').selectOption({ label: 'North Science Complex (NSC) • North Campus' });

    await page.locator('#mandatory-step-free').check();
    await page.locator('#mandatory-elevator').check();
    await page.locator('#mandatory-power-door').check();

    await page.getByRole('button', { name: 'Find Accessible Routes' }).click();

    // Screen 2 shows the barrier fallback
    await expect(page.getByRole('heading', { name: 'No Fully Qualifying Routes Found' })).toBeVisible();
    await expect(page.locator('text=Identified Physical Barriers in Sample Data:')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adjust Constraints or Select Another Destination' })).toBeVisible();

    // Click Adjust constraints and verify return to Plan
    await page.getByRole('button', { name: 'Adjust Constraints or Select Another Destination' }).click();
    await expect(page.locator('h1')).toContainText('Plan Your Campus Route');
  });

  test('Flow 5: Inspect Location Details and set as destination', async ({ page }) => {
    await page.goto('/');

    // Find routes first
    await page.locator('#destination-select').selectOption({ label: 'University Main Library (LIB) • Central Quad' });
    await page.getByRole('button', { name: 'Find Accessible Routes' }).click();

    // Click Inspect Destination Accessibility
    await page.getByRole('button', { name: 'Inspect Destination Accessibility' }).click();

    // Screen 4: Location Details
    await expect(page.locator('h1')).toContainText('University Main Library');
    await expect(page.locator('text=Documented Entrances (Sample Data)')).toBeVisible();
    await expect(page.locator('text=Vertical Access & Elevators')).toBeVisible();

    // Click Set as Destination & Plan Route
    await page.getByRole('button', { name: 'Set as Destination & Plan Route' }).click();

    // Verify return to plan with destination set
    await expect(page.locator('h1')).toContainText('Plan Your Campus Route');
    await expect(page.locator('#destination-select')).toHaveValue('loc-library');
  });

  test('Flow 6: Preferences screen, localStorage persistence, and reset defaults', async ({ page }) => {
    await page.goto('/');

    // Navigate to Preferences
    await page.getByRole('button', { name: 'Preferences' }).click();

    // Screen 5: Preferences
    await expect(page.locator('h1')).toContainText('Accessibility Settings');

    // Modify a preference
    await page.locator('#pref-mandatory-elevator').check();
    await page.locator('#pref-optional-quieter-paths').check();

    // Save
    await page.getByRole('button', { name: 'Save Preferences to Browser' }).click();
    await expect(page.locator('[role="status"]')).toContainText('Preferences successfully saved');

    // Reload page to verify persistence
    await page.reload();

    // Verify persisted defaults on the home Plan screen
    await expect(page.locator('#mandatory-elevator')).toBeChecked();
    await expect(page.locator('#optional-quieter-paths')).toBeChecked();

    // Navigate to Preferences and verify form controls also reflect persisted settings
    await page.getByRole('button', { name: 'Preferences' }).click();
    await expect(page.locator('#pref-mandatory-elevator')).toBeChecked();
    await expect(page.locator('#pref-optional-quieter-paths')).toBeChecked();

    // Reset to defaults
    await page.getByRole('button', { name: 'Reset to Defaults' }).click();
    await expect(page.locator('[role="status"]')).toContainText('Preferences reset to default values.');

    // Verify form checkboxes reflect reset values
    await expect(page.locator('#pref-mandatory-elevator')).not.toBeChecked();
    await expect(page.locator('#pref-optional-quieter-paths')).not.toBeChecked();
    await expect(page.locator('#pref-mandatory-step-free')).toBeChecked(); // default is true
  });

  test('Flow 7: About & Data Transparency screen disclaimers', async ({ page }) => {
    await page.goto('/');

    // Navigate to About
    await page.getByRole('button', { name: 'About' }).click();

    // Screen 6: About
    await expect(page.locator('h1')).toContainText('About Waypoint');
    await expect(page.locator('text=Representative Sample Data Disclosure')).toBeVisible();
    await expect(page.locator('text=This prototype does not provide live GPS tracking')).toBeVisible();
    await expect(page.getByText('Waypoint is engineered around WCAG 2.1 AA digital accessibility standards')).toBeVisible();

    // Return to route planner
    await page.getByRole('button', { name: 'Return to Route Planner' }).click();
    await expect(page.locator('h1')).toContainText('Plan Your Campus Route');
  });
});
