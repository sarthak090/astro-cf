import axios from "axios";
import * as cheerio from "cheerio";

const getFirstRedirect = async (url) => {
  try {
    const response = await axios.get(url, { maxRedirects: 0 });
    // If the request is successful, and there are no redirects, the response will contain the data you need.
    // If there are redirects, the response will have a "status" property indicating the status code (e.g., 301 for permanent redirect).
    return response;
  } catch (error) {
    if (
      error.response &&
      error.response.status >= 300 &&
      error.response.status < 400
    ) {
      // If the error is a redirection, the response headers will contain the "location" header with the URL to redirect.
      const redirectUrl = error.response.headers.location;
      return redirectUrl;
    } else {
      // Handle other errors
      throw error;
    }
  }
};
export default async function tweetFormatter(renderedContent) {
  const $ = cheerio.load(renderedContent, null, false);

  const tweetBlockQuotes = $(".twitter-tweet a");

  for (let i = 0; i < tweetBlockQuotes.length; i++) {
    const tweetAnchorTag = tweetBlockQuotes[i];

    if (
      tweetAnchorTag &&
      tweetAnchorTag.attribs &&
      tweetAnchorTag.attribs.href
    ) {
      const tweetUrl = await getFirstRedirect(tweetAnchorTag.attribs.href);
      const tweetHtml = await getTweetHtml(tweetUrl);

      if (tweetUrl.includes("https://twitter.com/")) {
        $(tweetAnchorTag).parent().parent().replaceWith(`
         <div class="tweet-static-embed">${tweetHtml}</div>
        `);
      }
    }
  }

  const formattedWithTweet = $.html().replace(
    /https:\/\/platform\.twitter\.com\/widgets\.js/g,
    ""
  );
  return formattedWithTweet;

  // const $ = cheerio.load(renderedContent, null, false);

  // const tweetBlockQuotes = $(".twitter-tweet a");

  // //   console.log(tweetBlockQuotes[0].attribs.href);

  // tweetBlockQuotes.each(async (t, y) => {
  //   // console.log(y.attribs.href);
  //   if (y && y.attribs && y.attribs.href) {
  //     const tweetUrl = await getFirstRedirect(y.attribs.href);
  //     if (tweetUrl.includes("https://twitter.com/")) {
  //       $(y).parent().parent().replaceWith(`
  //       <div class="lozad" data-twitter-src="${tweetUrl}"></div>
  //   `);
  //     }

  //     // const tweetUrl = await getFirstRedirect(y.attribs.href);
  //     // if (typeof tweetUrl === "string" && tweetUrl.includes("https")) {
  //     //   const staticUrl = getUrlUpToPathAfterStatus(tweetUrl);
  //     //   const staticData = await getTweetHtml(staticUrl);
  //     // }
  //   }
  // });

  // const formattedWithTweet = $.html();
  // // console.log({ formattedWithTweet });
  // return formattedWithTweet;
}
function getUrlUpToPathAfterStatus(url) {
  const regex = /(status\/[^/]+\/)/;
  const match = url.match(regex);

  if (match && match.length > 1) {
    const statusPath = match[1];
    const index = url.indexOf(statusPath);

    if (index !== -1) {
      return url.substring(0, index + statusPath.length);
    }
  }

  return null; // Return null if no valid path segment is found
}

async function getTweetHtml(url = "") {
  if (url.length > 0 && url.includes("https://twitter.com")) {
    const tweetUrlFormatted = getUrlUpToPathAfterStatus(url);
    try {
      const Urlq = `https://tweetic.zernonia.com/api/tweet?url=${tweetUrlFormatted}&show_media=true`;

      const tweet = await axios(Urlq).then((r) => r.data);

      return reformatHtml(tweet.html);
    } catch (err) {
      console.log("err");
      return ``;
    }
  } else {
    return "";
  }
}
function reformatHtml(tweet) {
  const $ = cheerio.load(tweet, null, false);
  $("img").each((i, el) => {
    $(el).attr("alt", "profile img");
    $(el).addClass("lozad");
    $(el).attr("data-src", $(el).attr("src"));
    $(el).attr("src", "");
    $(el).attr("width", "500");
    $(el).attr("height", "500");
    $(el).css("height", "auto");
  });
  $("video").each((i, el) => {
    $(el).addClass("lozad");
    $(el).attr("data-src", $(el).attr("src"));
    $(el).attr("src", "");
  });

  return $.html();
}
