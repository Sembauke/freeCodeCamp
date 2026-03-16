import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';
import translations from '../client/i18n/locales/english/translations.json';
import { clearEditor, focusEditor } from './utils/editor';

const certProjectUrl =
  '/learn/2022/responsive-web-design/build-a-tribute-page-project/build-a-tribute-page';
const blockUrl = '/learn/2022/responsive-web-design';

test.describe('Exit cert project modal', () => {
  test.beforeEach(async ({ page }) => {
    execSync('node ../tools/scripts/seed/seed-demo-user --certified-user');
    await page.goto(certProjectUrl);
  });

  test('does not show the modal when navigating away without making changes', async ({
    page
  }) => {
    await page.getByRole('link', { name: /responsive web design/i }).click();

    await expect(
      page.getByRole('dialog', {
        name: translations.learn['cert-project']['exit-modal-header']
      })
    ).not.toBeVisible();

    await expect(page).not.toHaveURL(certProjectUrl);
  });

  test('shows the modal when navigating away after editing code', async ({
    page,
    isMobile,
    browserName
  }) => {
    await focusEditor({ page, isMobile });
    await clearEditor({ page, browserName });
    await page.keyboard.type('unsaved change');

    await page.getByRole('link', { name: /responsive web design/i }).click();

    await expect(
      page.getByRole('dialog', {
        name: translations.learn['cert-project']['exit-modal-header']
      })
    ).toBeVisible();

    await expect(
      page.getByText(translations.learn['cert-project']['exit-modal-body'])
    ).toBeVisible();
  });

  test('"Stay and save" button closes the modal and keeps the user on the page', async ({
    page,
    isMobile,
    browserName
  }) => {
    await focusEditor({ page, isMobile });
    await clearEditor({ page, browserName });
    await page.keyboard.type('unsaved change');

    await page.getByRole('link', { name: /responsive web design/i }).click();

    await page
      .getByRole('button', {
        name: translations.learn['cert-project']['exit-modal-no']
      })
      .click();

    await expect(
      page.getByRole('dialog', {
        name: translations.learn['cert-project']['exit-modal-header']
      })
    ).not.toBeVisible();

    await expect(page).toHaveURL(certProjectUrl);
  });

  test('"Leave without saving" button navigates away and closes the modal', async ({
    page,
    isMobile,
    browserName
  }) => {
    await focusEditor({ page, isMobile });
    await clearEditor({ page, browserName });
    await page.keyboard.type('unsaved change');

    await page.getByRole('link', { name: /responsive web design/i }).click();

    await page
      .getByRole('button', {
        name: translations.learn['cert-project']['exit-modal-yes']
      })
      .click();

    await expect(
      page.getByRole('dialog', {
        name: translations.learn['cert-project']['exit-modal-header']
      })
    ).not.toBeVisible();

    await expect(page).toHaveURL(blockUrl);
  });

  test('does not show modal after saving code then navigating away', async ({
    page,
    isMobile,
    browserName
  }) => {
    await focusEditor({ page, isMobile });
    await clearEditor({ page, browserName });
    await page.keyboard.type('saved change');

    await page
      .getByRole('button', { name: translations.buttons['save'] })
      .click();

    await expect(page.getByTestId('flash-message')).toContainText(
      /Your code was saved/
    );

    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByTestId('flash-message')).not.toBeVisible();

    await page.getByRole('link', { name: /responsive web design/i }).click();

    await expect(
      page.getByRole('dialog', {
        name: translations.learn['cert-project']['exit-modal-header']
      })
    ).not.toBeVisible();

    await expect(page).not.toHaveURL(certProjectUrl);
  });
});
