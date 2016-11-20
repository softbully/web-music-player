import { WebMusicPlayerPage } from './app.po';

describe('web-music-player App', function() {
  let page: WebMusicPlayerPage;

  beforeEach(() => {
    page = new WebMusicPlayerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
