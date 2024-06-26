---
id: 5cdafbd72913098997531681
title: 成功したプロミスを then メソッドで処理する
challengeType: 1
forumTopicId: 301203
dashedName: handle-a-fulfilled-promise-with-then
---

# --description--

プロミスは、サーバーリクエストなど、処理にどの程度の時間がかかるかわからないプロセス (たとえば、非同期的なもの) がコードにある場合に最も役立ちます。 サーバーリクエストを行う場合、処理には時間がかかり、通常は処理の完了後にサーバーからの応答を受けて何らかの処理を行う必要があります。 `then` メソッドを使用するとこうした処理を実現できます。

```js
Promise.prototype.then(onFulfilled, onRejected)
```

The `then` method schedules callback functions for the eventual completion of a Promise - either fulfillment or rejection. One of the `onFulfilled` and `onRejected` handlers will be executed to handle the current promise's fulfillment or rejection. When the promise is fulfilled with `resolve` the `onFulfilled` handler is called.

```js
myPromise.then(result => {

});
```

`result` は、`resolve` メソッドに渡された引数からの結果です。

# --instructions--

`then` メソッドをプロミスに追加してください。 `result` をコールバック関数のパラメーターとして使用し、コンソールに `result` を出力してください。

# --hints--

プロミスで `then` メソッドを呼び出す必要があります。

```js
assert(
  __helpers.removeWhiteSpace(__helpers.removeJSComments(code)).match(/(makeServerRequest|\))\.then\(/g)
);
```

`then` メソッドでは、`result` をパラメーターとするコールバック関数を記述する必要があります。

```js
assert(resultIsParameter);
```

コンソールに `result` を出力する必要があります。

```js
assert(
  resultIsParameter &&
    __helpers
      .removeWhiteSpace(__helpers.removeJSComments(code))
      .match(/\.then\(.*?result.*?console.log\(result\).*?\)/)
);
```

# --seed--

## --after-user-code--

```js
const resultIsParameter = /\.then\((function\(result\){|result|\(result\)=>)/.test(__helpers.removeWhiteSpace(__helpers.removeJSComments(code)));
```

## --seed-contents--

```js
const makeServerRequest = new Promise((resolve, reject) => {
  // responseFromServer is set to true to represent a successful response from a server
  let responseFromServer = true;

  if(responseFromServer) {
    resolve("We got the data");
  } else {  
    reject("Data not received");
  }
});
```

# --solutions--

```js
const makeServerRequest = new Promise((resolve, reject) => {
  // responseFromServer is set to true to represent a successful response from a server
  let responseFromServer = true;

  if(responseFromServer) {
    resolve("We got the data");
  } else {  
    reject("Data not received");
  }
});

makeServerRequest.then(result => {
  console.log(result);
});
```
