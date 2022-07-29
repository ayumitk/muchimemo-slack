import { useState, FormEvent, Fragment } from "react";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { getChannelPost } from "../../lib/api";
import { Link as Scroll } from "react-scroll";

import { Dialog, Transition } from "@headlessui/react";
import { ArrowRightIcon, SearchIcon } from "@heroicons/react/outline";

// json
import channels from "../../data/channels.json";

// components
import PostContent from "../../components/PostContent";
import ReplyItem from "../../components/ReplyItem";
import Date from "../../components/Date";
import Layout from "../../components/Layout";
import Icon from "../../components/Icon";

// types
import { AllPosts, Params } from "../../type";

export default function Post({ allPosts }: AllPosts) {
  const router = useRouter();
  const { id } = router.query;

  const [searchKeyword, updateSearchKeyword] = useState("");
  const [open, setOpen] = useState(false);

  if (!router.isFallback && !allPosts) {
    return <ErrorPage statusCode={404} />;
  }

  const channel = channels.find((channel) => channel.id === id);
  const title = channel ? channel.name : "";
  const description = channel ? channel.purpose.value : "";

  const onInput = (event: FormEvent<HTMLInputElement>) => {
    updateSearchKeyword(event.currentTarget.value);
  };

  const reg = new RegExp(searchKeyword);
  const filteredList = allPosts
    .map((post) => post.contents.filter((content) => reg.test(content.text)))
    .filter((post) => post.length > 0);

  return (
    <Layout title={title} h1={title} description={description}>
      <div
        className="sticky top-0 z-10 bg-white pt-1"
        onClick={() => setOpen(true)}
      >
        <div className="border-2 border-gray-300 rounded-full cursor-pointer bg-gray-50 p-4 hover:bg-gray-100 text-gray-500 flex item-center text-lg">
          <SearchIcon className="w-6 h-6 inline-block mr-2" />
          キーワード
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-screen-md w-full">
                  <div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <input
                        name="search"
                        type="text"
                        placeholder="キーワード"
                        onInput={onInput}
                        className="text-2xl sm:text-3xl p-6 sm:p-12 w-full border-b-2 border-gray-300 bg-gray-50 outline-0"
                      />
                    </form>
                    <nav className="overflow-scroll h-96">
                      {searchKeyword === "" ? (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          <div>検索結果が表示されます</div>
                        </div>
                      ) : (
                        filteredList.map((post) =>
                          post.map((content) => (
                            <Scroll
                              to={content.client_msg_id}
                              smooth={true}
                              duration={600}
                              offset={-80}
                              key={content.client_msg_id}
                              className="overflow-hidden text-ellipsis whitespace-nowrap block border-b border-gray-300 py-6 pl-2 sm:pl-8 pr-4 sm:pr-12 cursor-pointer hover:bg-gray-100"
                              onClick={() => setOpen(false)}
                            >
                              <ArrowRightIcon className="w-5 h-5 inline-block mr-2 text-blue-300" />
                              {content.text}
                            </Scroll>
                          ))
                        )
                      )}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

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
