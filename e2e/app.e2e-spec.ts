import { App6Page } from './app.po';

describe('app6 App', function() {
  let page: App6Page;

  beforeEach(() => {
    page = new App6Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
