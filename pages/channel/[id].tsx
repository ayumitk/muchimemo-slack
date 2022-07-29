import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { getChannelPost } from "../../lib/api";

// json
import channels from "../../data/channels.json";

// components
import PostContent from "../../components/PostContent";
import ReplyItem from "../../components/ReplyItem";
import Date from "../../components/Date";
import Layout from "../../components/Layout";
import Icon from "../../components/Icon";
import SearchModal from "../../components/SearchModal";

// types
import { AllPosts, Params } from "../../type";

export default function Post({ allPosts }: AllPosts) {
  const router = useRouter();
  const { id } = router.query;

  if (!router.isFallback && !allPosts) {
    return <ErrorPage statusCode={404} />;
  }

  const channel = channels.find((channel) => channel.id === id);
  const title = channel ? channel.name : "";
  const description = channel ? channel.purpose.value : "";

  return (
    <Layout title={title} h1={title} description={description}>
      <>
        <SearchModal allPosts={allPosts} />

        {allPosts.map((post) => (
          <div key={post.slug}>
            <Date post={post} />
            <ul>
              {post.contents.map(
                (content, index: number) =>
                  !content.parent_user_id &&
                  (content.blocks || content.files) &&
                  content.subtype !== "channel_join" && (
                    <li key={index} className="mb-4" id={content.client_msg_id}>
                      <div className="flex items-start">
                        <Icon content={content} />
                        <div className="border-solid border-r-blue-50 border-r-8 border-y-transparent border-y-8 border-l-0 mt-5 sm:mt-7" />
                        <div className="bg-blue-50 p-4 md:p-6 rounded-3xl">
                          <PostContent content={content} />
                        </div>
                      </div>

                      {content.reply_count && (
                        <ul className="ml-0 md:ml-28 mb-8">
                          {content.replies &&
                            content.replies.map((reply) => (
                              <ReplyItem
                                replyTs={reply.ts}
                                key={reply.ts}
                                allPosts={allPosts}
                              />
                            ))}
                        </ul>
                      )}
                    </li>
                  )
              )}
            </ul>
          </div>
        ))}
      </>
    </Layout>
  );
}

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
