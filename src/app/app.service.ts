import { Injectable } from '@angular/core';
import fetchTitle from 'metafetch';

@Injectable()
export class AppService {
  private headers: Headers;
  private corsWorkAroundUrl: string = 'https://cors-anywhere.herokuapp.com/';

  constructor() { }

  public fetchMetaData(url: string): Promise<any> {
    const options = {
      http: {
        headers: {
          'x-requested-with': 'XMLHttpRequest'
        }
      }
    };

    const promise = new Promise((resolve, reject) => {
      const reqUrl = `${this.corsWorkAroundUrl}${url}`;

      fetchTitle.fetch(reqUrl, options,
        (err, data) => {
          const { title, description } = data;
          console.log(data);
          if (err) {
            reject(err);
          }
          resolve(`${title}`);
        });
    });
    return promise;
  }

}
