import moment from "moment";

// types
import { PostType } from "../type";

export default function Date({ post }: { post: PostType }) {
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

  return <></>;
}
