import { Injectable } from '@angular/core';
import * as fetchTitle from 'metafetch';

@Injectable()
export class AppService {
  private headers: Headers;
  private corsWorkAroundUrl: string = 'https://cors-anywhere.herokuapp.com/';
  private cache: Map<String, Promise<any>>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Fetch Meta data. Returns a promise
   */
  public fetchMetaData(url: string): Promise<any> {
    const reqUrl = `${this.corsWorkAroundUrl}${url}`;
    if (this.cache.get(url) !== undefined) {
      console.log('returning from cache.. :)');
      return this.cache.get(url);
    }
    const options = {
      http: {
        timeout: 3000,
        headers: {
          'x-requested-with': 'XMLHttpRequest'
        }
      }
    };
    const promise = new Promise((resolve, reject) => {

      fetchTitle.fetch(reqUrl, options,
        (err, data) => {
          if (err) {
            reject(err);
          }
          if (data && data.title) {
            this.cache.set(url, promise);
            resolve(`${data.title}`);
          } else {
            resolve('No website found');
          }
        });
    });
    return promise;
  }

}
