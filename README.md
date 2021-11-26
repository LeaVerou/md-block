<section>

# Motivation

There are many web components these days to render Markdown to HTML. Here are a few:

* [`<zero-md>`](https://zerodevx.github.io/zero-md/)
* [`<marked-element>`](https://github.com/PolymerElements/marked-element)
* …and I’m sure many others

However, all render the resulting Markdown in Shadow DOM, making it painful to style like a regular part of the page, which my use cases required.
`<zero-md>` supports opt-in light DOM rendering, but it's tedious to add an extra attribute per element.

I also wanted a [few more things](#features) existing web components didn't have.
Plus, making stuff is fun. 😅

So I made my own. Feel free to use it. Or don't. 🤷🏽‍♀️
I primarily wrote it to scratch my own itch anyway! 😊
</section>

<section>

# Features

* Zero dependencies (except marked, obvs, which is only loaded if a `<md-block>` or `<md-span>` element is actually used on the page)
* Styleable with regular selectors, just like the rest of the page
* Load external Markdown files or render inline content
* Customize start heading level (e.g. so that `# Foo` becomes a `<h3>` and not an `<h1>`)
* Also comes with `<md-span>`, for lightweight inline markdown
* [Prism](https://prismjs.com) is automatically used for syntax highlighting, if included ([but can be included dynamically too](#loading-prism-dynamically))

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
| - | `mdContent` | String | Actual Markdown code initially read from the HTML or fetched from `src`. Can also be set to render new Markdown code |
| `rendered` | `rendered` *(Read-only)* | String | Added to the element after Markdown has been rendered. Thus, you can use `md-block:not([rendered])` in your CSS to style the element differently before rendering and minimize FOUC |
| `untrusted` | `untrusted` *(Read-only)* | Boolean | Sanitize contents. [Read more](#handling-untrusted-content)

## `<md-block>`

| Attribute | Property | Type | Description |
|-----------|----------|------|-------------|
| `src` | `src` | String or URL | External Markdown file to load. If specified, original element content will be rendered and displayed while the file is loading (or if it fails to load). |
| `hmin` | `hmin` | Number | Minimum heading level |
| `hlinks` | `hlinks` | String | Whether to linkify headings. If present with no value, the entire heading text becomes the link, otherwise the symbol provided becomes the link. Note that this is only about displaying links, headings will get ids anyway |

## `<md-span>`

*(No attributes or properties at the moment)*

</section>

<section>

# Recipes

## Updating the Markdown

While you can provide initial Markdown inline, after the element is rendered, changing its contents will not cause it to re-render,
since its contents are now the parsed HTML (this is a disadvantage of this approach, compared to the Shadow DOM ones).

If you need to update its contents dynamically, use `element.mdContent`.
You can also read that property to get access to the Markdown code that was last rendered, whether it came from the element's contents,
or fetched from a URL.

Note that setting `mdContent` will override any remote URL provided via `src`.

## Minimizing FOUC

md-block adds a `rendered` attribute to elements whose Markdown has been rendered.
This allows you to style unrendered content however you please, by using a `md-block:not([rendered])` CSS selector.

- You could hide it entirely via `md-block:not([rendered]) { display: none }`
- You could apply `white-space: pre-line` to it so that at least paragraphs are not all smushed together
- …or you could do something fancier.

I'd recommend you consider *how it fails* before deciding what to do. It's the Internet, 💩 happens.
Do you want your content to not be visible if a script doesn't load?

When loading remote content, there are two renders: First, any fallback content renders, then the remote content.
Because we often want to style the element differently until the remote content renders, the `rendered` attribute has keyword values, depending on what happened:

* `fallback` when only fallback content has been rendered
* `remote` if remote content has been rendered
* `content` if element content has been rendered and there is no `src` attribute present
* `property` if content has been rendered by setting `this.mdContent` directly

## Using different tag names

By default, md-block registers two custom elements: `<md-block>` for block-level content and `<md-span>` for inline content.
You can use different names, but [since each class can only be associated with one tag name](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#:~:text=Exceptions-,notsupportederror,-DOMException), you need to create your own subclass:

```js
import {MarkdownBlock, MarkdownSpan, MarkdownElement} from "https://md-block.verou.me/md-block.js"

customElements.define("md-content", class MarkdownContent extends MarkdownBlock {});
```

## Handling untrusted content

By default md-block does not santize the Markdown you provide, since in most use cases the content is trusted.

If you need to render untrusted content use the `untrusted` attribute, which will dynamically load [DOMPurify](https://github.com/cure53/DOMPurify) and use it.
This is not dynamic, you need to add it in your actual markup (or before the element is connected, if dynamically generated).
The reason is that it's unsafe to add it later: if the content has been already rendered once and treated as safe, it's pointless to sanitize it afterwards and re-render.

Important: Do **not** rely on the `untrusted` attribute for inline Markdown! This is mainly useful for content linked via the `src` attribute.
If there is potentially malicious code in the inline Markdown you are using, it will be picked up by the browser before md-block has the change to do anything about it.
Instead, use a regular `<md-block>` element, and `MarkdownElement.sanitize()` for the untrusted content.

## Using different URLs for marked and DOMPurify

By default, `md-block` dynamically loads marked and DOMPurify from a CDN. If you want to use different versions, there is a number of ways:

Probably the easiest is if you use the versions of these libraries that create a global, md-block will use that instead of loading them.

The URLs md-block uses to fetch these libraries reside on a separate `URLs` export. So theoretically you could do something like this:

```js
import {URLs as MdBlockURLS, MarkdownBlock, MarkdownSpan, MarkdownElement} from "./md-block.js";

MdBlockURLS.marked = "./marked.js";
MdBlockURLS.DOMPurify = "./purify.es.js";
```

But it's uncertain whether the new URLs will be picked up before the default ones load. In my tests that seems to work for DOMPurify but not marked.
These libraries are loaded when the element is connected, so you *could* add the `<md-block>` elements dynamically to the document after you set the URLs, but that's a bit of a hassle.

## Loading Prism dynamically

By default `md-block` will use Prism if it's available, but won’t load it dynamically if it isn't.
You *could* tell it to load Prism dynamically, **only if there are actual code elements**, by providing a Prism URL:

```js
import {URLs as MdBlockURLS, MarkdownBlock, MarkdownSpan, MarkdownElement} from "./md-block.js";

MdBlockURLS.Prism = "./prism.js";
// You can optionally also provide a Prism CSS URL:
MdBlockURLS.PrismCSS = "./prism.css";
```

## `<md-block>` inception

Did you know you can actualy use `<md-block>` *inside your Markdown* and it works correctly?

For a cool example of this, check out [the Stretchy docs](https://stretchy.verou.me/#browser-support)

## How to set different Markdown options/flavor?

Right now, this element uses GFM as a Markdown flavor and doesn’t expose a whole lot of options (besides `hmin` and `hlinks`).
That’s because I originally wrote it for my own needs, and that’s what I needed.
I’m not opposed to adding more customizability, if there are actual use cases that require it.
If you have such use cases, please [open an issue](https://github.com/leaverou/md-block/issues/new).

</section>