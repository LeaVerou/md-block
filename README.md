<section>

# Motivation

There are many web components these days to render Markdown to HTML. Here are a few:

* [&lt;marked-element>](https://github.com/PolymerElements/marked-element)
* [&lt;zero-md>](https://zerodevx.github.io/zero-md/)
* …and I’m sure many others

However, all render the resulting Markdown in Shadow DOM, making it difficult to style like a regular part of the page.
`&lt;zero-md>` supports opt-in light DOM rendering, but it's tedious to add an extra attribute per element.

I also wanted a [few more things](#features) existing web components didn't have. Plus, making stuff is fun. 😅

So I made my own. Feel free to use it. Or don't. I primarily wrote it to scratch my own itch anyway 😊
</section>

<section>

# Features

* Styleable with regular selectors, just like the rest of the page
* Load external Markdown files or render inline content
* Customize start heading level (e.g. so that `# Foo` becomes a `&lt;h3>` and not an `&lt;h1>`)
* Also comes with `&lt;md-span>`, for lightweight inline markdown

</section>

<section>

# Usage

Via HTML:
```html
<script type="module" src="https://projects.verou.me/md-element"></script>
```

In JS:
```js
import MarkdownBlock, MarkdownInline, MarkdownElement from "https://projects.verou.me/md-element"
```

By default, md-element registers two custom elements: `<md-block>` for block-level content and `<md-span>` for only inline content.
If you want different names, you can register your own:

```html
customElements.define("md-content", MarkdownBlock);
```

</section>

<section>

# API

## `<md-block>`

| Attribute | Property | Type | Description |
|-----------|----------|------|-------------|
| `src` | `src` | String or URL | External Markdown file to load. If specified, element content will be discarded |
| `minheadinglevel` | `minHeadingLevel` | Number | Minimum heading level |
| `headinglinks` | `headingLinks` | String | Whether to linkify headings. If present with no value, the entire heading text becomes the link, otherwise the symbol provided becomes the link |

## `<md-span>`

*(None)*

</section>