const app = Vue.createApp({
    mixins: Object.values(mixins),
    data() {
        return {
            loading: true,
            hiddenMenu: false,
            showMenuItems: false,
            menuColor: false,
            scrollTop: 0,
            renderers: [],
        };
    },
    created() {
        window.addEventListener("load", () => {
            this.loading = false;
        });
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll, true);
        this.render();
    },
    methods: {
        render() {
            for (let i of this.renderers) i();
        },
        handleScroll() {
            let wrap = this.$refs.homePostsWrap;
            let newScrollTop = document.documentElement.scrollTop;
            if (this.scrollTop < newScrollTop) {
                this.hiddenMenu = true;
                this.showMenuItems = false;
            } else this.hiddenMenu = false;
            if (wrap) {
                if (newScrollTop <= window.innerHeight - 100) this.menuColor = true;
                else this.menuColor = false;
                if (newScrollTop <= 400) wrap.style.top = "-" + newScrollTop / 5 + "px";
                else wrap.style.top = "-80px";
            }
            this.scrollTop = newScrollTop;
        },
    },
});
app.mount("#layout");

// Discord-like spoiler reveal behavior
(function initDiscordSpoiler() {
    function reveal(el) {
        if (!el || el.classList.contains("revealed")) return;
        el.classList.add("revealed");
        el.setAttribute("aria-expanded", "true");
    }

    document.addEventListener("click", (e) => {
        const t = e.target;
        if (t && t.classList && t.classList.contains("discord-spoiler")) {
            reveal(t);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        const t = e.target;
        if (t && t.classList && t.classList.contains("discord-spoiler")) {
            e.preventDefault();
            reveal(t);
        }
    });
})();
