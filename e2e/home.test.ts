import { expect, test } from '@playwright/test';

test.describe('home', () => {
  test('should render example component', async ({ page }) => {
    await page.goto('/');

    const exampleComponent = page.getByText('Component Example');

    await expect(exampleComponent).toBeVisible();
  });
});
