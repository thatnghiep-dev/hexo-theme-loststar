/**
 * Discord spoiler filter for hexo-theme-lostar
 *
 * Converts Discord spoiler syntax in post content:
 *   ||hidden text||
 * into clickable spoiler spans, similar to Discord behavior.
 */

// Match ||spoiler|| blocks (non-greedy)
const SPOILER_RE = /\|\|([\s\S]+?)\|\|/g;

// Avoid transforming inside <pre> / <code> blocks
const SKIP_BLOCK_RE = /(<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>)/gi;

hexo.extend.filter.register("after_post_render", (data) => {
	if (!data.content) return data;

	data.content = data.content
		.split(SKIP_BLOCK_RE)
		.map((part, idx) => {
			// odd indexes are matched <pre>/<code> blocks from the split capture group
			if (idx % 2 === 1) return part;

			return part.replace(SPOILER_RE, (_match, inner) => {
				const text = String(inner || "").trim();
				if (!text) return _match;

				return `<span class="discord-spoiler" role="button" tabindex="0" aria-label="Spoiler" aria-expanded="false">${text}</span>`;
			});
		})
		.join("");

	return data;
});
