export function releatedPost(related_posts) {
  const rnd = Math.floor(Math.random() * related_posts.length);

  return `
      <div className="">
        <p  style="
        background: #EAEAEA;
        padding: 12px;
        font-weight: 700;
    "  >
          Read More:
          <a
            className="underline"
            href="/p/${related_posts[rnd].slug}"
          >
            ${related_posts[rnd].title.rendered}
          </a>
        </p>
      </div>
      `;
}
