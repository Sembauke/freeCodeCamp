import { test, expect } from '@playwright/test';
import { clearEditor, focusEditor, getEditors } from './utils/editor';
import { signout } from './utils/logout';

// Test the lower jaw on mobile viewport only
test.use({
  viewport: { width: 393, height: 851 },
  isMobile: true
});

test('Click on the "check your code" button', async ({ page }) => {
  await page.goto(
    '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-3'
  );
  const checkButton = page.getByRole('button', { name: 'Check Your Code' });

  await checkButton.click();

  const failing = page.getByTestId('lowerJaw-failing-test-feedback');
  const hint = page.getByTestId('lowerJaw-failing-hint');
  await expect(failing).toBeVisible();
  await expect(hint).toBeVisible();
});

test('Resets the lower jaw when prompted', async ({ page }) => {
  await page.goto(
    '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-3'
  );
  const checkButton = page.getByRole('button', { name: 'Check Your Code' });

  await checkButton.click();

  const failing = page.getByTestId('lowerJaw-failing-test-feedback');
  const hint = page.getByTestId('lowerJaw-failing-hint');
  await expect(failing).toBeVisible();
  await expect(hint).toBeVisible();

  await page.getByRole('button', { name: 'Reset' }).click();

  await expect(
    page.getByRole('dialog', { name: 'Reset this lesson?' })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Reset this lesson' }).click();
  await expect(failing).not.toBeVisible();
  await expect(hint).not.toBeVisible();

  await expect(checkButton).toBeVisible();
});

test('Checks hotkeys when instruction is focused', async ({
  page,
  browserName
}) => {
  await page.goto(
    '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-3'
  );
  const editor = getEditors(page);
  const checkButton = page.getByRole('button', { name: 'Check Your Code' });
  const description = page.locator('#description');

  await editor.fill(
    '<h2>Cat Photos</h2>\n<p>Everyone loves cute cats online!</p>'
  );

  await description.click();

  if (browserName === 'webkit') {
    await page.keyboard.press('Meta+Enter');
  } else {
    await page.keyboard.press('Control+Enter');
  }

  await expect(checkButton).not.toBeFocused();
});

test('Focuses on the submit button after tests passed', async ({
  page,
  browserName,
  isMobile
}) => {
  await page.goto(
    '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-3'
  );
  const editor = getEditors(page);
  const checkButton = page.getByRole('button', { name: 'Check Your Code' });
  const submitButton = page.getByRole('button', {
    name: 'Submit and go to next challenge'
  });
  await focusEditor({ page, isMobile });
  await clearEditor({ page, browserName, isMobile });

  await editor.fill(
    '<h2>Cat Photos</h2>\n<p>Everyone loves cute cats online!</p>'
  );
  await checkButton.click();

  await expect(submitButton).toBeFocused();
});

test('Prompts unauthenticated user to sign in to save progress', async ({
  page,
  browserName,
  isMobile
}) => {
  await page.goto(
    '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-3'
  );
  await signout(page);
  await page.reload();
  const editor = getEditors(page);
  const checkButton = page.getByRole('button', { name: 'Check Your Code' });
  const loginButton = page.getByRole('link', {
    name: 'Sign in to save your progress'
  });
  await focusEditor({ page, isMobile });
  await clearEditor({ page, browserName, isMobile });

  await editor.fill(
    '<h2>Cat Photos</h2>\n<p>Everyone loves cute cats online!</p>'
  );

  await checkButton.click();

  await expect(loginButton).toBeVisible();

  await loginButton.click();

  await page.goBack();

  await expect(loginButton).not.toBeVisible();
});

test('Hint text should not contain placeholders `fcc-expected`', async ({
  page,
  isMobile,
  browserName
}) => {
  await page.goto(
    'learn/2022/responsive-web-design/learn-css-transforms-by-building-a-penguin/step-4'
  );
  const editor = getEditors(page);
  const checkButton = page.getByRole('button', { name: 'Check Your Code' });
  await focusEditor({ page, isMobile });
  await clearEditor({ page, browserName, isMobile });

  await editor.fill(
    'body{background:linear-gradient(45deg, rgb(118, 201, 255), rgb(247, 255, 222));margin:0;padding:0;width:5%;height:100vh}'
  );
  await checkButton.click();

  const failingHint = page.getByTestId('lowerJaw-failing-hint');
  const hintDescriptionElement = failingHint.locator('.hint-description');
  const hintDescription = hintDescriptionElement.locator('p');
  await expect(hintDescription).toContainText(
    'You should give body a width of 100%, but found 5%',
    { useInnerText: true }
  );
});
