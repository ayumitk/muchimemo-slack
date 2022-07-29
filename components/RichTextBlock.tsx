import twemoji from "twemoji";
import Twemoji from "react-twemoji";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Youtube } from "@styled-icons/fa-brands/Youtube";
import Image from "next/image";

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
    } else if (block.url.match(/youtu.be/) || block.url.match(/youtube.com/)) {
      const youtubePostId = block.url
        .replace(/\?.*$/, "")
        .replace(/\/+$/, "")
        .split("/")
        .pop();
      return (
        <a href={block.url} target="_blank" rel="noreferrer">
          <div
            className="relative hover:opacity-90"
            style={{
              width: `120px`,
              height: `90px`,
            }}
          >
            <div
              className="absolute z-0"
              style={{
                width: `120px`,
                height: `90px`,
              }}
            >
              <Image
                src={`https://img.youtube.com/vi/${youtubePostId}/default.jpg`}
                alt=""
                layout="fill"
                className="object-cover"
              />
            </div>
            <div className="opacity-50 bg-gray-900 absolute w-full h-full z-10"></div>
            <div className="absolute w-full h-full flex items-center justify-center z-20">
              <Youtube className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <p className="text-xs text-red-500 hover:underline hover:text-red-400 mt-1">
            <Youtube className="w-4 h-4 inline-block mr-0.5" />
            Youtubeで見る
          </p>
        </a>
      );
    } else {
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-700 break-all hover:underline hover:text-blue-500"
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
