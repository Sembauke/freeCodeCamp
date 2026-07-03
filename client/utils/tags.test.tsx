import i18next from 'i18next';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { mathJaxSrc } from '../src/utils/math-jax';
import { getheadTagComponents, getPostBodyComponents } from './tags';

const i18nSpy = vi
  .spyOn(i18next, 't')
  .mockImplementation(((key: string) => key) as unknown as typeof i18next.t);

afterAll(() => {
  i18nSpy.mockRestore();
});

describe('getheadTagComponents', () => {
  it('returns the social meta tags', () => {
    const headTags = getheadTagComponents();
    const propsByKey = (key: string) =>
      headTags.find(tag => tag.key === key)?.props as
        | { name: string; content: string }
        | undefined;

    expect(propsByKey('og:title')).toMatchObject({
      name: 'og:title',
      content: 'freeCodeCamp.org'
    });
    expect(propsByKey('og:description')).toMatchObject({
      name: 'og:description',
      content: 'metaTags:social-description'
    });
    expect(propsByKey('twitter:title')).toMatchObject({
      name: 'twitter:title',
      content: 'freeCodeCamp.org'
    });
    expect(propsByKey('twitter:description')).toMatchObject({
      name: 'twitter:description',
      content: 'metaTags:social-description'
    });
  });
});

describe('getPostBodyComponents', () => {
  it('includes the MathJax script for challenges in MathJax super blocks', () => {
    for (const pathname of [
      '/learn/rosetta-code/rosetta-code-challenges/100-doors',
      '/learn/project-euler/project-euler-problems-1-to-100/problem-1-multiples-of-3-or-5'
    ]) {
      const scripts = getPostBodyComponents(pathname);

      expect(scripts).toHaveLength(1);
      expect(scripts[0].props).toMatchObject({
        id: 'mathjax',
        src: mathJaxSrc
      });
    }
  });

  it('does not include the MathJax script on other pages', () => {
    for (const pathname of [
      '/',
      '/learn/responsive-web-design/basic-html-and-html5/say-hello-to-html-elements'
    ]) {
      expect(getPostBodyComponents(pathname)).toHaveLength(0);
    }
  });
});
