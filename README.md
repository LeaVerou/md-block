<section>

# Motivation

There are many web components these days to render Markdown to HTML. Here are a few:

* [`<marked-element>`](https://github.com/PolymerElements/marked-element)
* [`<zero-md>`](https://zerodevx.github.io/zero-md/)
* …and I’m sure many others

However, all render the resulting Markdown in Shadow DOM, making it difficult to style like a regular part of the page, which my use cases required.
`<zero-md>` supports opt-in light DOM rendering, but it's tedious to add an extra attribute per element.

I also wanted a [few more things](#features) existing web components didn't have. Plus, making stuff is fun. 😅

So I made my own. Feel free to use it. Or don't. 🤷🏽‍♀️
I primarily wrote it to scratch my own itch anyway 😊
</section>

<section>

# Features

* Zero dependencies (except marked, obvs)
* Styleable with regular selectors, just like the rest of the page
* Load external Markdown files or render inline content
* Customize start heading level (e.g. so that `# Foo` becomes a `<h3>` and not an `<h1>`)
* Also comes with `<md-span>`, for lightweight inline markdown

[View demos](https://md-block.verou.me/#demos)

</section>

<section>

# Usage

Via HTML:
```html
<script type="module" src="https://md-block.verou.me/md-block.js"></script>
```

In JS:
```js
import {MarkdownBlock, MarkdownSpan, MarkdownElement} from "https://md-block.verou.me/md-block.js";
```

Of course you can also use npm if that's your jam:

```
npm install md-block
```
```js
import {MarkdownBlock, MarkdownSpan, MarkdownElement} from "md-block";
```

Importing the module in any of these ways also registers two custom elements: `<md-block>` for block level content and `<md-span>` for inline content.
If you additionally want to use other tag names, [you can](#using-different-tag-names).

</section>

<section>

# API

## Both `<md-block>` and `<md-span>`

| Attribute | Property | Type | Description |
|-----------|----------|------|-------------|
| - | `mdContent` | String | Actual Markdown code initially read from the HTML or fetched from `src` |
| `rendered` | `rendered` *(Read-only)* | String | Added to the element after Markdown has been rendered. Thus, you can use `md-block:not([rendered])` in your CSS to style the element differently before rendering and minimize FOUC |
| `untrusted` | `untrusted` *(Read-only)* | Boolean | Sanitize contents. [Read more](#handling-untrusted-content)

## `<md-block>`

| Attribute | Property | Type | Description |
|-----------|----------|------|-------------|
| `src` | `src` | String or URL | External Markdown file to load. If specified, element content will be discarded |
| `hmin` | `hmin` | Number | Minimum heading level |
| `hlinks` | `hlinks` | String | Whether to linkify headings. If present with no value, the entire heading text becomes the link, otherwise the symbol provided becomes the link. Note that this is only about displaying links, headings will get ids anyway |

## `<md-span>`

*(No attributes or properties at the moment)*

</section>

<section>

# Recipes

# Using different tag names

By default, md-block registers two custom elements: `<md-block>` for block-level content and `<md-span>` for inline content.
You can use different names, but [since each class can only be associated with one tag name](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#:~:text=Exceptions-,notsupportederror,-DOMException), you need to create your own subclass:

```js
import {MarkdownBlock, MarkdownSpan, MarkdownElement} from "https://md-block.verou.me/md-block.js"

customElements.define("md-content", class MarkdownContent extends MarkdownBlock {});
```

# Handling untrusted content

By default md-block does not santize the Markdown you provide, since in most use cases the content is trusted.

If you need to render untrusted content use the `untrusted` attribute, which will dynamically load [DOMPurify](https://github.com/cure53/DOMPurify) and use it.
This is not dynamic, you need to add it in your actual markup (or before the element is connected, if dynamically generated).
The reason is that it's unsafe to add it later: if the content has been already rendered once and treated as safe, it's pointless to sanitize it afterwards and re-render.

Important: Do **not** rely on the `untrusted` attribute for inline Markdown! This is mainly useful for content linked via the `src` attribute.
If there is potentially malicious code in the inline Markdown you are using, it will be picked up by the browser before md-block has the change to do anything about it.
Instead, use a regular `<md-block>` element, and `MarkdownElement.sanitize()` for the untrusted content.

</section>