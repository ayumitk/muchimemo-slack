import twemoji from "twemoji";
import Twemoji from "react-twemoji";
import { TwitterTweetEmbed } from "react-twitter-embed";

// types
import { Block } from "../type";

export default function RichTextBlock({ block }: { block: Block }) {
  if (block.type === "text" && block.text) {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: block.text.replace(/\n/g, "<br />"),
        }}
      />
    );
  } else if (block.type === "emoji" && block.unicode) {
    return (
      <Twemoji tag="span" options={{ className: "twemoji" }}>
        {twemoji.convert.fromCodePoint(block.unicode)}
      </Twemoji>
    );
  } else if (block.type === "link" && block.url) {
    if (block.url.match(/twitter.com/) && !block.url.match(/i\/events/)) {
      const twitterPostId = block.url
        .replace(/\?.*$/, "")
        .replace(/\/+$/, "")
        .split("/")
        .pop();

      if (twitterPostId !== undefined) {
        return <TwitterTweetEmbed tweetId={twitterPostId} />;
      }
    } else {
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline break-all"
        >
          {block.url}
        </a>
      );
    }
  } else if (block.type === "broadcast") {
    return <span>@{block.range}</span>;
  }
  return <span>block todo</span>;
}
