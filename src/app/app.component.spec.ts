import { TestBed, async, inject } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppService } from './app.service';
import validUrl from 'valid-url';

class MockAppService {
  public async fetchMetaData() {
    return 'title';
  }
}

describe('AppComponent', () => {
  let app;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [BrowserModule, FormsModule, HttpModule],
      providers: [{ provide: AppService, useClass: MockAppService }]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
  }));

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));

  describe('should validate', () => {
    it('emoticons', () => {
      expect(app.isValidEmoticons('(123)')).toBeTruthy();
      expect(app.isValidEmoticons('')).toBeFalsy();
      expect(app.isValidEmoticons('(12356789)')).toBeTruthy();
      expect(app.isValidEmoticons('((123)')).toBeTruthy();
    });

    it('mentions', () => {
      expect(app.isValidMentions('@')).toBeTruthy();
      expect(app.isValidMentions('')).toBeFalsy();
      expect(app.isValidMentions('@@')).toBeTruthy();
    });

    it('url ', () => {
      expect(app.isValidUrl('http://www.google.com')).toBeTruthy();
      expect(app.isValidUrl('http:/google.com')).toBeTruthy();
      expect(app.isValidUrl('google.com')).toBeFalsy();
    });
  });

  describe('should extract', () => {
    it('mentions', () => {
      expect(app.extractMentions('@mention')).toEqual('mention');
      expect(app.extractMentions('@@mention')).toEqual(undefined);
      expect(app.extractMentions('@')).toEqual(undefined);
    });

    it('links', inject([AppService], async (service: MockAppService) => {
      const link = 'https://wwww.google.com';
      spyOn(service, 'fetchMetaData');
      const result = await app.extractLinks(link);
      expect(result.url).toEqual(link);
    }));

    it('emoticons', () => {
      expect(app.extractEmoticons('(abc)')).toEqual('abc');
      expect(app.extractEmoticons('()')).toEqual('');
      expect(app.extractEmoticons('(123456765434567654)')).toEqual(undefined);
      expect(app.extractEmoticons('(&&***)')).toEqual(undefined);
    });
  });

  describe('should get the output', () => {

    it('if input string is defined and has data', async () => {
      const url = `https://twitter.com/jdorfman/status/430511497475670016`;
      app.inputString = `@bob @john (sucess) such a cool feature ${url}`;
      await app.onSubmit();
      expect(app.output.mentions[0]).toEqual('bob');
      expect(app.output.emoticons[0]).toEqual('sucess');
      expect(app.output.links[0].url).toEqual(url);
    });

    it('if input string is defined and has NO mentions, extracts, links', async () => {
      const url = `https://twitter.com/jdorfman/status/430511497475670016`;
      app.inputString = `@@bob @@ohn ((sucess) such a cool feature`;
      await app.onSubmit();
      expect(app.output.mentions.length).toEqual(0);
      expect(app.output.emoticons.length).toEqual(0);
      expect(app.output.links.length).toEqual(0);
    });

    it('NOT if input string is empty', async () => {
      app.inputString = '';
      await app.onSubmit();
      expect(app.output).toBeUndefined();
    });
  });

});
