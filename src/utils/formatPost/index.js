import * as cheerio from "cheerio";
import { releatedPost } from "./relatedPost";
import { youtube_parser, getYtEmbed } from "./youtubeFormatter";
import tweetFormatter from "./formatTweets";
import { readingTime } from "reading-time-estimator";
export default async function formatWPPostContent(post) {
  if (!post && !post.content && !post.rendered) {
    console.log("No Data Was Found");
    return;
  }

  let formattedPost = post;
  formattedPost.categories = post.category;

  let iframes = [];
  const $ = cheerio.load(post.content.rendered, null, false);

  $("iframe").each((i, el) => {
    if (el.attribs && el.attribs.src) {
      iframes.push(el.attribs.src);
    }
  });
  // console.log({ iframes });
  const iframeSrc = $("iframe").attr("src");
  const isYtEmbed = iframeSrc?.includes("youtube");
  const tweetBlockQuotes = $(".twitter-tweet a");
  const scriptSrc = $("script").attr("src");
  const isTweetEmbed = scriptSrc?.includes("twitter");
  let test = [];

  $($("p")[1]).append(releatedPost(post.related_posts));
  tweetBlockQuotes.filter((t, y) => {
    const href = y.attribs.href;
    test.push(href);
  });

  if (isTweetEmbed !== undefined && isTweetEmbed === true);
  {
    // $("script").replaceWith("");

    formattedPost.twitter_embed = false;
    formattedPost.twitter_html = test;
  }

  $("img").each((i, el) => {
    $(el).addClass("lozad");

    $(el).attr("data-srcset", $(el).attr("srcset"));
    $(el).attr("data-src", $(el).attr("src"));

    $(el).attr("srcset", "");
    $(el).attr("src", "");
  });

  $("p").each((i, p) => {
    if (i % 4 === 0) {
      $(p).append(
        $(
          `<div class="google-auto-ads flex justify-center lg:block  my-8">${autoAds()}</div>`
        )
      );
    }
  });

  $("blockquote .google-auto-ads").remove();
  $("img").each((i, el) => {
    $(el).addClass("lozad");
  });
  if (
    $("img") &&
    $("img")?.parent() &&
    $("img")?.parent()?.attr("href") &&
    $("img")?.parent()?.attr("href").length > 0
  ) {
    $("img")?.unwrap();
  }
  if (isYtEmbed) {
    if (iframes.length > 0) {
      iframes.forEach((src) => {
        const embedId = youtube_parser(src);

        $(`iframe[src^="${src}"]`).replaceWith(
          getYtEmbed(embedId, post.title.rendered)
        );
      });
    }
    // $("iframe").replaceWith(getYtEmbed(embedId, post.title.rendered));

    formattedPost.yt_embedd = iframeSrc;
  }

  const htmlContentBeforeTweetFormat = $.html()
    .replaceAll(`secureback.hiptoro.com`, `www.hiptoro.com`)
    .replaceAll(
      "https://www.hiptoro.com/wp-content/uploads/",
      "https://secureback.hiptoro.com/wp-content/uploads/"
    );
  const afterTweetFormat = await tweetFormatter(htmlContentBeforeTweetFormat);

  formattedPost.content.rendered = afterTweetFormat;
  (formattedPost.timeToRead = readingTime(post.content.rendered)),
    (formattedPost.author = {
      ...post.author,

      slug: post.author.name.toLowerCase() + "-" + post.author.id,
    });

  return formattedPost;
}
function autoAds() {
  return `
   
 <ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-7099984888351146"
     data-ad-slot="5392495815"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
 
  `;
}
