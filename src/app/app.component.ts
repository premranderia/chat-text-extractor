import { Component, Input, OnChanges } from '@angular/core';
import { AppService } from './app.service';
import validUrl from 'valid-url';
import twitter from 'twitter-text';
import isAlphaNumeric from 'is-alphanumeric';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppService]
})

export class AppComponent {
  private inputString: string;
  private output: any;
  private mentionString: string = '@';
  private emoticonStringCharStart: string = '(';
  private emoticonStringCharEnd: string = ')';
  private maxEmoticonSize: number = 17;
  private loading: boolean = false;
  private maxStringLength = 10000;

  constructor(private appService: AppService) {
    this.inputString = `@bob @john (success) such a cool feature; 
    https://twitter.com/jdorfman/status/430511497475670016 http://www.nbcolympics.com`;
  }

  /**
   * On Submit
   */
  public async onSubmit(): Promise<void> {
    this.output = undefined;
    if (!this.inputString || this.maxStringLength > this.maxStringLength) {
      return;
    }
    this.loading = true;
    // Replace multiple space with 1 and split the string
    const splitStr: Array<string> = this.inputString.replace(/\s\s+/g, ' ').split(' ');

    const result = {
      mentions: [],
      emoticons: [],
      links: []
    };

    // Get all space separated strings
    for (let i = 0; i < splitStr.length; i++) {
      let elem: string = splitStr[i];

      if (this.isValidUrl(elem)) {
        result.links.push(await this.extractLinks(elem));
      } else if (this.isValidMentions(elem)) {
        const mentions = this.extractMentions(elem);
        if (mentions) {
          result.mentions.push(mentions);
        }
      } else if (this.isValidEmoticons(elem)) {
        const emoticons = this.extractEmoticons(elem);
        if (emoticons) {
          result.emoticons.push(emoticons);
        }
      }

    }

    this.output = JSON.stringify(result, undefined, 4);
    this.loading = false;
  }

  /**
   * is a string valid mention
   * @param str
   */
  private isValidMentions(str: string): boolean {
    return str.charAt(0) === this.mentionString;
  }

  /**
   * Is the string valid url
   */
  private isValidUrl(str: string): boolean {
    return validUrl.isUri(str);
  }

  /**
   * Is the string valid emoticons
   * @param str
   */
  private isValidEmoticons(str: string): boolean {
    return str.startsWith(this.emoticonStringCharStart) && str.endsWith(this.emoticonStringCharEnd);
  }

  /**
   * Extract mentions
   * @param str
   */
  private extractMentions(str): Array<string> {
    return twitter.extractMentions(str)[0];
  }

  /**
   * Extract links
   * @param str
   */
  private async extractLinks(str: string): Promise<Link> {
    const title: string = await this.appService.fetchMetaData(str);
    return {
      url: str,
      title
    };
  }

  /**
   * Extract emoticons
   * @param str
   */
  private extractEmoticons(str): string | undefined {
    const emoticonStr = str.substring(1, str.length - 1);
    return (str.length < this.maxEmoticonSize &&
      isAlphaNumeric(emoticonStr)) ? emoticonStr : undefined;
  }
}

////////

interface Link {
  url: string;
  title: string;
}

interface Output {
  mentions: Array<string>;
  emoticons: Array<string>;
  links: Array<Link>;
}
