// components
import PostContent from "./PostContent";
import Icon from "./Icon";

// types
import { PostType } from "../type";

export default function ReplyItem({
  replyTs,
  allPosts,
}: {
  replyTs: string;
  allPosts: Array<PostType>;
}) {
  const replies = allPosts.map((post: PostType) =>
    post.contents.find((content) => content.ts === replyTs)
  );
  const replyContent = replies.filter((reply) => reply !== undefined);

  return (
    <li className="mt-2" id={replyContent[0] && replyContent[0].client_msg_id}>
      <div className="flex items-start justify-end">
        <div className="bg-gray-100 px-4 md:px-6 py-2 md:py-3 rounded-3xl">
          {replyContent[0]?.blocks && <PostContent content={replyContent[0]} />}
        </div>
        <div className="border-solid border-l-gray-100 border-l-8 border-y-transparent border-y-8 border-r-0 mt-5 sm:mt-7" />
        {replyContent[0] && <Icon content={replyContent[0]} />}
      </div>
    </li>
  );
}
