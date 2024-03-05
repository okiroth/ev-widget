# Find A Dealer Widget iFrame

## How to use it

It needs two things, a small JS code snippet to adjust it's height and the html itself:

```js
function resizeIframe(iframe) {
  iframe.height = iframe.contentWindow.document.body.scrollHeight + "px";
  window.requestAnimationFrame(() => resizeIframe(iframe));
}
```

```html
<iframe
  onload="resizeIframe(this)"
  id="ev-widget"
  src="https://leasingcalculator.tryrevo.com/"
  width="100%"
  height="400px"
  frameborder="0"
></iframe>
```

or

```html
<iframe
  onload="resizeIframe(this)"
  id="ev-widget"
  src="https://findadealer.tryrevo.com/"
  width="100%"
  height="400px"
  frameborder="0"
></iframe>
```

### siteUrl for Detroit Trading Company API

`document.referrer` is used, the `iframe` doesn't have access to the full URL, just the main location.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
