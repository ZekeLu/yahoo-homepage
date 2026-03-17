import { getArticleBySlug, getArticlesBySection, allArticles } from '@/lib/articles';

describe('Article slug lookup', () => {
  it('finds an article by its slug', () => {
    const article = getArticleBySlug('global-leaders-climate-summit-geneva');
    expect(article).toBeDefined();
    expect(article?.title).toBe('Global Leaders Gather for Historic Climate Summit in Geneva');
  });

  it('returns undefined for a non-existent slug', () => {
    const article = getArticleBySlug('non-existent-slug');
    expect(article).toBeUndefined();
  });

  it('every article has a slug field', () => {
    allArticles.forEach((article) => {
      expect(article.slug).toBeTruthy();
      expect(typeof article.slug).toBe('string');
    });
  });

  it('every article has an imageUrl field', () => {
    allArticles.forEach((article) => {
      expect(article.imageUrl).toBeTruthy();
      expect(article.imageUrl).toContain('unsplash.com');
    });
  });

  it('returns articles filtered by section', () => {
    const financeArticles = getArticlesBySection('finance');
    expect(financeArticles.length).toBeGreaterThan(0);
    financeArticles.forEach((a) => {
      expect(a.section).toBe('finance');
    });
  });
});
