import { Component, Input, OnChanges } from '@angular/core';
import { AppService } from './app.service';
import * as validUrl from 'valid-url';
import * as twitter from 'twitter-text';
import * as isAlphaNumeric from 'is-alphanumeric';

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

  constructor(private appService: AppService) { }

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

    this.output = {
      mentions: [],
      emoticons: [],
      links: []
    };

    // Get all space separated strings
    for (let i = 0; i < splitStr.length; i++) {
      let elem: string = splitStr[i];

      if (this.isValidUrl(elem)) {
        this.output.links.push(await this.extractLinks(elem));
      } else if (this.isValidMentions(elem)) {
        const mentions = this.extractMentions(elem);
        if (mentions) {
          this.output.mentions.push(mentions);
        }
      } else if (this.isValidEmoticons(elem)) {
        const emoticons = this.extractEmoticons(elem);
        if (emoticons) {
          this.output.emoticons.push(emoticons);
        }
      }

    }
    this.loading = false;
  }

  /**
   * is a string valid mention
   * @param str
   */
  private isValidMentions(str: string): boolean {
    if (!str) {
      return false;
    }
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
    if (!str) {
      return;
    }
    return twitter.extractMentions(str)[0];
  }

  /**
   * Extract links
   * @param str
   */
  private async extractLinks(str: string): Promise<Link> {
    let title: string;
    try {
      title = await this.appService.fetchMetaData(str);
    } catch (e) {
      title = e;
    }
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
