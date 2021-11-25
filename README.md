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
import {MarkdownBlock, MarkdownSpan, MarkdownElement} from "https://md-block.verou.me/md-block.js"
```
</section>

<section>

# Using different tag names

By default, md-element registers two custom elements: `<md-block>` for block-level content and `<md-span>` for inline content.
You can use different names, but [since each class can only be associated with one tag name](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#:~:text=Exceptions-,notsupportederror,-DOMException), you need to create your own subclass:

```js
import {MarkdownBlock, MarkdownSpan, MarkdownElement} from "https://md-block.verou.me/md-block.js"

customElements.define("md-content", class MarkdownContent extends MarkdownBlock {});
```

</section>

<section>

# API

## `<md-block>`

| Attribute | Property | Type | Description |
|-----------|----------|------|-------------|
| `src` | `src` | String or URL | External Markdown file to load. If specified, element content will be discarded |
| `minh` | `minh` | Number | Minimum heading level |
| `hlinks` | `hlinks` | String | Whether to linkify headings. If present with no value, the entire heading text becomes the link, otherwise the symbol provided becomes the link. Note that this is only about displaying links, headings will get ids anyway |

## `<md-span>`

*(None)*

</section>

<section>

# Overriding marked options

TBD

# Handling untrusted content

By default md-block does not santize the Markdown you provide, since in most use cases the content is trusted.

If you need to render some untrusted content use the `sanitize` attribute, which will dynamically load [DOMPurify](https://github.com/cure53/DOMPurify) and use it.

</section>