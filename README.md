# Chat Text Extractor
1. Mentions - A way to mention a user. Always starts with an '@' and ends when hitting a non-word character.
2. Emoticons - Custom emoticons which are alphanumeric strings, no longer than 15 characters, contained in parenthesis. Assumd dthat anything matching this format is an emoticon. 
3. Links - Any URLs contained in the message, along with the page's title. (https://cors-anywhere.herokuapp.com/ is used to avoid CORS)

## Input 
```
"@bob @john (success)  (hatred)) such a cool feature; https://google.com"
```
## Output:
```
{
  "mentions": [
    "bob",
    "john"
  ],
  "emoticons": [
    "success"
  ],
  "links": [
    {
      "url": "https://twitter.com/jdorfman/status/430511497475670016",
      "title": "Google"
    }
  ]
}
```

## To Run Locally

1. Do a git clone
2. ng serve --o
3. Open browser http://localhost:4200

## Running unit tests

1. ng test

## Code Structure
1. App.component: Includes component that interacts with template
2. App.service: Service to make calls to fetch title (metadata). The service caches the url, so if another request is made it will return from the cache. Cache size is assumed to be unlimited but for production use case we can create LRU cache and limit a size.
3. No need to do npm i. All dependencies are deployed on git. There was a change in 1 of the libraries and I had time sandboxed this project. 

## Assumptions
1. Mentions can only have 1 @mention (as used my many chats and apps online)
  eg: Valid: @rob Invalid: @@rob
2. Max string length is assumed to be 10K chars 


