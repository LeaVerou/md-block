import {URLs, MarkdownBlock, MarkdownSpan, MarkdownElement} from "./md-block.js";

import create from "https://v2.blissfuljs.com/src/dom/create.js";

// const importURL = new URL("md-block.js", location) + "";
const importURL = "https://md-block.verou.me/md-block.js";
let js = `import {MarkdownBlock, MarkdownSpan, MarkdownElement} from "${importURL}";`;

for (let script of document.querySelectorAll("script[type='text/html'].md-block-demo")) {
	let html = script.textContent;

	html = Prism?.plugins.NormalizeWhitespace?.normalize(html);
	let description = script.previousElementSibling;

	let exampleContainer = create({
		tag: "article",
		className: "demo-container",
		contents: [
			{
				tag: "header",
				contents: [
					description,
					{
						tag: "form",
						action: "https://codepen.io/pen/define",
						method: "POST",
						target: "_blank",
						contents: [
							{
								tag: "input",
								type: "hidden",
								name: "data",
								value: JSON.stringify({
									title: description.textContent,
									html,
									css: "",
									js,
									editors: "1110",
									// head: `<script type="module" src="${importURL}"></script>`
								})
							},
							{
								tag: "button",
								textContent: "Edit in CodePen ↗️"
							}
						],
						after: script,
					}
				]
			},
			{
				tag: "pre",
				class: "language-html demo-code",
				contents: {
					tag: "code",
					textContent: html
				}
			},
			{
				className: "demo-output",
				innerHTML: html
			}
		],
		after: script
	});
}

import * as Stretchy from "https://stretchy.verou.me/dist/stretchy.min.js";
Stretchy.selectors.filter = "#repl *";
Stretchy.init();

repl.addEventListener("input", evt => {
	let {target} = evt;
	let f = repl_container;
	let html = `<${f.tag.value} ${f.attributes.value}>
${f.contents.value}
</${f.tag.value}>`;

	end_tag.textContent = f.tag.value;

	rendering.innerHTML = html;
});

repl.dispatchEvent(new Event("input"));

rendering.addEventListener("md-render", evt => {
	let code = output_html.querySelector("code");
	code.textContent = evt.target.outerHTML;
	Prism.highlightElement(code);
});