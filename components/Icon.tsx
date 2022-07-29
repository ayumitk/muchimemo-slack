import Image from "next/image";

// json
import users from "../data/users.json";

// types
import { Content } from "../type";

export default function Icon({ content }: { content: Content }) {
  const userData = users.find((user) => user.id === content.user);
  const name = userData && userData.real_name;
  const avatar = userData
    ? userData.profile.image_72
    : "https://secure.gravatar.com/avatar/c61e328c9e5331e15fbbfaac3326fd4c.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0025-72.png";
  // console.log(userData);

  return (
    <div className="shrink-0 text-center mr-0.5 sm:mr-2 w-10 sm:w-14 mt-2">
      <div className="w-10 sm:w-14 h-10 sm:h-14 relative">
        <Image
          src={avatar}
          alt={`${name}のアイコン`}
          layout="fill"
          className="rounded-full object-cover"
        />
      </div>
      <p className="font-bold text-xs md:text-sm mt-2 leading-tight md:leading-tight break-all">
        {name}
      </p>
    </div>
  );
}
