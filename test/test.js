console.log = () => {};
const assert = require('chai').assert;
const expect = require('chai').expect;
const Structured = require('structured');
const fs = require('fs');
const code = fs.readFileSync('app.js', 'utf8');
const rewire = require('rewire');
const express = require('express');

describe('', function() {
  it('', function() {
    process.env.PORT = 8001;
    const appModule = rewire('../app.js');
    let moduleExpress;
    try {
      moduleExpress = appModule.__get__('express');
    } catch (e) {
      expect(e, 'Did you require the `express` and save it to a `const express`?').to.not.instanceOf(Error);
    }
    expect(express.prototype, 'Did you require the `express` package and save it to a `const express`?').to.equal(moduleExpress.prototype);
    let app;
    try {
      app = appModule.__get__('app');
      console.log(app);
    } catch (e) {
      expect(e, 'Did you create an express application and save it to a `const app`?').to.not.be.an.instanceOf(Error);
    }
    
    const myApp = express();
    expect(app.unlink, 'Did you create an express application and save it to a `const app`?').to.deep.equal(myApp.unlink);

    const portStruct = function() {
      const $PORT = process.env.PORT || 4001;
      app.listen($PORT);
    }

    let isMatch = Structured.match(code, portStruct);
    assert.isOk(isMatch, 'Did you use `app.listen` to start your server listening at the correct port?');
    
    const correctPortStruct = function() {
      const $PORT = process.env.PORT || 4001;
      app.listen($PORT);
    }

    isMatch = Structured.match(code, correctPortStruct);
    assert.isOk(isMatch, 'Did you use `app.listen` to start your server listening at the correct port?');
    
    const cbStruct = function() {
      const $PORT = process.env.PORT || 4001;
      app.listen($PORT, $fn);
    }
    
    let varCallbacks = [
    	function($fn) {
      	if ($fn.type !== 'ArrowFunctionExpression') {
        	return { failure: 'Did you use an arrow function callback as the second argument to `app.listen`?' };
        } else {
          return true;
        }
      }
    ]

    isMatch = Structured.match(code, cbStruct, { varCallbacks });
    assert.isOk(isMatch, varCallbacks.failure || 'Did you pass a callback function after the port to `app.listen`?');
    
    const struct = function() {
      const $PORT = process.env.PORT || 4001;
      app.listen($PORT, () => {
        console.log($str);
      });
    }

    isMatch = Structured.match(code, struct);
    assert.isOk(isMatch, 'Did you log something to the console inside your `app.listen` callback?');
    
  });
});
