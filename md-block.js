/**
 * <md-content> custom element
 * @author Lea Verou
 */
import { marked } from "https://cdn.jsdelivr.net/npm/marked/src/marked.js";

marked.setOptions({
	gfm: true,
	langPrefix: "language-",
});

export class MarkdownElement extends HTMLElement {
	constructor() {
		super();

		this.renderer = Object.assign({}, this.constructor.renderer);

		for (let property in this.renderer) {
			this.renderer[property] = this.renderer[property].bind(this);
		}
	}

	connectedCallback() {
		this.mdContent = this.innerHTML;

		// Fix indentation
		var indent = this.mdContent.match(/^[\t ]+/m);

		if (indent) {
			indent = indent[0];

			this.mdContent = this.mdContent.replace(RegExp("^" + indent, "gm"), "");
		}

		this.render();
	}
};

export class MarkdownSpan extends MarkdownElement {
	constructor() {
		super();
	}

	render ({force = false} = {}) {
		if (!this.isConnected || this.mdContent === undefined) {
			return;
		}

		marked.use({renderer: this.renderer});

		var html = marked.parseInline(this.mdContent);

		this.innerHTML = html;
		this.setAttribute("parsed", "");
	}

	static renderer = {
		codespan (code) {
			if (this._remoteContent) {
				// Remote code may include characters that need to be escaped to be visible in HTML
				code = code.replace(/</g, "&lt;");
			}
			else {
				// Inline HTML code needs to be escaped to not be parsed as HTML by the browser
				// This results in marked double-escaping it, so we need to unescape it
				code = code.replace(/&amp;(?=[lg]t;)/g, "&");
			}

			return `<code>${code}</code>`;
		}
	}
}

export class MarkdownBlock extends MarkdownElement {
	constructor() {
		super();
	}

	get src() {
		return this._src;
	}

	set src(value) {
		this.setAttribute("src", value);
	}

	get minHeadingLevel() {
		return this._minHeadingLevel || 1;
	}

	set minHeadingLevel(value) {
		this.setAttribute("minheadinglevel", value);
	}

	get headingLinks() {
		return this._headingLinks ?? null;
	}

	set headingLinks(value) {
		this.setAttribute("headingLinks", value);
	}

	async render ({force = false} = {}) {
		if (!this.isConnected || this.mdContent === undefined) {
			return;
		}

		marked.use({renderer: this.renderer});

		var html = marked.parse(this.mdContent);

		this.innerHTML = html;

		let Prism = window.Prism || this.constructor.Prism;

		if (Prism) {
			Prism.highlightAllUnder(this);
		}

		this.setAttribute("parsed", "");
	}

	static renderer = Object.assign({
		heading (text, level, _raw, slugger) {
			level = level + (this.minHeadingLevel - 1);
			const id = slugger.slug(text);
			const headingLinks = this.headingLinks;

			let content;

			if (headingLinks === null) {
				// No heading links
				content = text;
			}
			else {
				content = `<a id="${id}" href="#${id}" class="anchor">`;

				if (headingLinks === "") {
					// Heading content is the link
					content += text + "</a>";
				}
				else {
					// Headings are prepended with a linked symbol
					content += headingLinks + "</a>" + text;
				}
			}

			return `
				<h${level}>
					${content}
				</h${level}>`;
		},

		code (code, language, escaped) {
			if (this._remoteContent) {
				// Remote code may include characters that need to be escaped to be visible in HTML
				code = code.replace(/</g, "&lt;");
			}
			else {
				// Inline HTML code needs to be escaped to not be parsed as HTML by the browser
				// This results in marked double-escaping it, so we need to unescape it
				code = code.replace(/&amp;(?=[lg]t;)/g, "&");
			}

			return `<pre class="language-${language}"><code>${code}</code></pre>`;
		}
	}, MarkdownSpan.renderer);

	static get observedAttributes() {
		return ["src", "minHeadingLevel", "headingLinks"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case "src":
				let url;
				try {
					url = new URL(newValue, location);
				}
				catch (e) {
					return;
				}

				let prevSrc = this.src;
				this._src = url;

				if (this.src !== prevSrc) {
					fetch(this.src)
					.then(response => response.text())
					.then(text => {
						this._remoteContent = true;
						this.mdContent = text;
						this.render();
					})
					.catch(e => {
						this._remoteContent = false;
					});
				}

				break;
			case "minheadinglevel":
				if (newValue > 0) {
					this._minHeadingLevel = +newValue;

					this.render();
				}
				break;
		}
	}
}


customElements.define("md-block", MarkdownBlock);
customElements.define("md-span", MarkdownSpan);