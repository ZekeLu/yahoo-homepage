import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticleForm from '@/components/ArticleForm';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockedFetch = global.fetch as jest.Mock;

describe('ArticleForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields for new article', () => {
    render(<ArticleForm />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/section/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Category *')).toBeInTheDocument();
    expect(screen.getByLabelText(/subcategory/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/summary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/body content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/is featured/i)).toBeInTheDocument();
  });

  it('shows "Create Article" button for new articles', () => {
    render(<ArticleForm />);
    expect(screen.getByText('Create Article')).toBeInTheDocument();
  });

  it('shows Cancel button that navigates to articles list', async () => {
    const user = userEvent.setup();
    render(<ArticleForm />);

    await user.click(screen.getByText('Cancel'));
    expect(mockPush).toHaveBeenCalledWith('/admin/articles');
  });

  it('auto-generates slug from title', async () => {
    const user = userEvent.setup();
    render(<ArticleForm />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'Hello World Test');

    const slugInput = screen.getByLabelText(/slug/i) as HTMLInputElement;
    expect(slugInput.value).toBe('hello-world-test');
  });

  it('stops auto-slug when slug is manually edited', async () => {
    const user = userEvent.setup();
    render(<ArticleForm />);

    const slugInput = screen.getByLabelText(/slug/i);
    await user.type(slugInput, 'custom-slug');

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'New Title');

    // Slug should remain custom
    expect((slugInput as HTMLInputElement).value).toBe('custom-slug');
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<ArticleForm />);

    await user.click(screen.getByText('Create Article'));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Slug is required')).toBeInTheDocument();
      expect(screen.getByText('Category is required')).toBeInTheDocument();
      expect(screen.getByText('Author is required')).toBeInTheDocument();
    });
  });

  it('shows snippet length validation', async () => {
    const user = userEvent.setup();
    render(<ArticleForm />);

    // Fill required fields
    await user.type(screen.getByLabelText(/title/i), 'Test');
    await user.type(screen.getByLabelText('Category *'), 'Tech');
    await user.type(screen.getByLabelText(/author/i), 'Author');

    // Type more than 200 chars in snippet
    const longText = 'A'.repeat(201);
    const snippetField = screen.getByLabelText(/summary/i);
    fireEvent.change(snippetField, { target: { value: longText } });

    await user.click(screen.getByText('Create Article'));

    await waitFor(() => {
      expect(screen.getByText('Summary must be 200 characters or less')).toBeInTheDocument();
    });
  });

  it('submits new article successfully', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
    const user = userEvent.setup();
    render(<ArticleForm />);

    await user.type(screen.getByLabelText(/title/i), 'New Article');
    await user.type(screen.getByLabelText('Category *'), 'Tech');
    await user.type(screen.getByLabelText(/author/i), 'Author');

    await user.click(screen.getByText('Create Article'));

    await waitFor(() => {
      expect(mockedFetch).toHaveBeenCalledWith('/api/articles', expect.objectContaining({
        method: 'POST',
      }));
      expect(mockPush).toHaveBeenCalledWith('/admin/articles');
    });
  });

  it('generates default image URL for new articles without imageUrl', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
    const user = userEvent.setup();
    render(<ArticleForm />);

    await user.type(screen.getByLabelText(/title/i), 'Test Title');
    await user.type(screen.getByLabelText('Category *'), 'Tech');
    await user.type(screen.getByLabelText(/author/i), 'Author');

    await user.click(screen.getByText('Create Article'));

    await waitFor(() => {
      const callBody = JSON.parse(mockedFetch.mock.calls[0][1].body);
      expect(callBody.imageUrl).toContain('picsum.photos');
    });
  });

  it('loads existing article data in edit mode', async () => {
    const existingArticle = {
      title: 'Existing Article',
      slug: 'existing-article',
      section: 'news',
      category: 'World News',
      subcategory: '',
      author: 'Author',
      date: '2026-03-15',
      snippet: 'A test snippet',
      body: ['Paragraph 1', 'Paragraph 2'],
      tags: ['tag1', 'tag2'],
      isFeatured: true,
      imageUrl: 'https://example.com/img.jpg',
    };

    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([existingArticle]),
    });

    await act(async () => {
      render(<ArticleForm articleId="existing-article" />);
    });

    await waitFor(() => {
      expect((screen.getByLabelText(/title/i) as HTMLInputElement).value).toBe('Existing Article');
      expect((screen.getByLabelText(/author/i) as HTMLInputElement).value).toBe('Author');
    });
  });

  it('shows "Update Article" button in edit mode', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{
        title: 'Test',
        slug: 'test-slug',
        section: 'news',
        category: 'Cat',
        subcategory: '',
        author: 'Auth',
        date: '2026-01-01',
        snippet: '',
        body: [],
        tags: [],
        isFeatured: false,
      }]),
    });

    await act(async () => {
      render(<ArticleForm articleId="test-slug" />);
    });

    await waitFor(() => {
      expect(screen.getByText('Update Article')).toBeInTheDocument();
    });
  });

  it('submits edit using PUT method', async () => {
    mockedFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{
          title: 'Test',
          slug: 'test-slug',
          section: 'news',
          category: 'Cat',
          subcategory: '',
          author: 'Auth',
          date: '2026-01-01',
          snippet: '',
          body: [],
          tags: [],
          isFeatured: false,
        }]),
      })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    const user = userEvent.setup();

    await act(async () => {
      render(<ArticleForm articleId="test-slug" />);
    });

    await waitFor(() => {
      expect(screen.getByText('Update Article')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Update Article'));

    await waitFor(() => {
      expect(mockedFetch).toHaveBeenCalledWith('/api/articles/test-slug', expect.objectContaining({
        method: 'PUT',
      }));
    });
  });

  it('shows loading spinner while fetching article data', () => {
    mockedFetch.mockReturnValueOnce(new Promise(() => {}));
    render(<ArticleForm articleId="some-slug" />);
    // Loading state shows spinner
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('handles fetch error in edit mode', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('fail'));

    await act(async () => {
      render(<ArticleForm articleId="non-existent" />);
    });

    // Should not crash, form should be available
    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });
  });

  it('handles article not found in edit mode', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await act(async () => {
      render(<ArticleForm articleId="non-existent" />);
    });

    // Should not crash
    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });
  });

  it('handles submit error gracefully', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('network error'));
    const user = userEvent.setup();
    render(<ArticleForm />);

    await user.type(screen.getByLabelText(/title/i), 'Test');
    await user.type(screen.getByLabelText('Category *'), 'Tech');
    await user.type(screen.getByLabelText(/author/i), 'Author');

    await user.click(screen.getByText('Create Article'));

    // Should not crash, button should re-enable
    await waitFor(() => {
      expect(screen.getByText('Create Article')).not.toBeDisabled();
    });
  });

  it('shows snippet character count', () => {
    render(<ArticleForm />);
    expect(screen.getByText('0/200')).toBeInTheDocument();
  });

  it('parses various date formats in edit mode', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{
        title: 'Test',
        slug: 'test-slug',
        section: 'news',
        category: 'Cat',
        subcategory: null,
        author: 'Auth',
        date: 'March 15, 2026',
        snippet: '',
        body: null,
        tags: null,
        isFeatured: false,
        imageUrl: null,
      }]),
    });

    await act(async () => {
      render(<ArticleForm articleId="test-slug" />);
    });

    await waitFor(() => {
      const dateInput = screen.getByLabelText(/^date/i) as HTMLInputElement;
      expect(dateInput.value).toBe('2026-03-15');
    });
  });

  it('toggles isFeatured checkbox', async () => {
    const user = userEvent.setup();
    render(<ArticleForm />);

    const checkbox = screen.getByLabelText(/is featured/i);
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('handles section dropdown change', async () => {
    const user = userEvent.setup();
    render(<ArticleForm />);

    const select = screen.getByLabelText(/section/i);
    await user.selectOptions(select, 'finance');
    expect((select as HTMLSelectElement).value).toBe('finance');
  });

  it('handles fetch returning non-ok in edit mode', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve([]),
    });

    await act(async () => {
      render(<ArticleForm articleId="test-slug" />);
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });
  });

  it('handles parseDateToInput with completely invalid date string', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{
        title: 'Test',
        slug: 'test-slug',
        section: 'news',
        category: 'Cat',
        subcategory: '',
        author: 'Auth',
        date: 'not-a-valid-date-at-all',
        snippet: '',
        body: [],
        tags: [],
        isFeatured: false,
      }]),
    });

    await act(async () => {
      render(<ArticleForm articleId="test-slug" />);
    });

    await waitFor(() => {
      const dateInput = screen.getByLabelText(/^date/i) as HTMLInputElement;
      // Should fall back to today's date
      expect(dateInput.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it('handles subcategory field change', async () => {
    const user = userEvent.setup();
    render(<ArticleForm />);

    const subcatInput = screen.getByLabelText(/subcategory/i);
    // Initially empty (covers the || "" fallback on line 235)
    expect((subcatInput as HTMLInputElement).value).toBe('');
    await user.type(subcatInput, 'AI');
    expect((subcatInput as HTMLInputElement).value).toBe('AI');
  });

  it('loads article with undefined subcategory in edit mode', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{
        title: 'Test',
        slug: 'test-slug',
        section: 'news',
        category: 'Cat',
        subcategory: undefined,
        author: 'Auth',
        date: '2026-01-01',
        snippet: '',
        body: [],
        tags: [],
        isFeatured: false,
        imageUrl: '',
      }]),
    });

    await act(async () => {
      render(<ArticleForm articleId="test-slug" />);
    });

    await waitFor(() => {
      // subcategory is undefined, so the || "" fallback is used
      expect((screen.getByLabelText(/subcategory/i) as HTMLInputElement).value).toBe('');
    });
  });

  it('allows typing in the imageUrl field', async () => {
    const user = userEvent.setup();
    render(<ArticleForm />);

    const imageUrlInput = screen.getByLabelText(/image url/i);
    await user.type(imageUrlInput, 'https://example.com/image.jpg');
    expect((imageUrlInput as HTMLInputElement).value).toBe('https://example.com/image.jpg');
  });

  it('allows typing in the tags field', async () => {
    const user = userEvent.setup();
    render(<ArticleForm />);

    const tagsInput = screen.getByLabelText(/tags/i);
    await user.type(tagsInput, 'tag1, tag2, tag3');
    expect((tagsInput as HTMLInputElement).value).toBe('tag1, tag2, tag3');
  });

  it('allows typing in the body content field', async () => {
    const user = userEvent.setup();
    render(<ArticleForm />);

    const bodyField = screen.getByLabelText(/body content/i);
    await user.type(bodyField, 'First paragraph');
    expect((bodyField as HTMLTextAreaElement).value).toBe('First paragraph');
  });

  it('submits article with imageUrl, tags, and body content', async () => {
    mockedFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
    const user = userEvent.setup();
    render(<ArticleForm />);

    await user.type(screen.getByLabelText(/title/i), 'Full Article');
    await user.type(screen.getByLabelText('Category *'), 'Tech');
    await user.type(screen.getByLabelText(/author/i), 'Author');
    await user.type(screen.getByLabelText(/image url/i), 'https://example.com/img.jpg');
    await user.type(screen.getByLabelText(/tags/i), 'tag1, tag2');

    const bodyField = screen.getByLabelText(/body content/i);
    fireEvent.change(bodyField, { target: { value: 'Paragraph 1\n\nParagraph 2' } });

    await user.click(screen.getByText('Create Article'));

    await waitFor(() => {
      const callBody = JSON.parse(mockedFetch.mock.calls[0][1].body);
      expect(callBody.imageUrl).toBe('https://example.com/img.jpg');
      expect(callBody.tags).toEqual(['tag1', 'tag2']);
      expect(callBody.body).toEqual(['Paragraph 1', 'Paragraph 2']);
    });
  });

  it('validates date field is required', async () => {
    const user = userEvent.setup();
    render(<ArticleForm />);

    await user.type(screen.getByLabelText(/title/i), 'Test');
    await user.type(screen.getByLabelText('Category *'), 'Tech');
    await user.type(screen.getByLabelText(/author/i), 'Author');

    // Clear date
    const dateInput = screen.getByLabelText(/^date/i);
    fireEvent.change(dateInput, { target: { value: '' } });

    await user.click(screen.getByText('Create Article'));

    await waitFor(() => {
      expect(screen.getByText('Date is required')).toBeInTheDocument();
    });
  });

  it('validates section is required (line 104 branch)', async () => {
    const user = userEvent.setup();
    render(<ArticleForm />);

    await user.type(screen.getByLabelText(/title/i), 'Test');
    await user.type(screen.getByLabelText('Category *'), 'Tech');
    await user.type(screen.getByLabelText(/author/i), 'Author');

    // Set section to empty to trigger the !form.section validation
    const sectionSelect = screen.getByLabelText(/section/i);
    fireEvent.change(sectionSelect, { target: { value: '' } });

    await user.click(screen.getByText('Create Article'));

    await waitFor(() => {
      expect(screen.getByText('Section is required')).toBeInTheDocument();
    });
  });

  it('loads article with empty title and date (|| "" fallbacks on lines 73-74)', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{
        title: '',
        slug: 'test-slug',
        section: 'news',
        category: 'Cat',
        subcategory: '',
        author: 'Auth',
        date: '',
        snippet: '',
        body: null,
        tags: null,
        isFeatured: false,
        imageUrl: '',
      }]),
    });

    await act(async () => {
      render(<ArticleForm articleId="test-slug" />);
    });

    await waitFor(() => {
      // title is empty string, || "" fallback gives ""
      expect((screen.getByLabelText(/title/i) as HTMLInputElement).value).toBe('');
      // body is null, ?.join("\n\n") || "" gives ""
      // tags is null, ?.join(", ") || "" gives ""
    });
  });
});
