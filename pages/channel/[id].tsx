import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { getChannelPost } from "../../lib/api";
import Head from "next/head";
import Image from "next/image";

import channels from "../../data/channels.json";
import users from "../../data/users.json";

import { TwitterTweetEmbed } from "react-twitter-embed";

import twemoji from "twemoji";
import Twemoji from "react-twemoji";

import moment from "moment";

type AllPosts = {
  allPosts: Array<Post>;
};

type Post = {
  slug: string;
  contents: Array<Content>;
};

type Content = {
  subtype?: string;
  parent_user_id?: string;
  blocks?: Array<Block>;
  ts: string;
  files?: Array<File>;
  user: string;
  reply_count?: number;
  replies?: Array<Reply>;
};

type Block = {
  type: string;
  range?: string;
  text?: string;
  url?: string;
  unicode?: string;
  elements?: Array<Element>;
};

type Element = {
  type: string;
  elements: Array<Element>;
};

type Reply = {
  user: string;
  ts: string;
};

type File = {
  id: string;
  thumb_360?: string;
  thumb_360_w?: number;
  thumb_360_h?: number;
  mp4?: string;
  thumb_video_w?: number;
};

export default function Post({ allPosts }: AllPosts) {
  const router = useRouter();
  const { id } = router.query;

  if (!router.isFallback && !allPosts) {
    return <ErrorPage statusCode={404} />;
  }

  const richTextType = (element: Element, index: number) => {
    if (element.type === "rich_text_section") {
      return (
        <div key={index}>
          {element.elements.map((block, index: number) => (
            <span key={index}>{richTextBlock(block)}</span>
          ))}
        </div>
      );
    } else if (element.type === "rich_text_list") {
      return (
        <ul key={index} className="list-disc pl-4 py-2">
          {element.elements.map((innerElement) =>
            innerElement.elements.map((block, index: number) => (
              <li key={index}>{richTextBlock(block)}</li>
            ))
          )}
        </ul>
      );
    } else {
      return "element todo";
    }
  };

  const richTextBlock = (block: Block) => {
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
        return (
          twitterPostId !== undefined && (
            <TwitterTweetEmbed tweetId={twitterPostId} />
          )
        );
      } else {
        return (
          <a
            href={block.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            {block.url}
          </a>
        );
      }
    } else if (block.type === "broadcast") {
      return <span>@{block.range}</span>;
    } else {
      return "block todo";
    }
  };

  const showReply = (ts: string) => {
    for (let i = 0; i < allPosts.length; i++) {
      const reply = allPosts[i].contents.find((content) => content.ts === ts);
      if (reply !== undefined) {
        return reply;
      }
    }
  };

  const getUserName = (userId: string) => {
    const userData = users.find((user) => user.id === userId);
    return userData && userData.real_name;
  };

  const showDate = (post: Post) => {
    const filteredPosts = post.contents.filter(
      (content) =>
        content.subtype === undefined && content.parent_user_id === undefined
    );
    if (filteredPosts.length > 0) {
      return (
        <p className="mb-4 mt-12 text-center overflow-hidden text-gray-500 date">
          {moment(post.slug, "YYYY-MM-DD").format("YYYY年MM月DD日")}
        </p>
      );
    }
  };

  const channel = channels.find((channel) => channel.id === id);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="container max-w-screen-md mx-auto my-10">
        <h1 className="text-5xl font-bold text-center mb-4">
          {channel && channel.name}
        </h1>
        <p className="text-center">{channel && channel.purpose.value}</p>
      </header>

      <main className="container max-w-screen-md mx-auto my-10">
        <div className="mx-2">
          {allPosts.map((post) => (
            <div key={post.slug}>
              {showDate(post)}
              <ul>
                {post.contents.map(
                  (content, index: number) =>
                    !content.parent_user_id &&
                    (content.blocks || content.files) &&
                    content.subtype !== "channel_join" && (
                      <li key={index} className="mb-4">
                        <div className="bg-blue-50 p-4 md:p-6 rounded-3xl break-all">
                          <p className="font-bold">
                            {getUserName(content.user)}
                          </p>
                          <div>
                            {content.blocks &&
                              content.blocks[0].elements &&
                              content.blocks[0].elements.map(
                                (element, index: number) =>
                                  richTextType(element, index)
                              )}
                          </div>

                          {content.files &&
                            content.files.map((file) => (
                              <div className="mt-4" key={file.id}>
                                {file.thumb_360 ? (
                                  <Image
                                    src={file.thumb_360}
                                    alt=""
                                    width={file.thumb_360_w}
                                    height={file.thumb_360_h}
                                  />
                                ) : (
                                  <video
                                    controls
                                    muted
                                    width={
                                      file.thumb_video_w
                                        ? file.thumb_video_w / 3
                                        : 360
                                    }
                                  >
                                    <source src={file.mp4} type="video/mp4" />
                                  </video>
                                )}
                              </div>
                            ))}
                        </div>

                        {content.reply_count && (
                          <ul className="ml-12 md:ml-14 mb-8">
                            {content.replies &&
                              content.replies.map((reply) => (
                                <li key={reply.ts} className="mt-2">
                                  <div className="bg-gray-100 p-4 md:p-6 rounded-3xl">
                                    <p className="font-bold">
                                      {getUserName(showReply(reply.ts).user)}
                                    </p>
                                    {showReply(reply.ts).blocks[0].elements.map(
                                      (element, index) =>
                                        richTextType(element, index)
                                    )}
                                  </div>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    )
                )}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

type Params = {
  params: {
    id: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const allPosts = getChannelPost(params.id);

  return {
    props: { allPosts },
  };
}

export async function getStaticPaths() {
  return {
    paths: channels.map((channel) => {
      return {
        params: {
          id: channel.id,
        },
      };
    }),
    fallback: false,
  };
}