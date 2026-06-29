import React from 'react';
import { configure, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';
import { SuperBlocks } from '@freecodecamp/shared/config/curriculum';

import i18nTestConfig from '../../../../i18n/config-for-tests';
import translations from '../../../../i18n/locales/english/translations.json';
import LowerJaw from './lower-jaw';

vi.unmock('react-i18next');

i18nTestConfig.addResourceBundle(
  'en',
  'translations',
  translations,
  true,
  true
);

vi.mock('../../../analytics/call-ga', () => ({
  default: vi.fn()
}));

vi.mock('../../../components/Progress', () => ({
  default: () => <div data-testid='progress-bar' />
}));

vi.mock('../../../components/share', () => ({
  Share: () => <div data-testid='share-buttons' />
}));

vi.mock('../../../utils/get-words', () => ({
  randomCompliment: () => 'Great work!'
}));

const desktopWidth = 1024;
const mobileWidth = 393;

const challengeMeta = {
  id: '5dc17dc8f86c76b9248c6eb5',
  block: 'learn-html-by-building-a-cat-photo-app',
  challengeType: 0,
  superBlock: SuperBlocks.RespWebDesign
};

function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width
  });
}

function createTestStore() {
  return createStore(() => ({
    app: {
      user: {
        sessionUser: {
          completedChallenges: []
        }
      }
    },
    challenge: {
      challengeMeta
    }
  }));
}

const baseProps = {
  attempts: 0,
  challengeIsCompleted: false,
  hint: '',
  isSignedIn: true,
  openHelpModal: vi.fn(),
  openResetModal: vi.fn(),
  testsLength: 2,
  tryToExecuteChallenge: vi.fn(),
  tryToSubmitChallenge: vi.fn(),
  updateContainer: vi.fn()
};

function renderLowerJaw(props: Partial<typeof baseProps> = {}) {
  const view = render(
    <Provider store={createTestStore()}>
      <I18nextProvider i18n={i18nTestConfig}>
        <LowerJaw {...baseProps} {...props} />
      </I18nextProvider>
    </Provider>
  );

  return {
    ...view,
    props: {
      ...baseProps,
      ...props
    }
  };
}

describe('<LowerJaw />', () => {
  beforeAll(() => {
    configure({ testIdAttribute: 'data-playwright-test-label' });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    setViewportWidth(desktopWidth);
  });

  afterAll(() => {
    configure({ testIdAttribute: 'data-testid' });
  });

  it('renders the initial check and submit button states', () => {
    renderLowerJaw();

    expect(
      screen.getByRole('button', {
        name: translations.buttons['check-code-ctrl']
      })
    ).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('lowerJaw-submit-button')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('uses mobile button labels on narrow screens', () => {
    setViewportWidth(mobileWidth);

    renderLowerJaw();

    expect(
      screen.getByRole('button', {
        name: translations.buttons['check-code']
      })
    ).toBeInTheDocument();
  });

  it('uses submit button labels based on viewport width', () => {
    const { rerender } = renderLowerJaw({ challengeIsCompleted: true });

    expect(
      screen.getByRole('button', {
        name: translations.buttons['submit-and-go-ctrl']
      })
    ).toBeInTheDocument();

    setViewportWidth(mobileWidth);
    rerender(
      <Provider store={createTestStore()}>
        <I18nextProvider i18n={i18nTestConfig}>
          <LowerJaw {...baseProps} challengeIsCompleted={true} />
        </I18nextProvider>
      </Provider>
    );

    expect(
      screen.getByRole('button', {
        name: translations.buttons['submit-and-go']
      })
    ).toBeInTheDocument();
  });

  it('renders failing feedback and hint text', () => {
    renderLowerJaw({
      attempts: 1,
      hint: '<p>Try adding an h2 element.</p>'
    });

    expect(
      screen.getByText(translations.learn['sorry-keep-trying'])
    ).toBeInTheDocument();
    expect(screen.getByText('Try adding an h2 element.')).toBeInTheDocument();
  });

  it('wires reset and help buttons', async () => {
    const user = userEvent.setup();
    const openHelpModal = vi.fn();
    const openResetModal = vi.fn();

    renderLowerJaw({
      attempts: 3,
      hint: '<p>Try adding an h2 element.</p>',
      openHelpModal,
      openResetModal
    });

    await user.click(
      screen.getByRole('button', { name: translations.buttons.reset })
    );
    await user.click(
      screen.getByRole('button', { name: translations.buttons.help })
    );

    expect(openResetModal).toHaveBeenCalledOnce();
    expect(openHelpModal).toHaveBeenCalledOnce();
  });

  it('prompts signed-out campers to sign in after completion', () => {
    renderLowerJaw({
      challengeIsCompleted: true,
      isSignedIn: false
    });

    expect(
      screen.getByRole('link', { name: translations.learn['sign-in-save'] })
    ).toHaveAttribute('href', expect.stringMatching(/\/signin$/));
  });
});
