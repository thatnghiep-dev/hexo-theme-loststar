/**
 * Discord emoji filter for hexo-theme-loststar
 *
 * Converts Discord custom emoji syntax in post content to inline images:
 *   <:name:id>   → static PNG from Discord CDN
 *   <a:name:id>  → animated GIF from Discord CDN
 *
 * Usage: Just write Discord emoji syntax in your markdown posts.
 * Example: I'm feeling <:catjam:123456789> today!
 */

const DISCORD_CDN = "https://cdn.discordapp.com/emojis";

// Match <:name:id> and <a:name:id> patterns (escaped or raw)
// Negative lookbehind (?<!`) avoids matching inside inline code
const EMOJI_RE = /(?<!`)(?:&lt;|<)(a?):([A-Za-z0-9_]+):(\d+)(?:&gt;|>)/g;

function renderDiscordEmoji(text) {
	if (!text) return text;
	return text.replace(EMOJI_RE, (_match, animated, name, id) => {
		const ext = animated === "a" ? "gif" : "png";
		const src = `${DISCORD_CDN}/${id}.${ext}`;
		const cls =
			animated === "a"
				? "discord-emoji discord-emoji-animated"
				: "discord-emoji";
		return `<img class="${cls}" src="${src}" alt=":${name}:" title=":${name}:" loading="lazy" />`;
	});
}

hexo.extend.filter.register("after_post_render", (data) => {
	// Sync emoji rendering between post detail and home/archive excerpts.
	data.content = renderDiscordEmoji(data.content);
	data.excerpt = renderDiscordEmoji(data.excerpt);
	if (typeof data.description === "string") {
		data.description = renderDiscordEmoji(data.description);
	}
	return data;
});
