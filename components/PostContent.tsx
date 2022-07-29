import Image from "next/image";
import { PlayIcon } from "@heroicons/react/solid";
import { PhotographIcon, VideoCameraIcon } from "@heroicons/react/outline";

// components
import RichTextBlock from "./RichTextBlock";

// types
import { Content, File } from "../type";

export default function PostContent({ content }: { content: Content }) {
  const mediaLink = (file: File) => {
    if (file.thumb_80) {
      return (
        <a href={file.url_private} target="_blank" rel="noreferrer">
          <div style={{ lineHeight: 0 }}>
            <Image
              src={file.thumb_80}
              alt=""
              width={80}
              height={80}
              className="hover:opacity-75"
            />
            <p className="text-xs text-blue-700 hover:underline hover:text-blue-500 mt-1">
              <PhotographIcon className="w-4 h-4 inline-block mr-0.5" />
              拡大を画像
            </p>
          </div>
        </a>
      );
    } else if (file.thumb_video) {
      return (
        <a href={file.url_private} target="_blank" rel="noreferrer">
          <div
            className="relative hover:opacity-90"
            style={{
              width: `80px`,
              height: `80px`,
            }}
          >
            <div
              className="absolute z-0"
              style={{
                width: `80px`,
                height: `80px`,
              }}
            >
              <Image
                src={file.thumb_video}
                alt=""
                layout="fill"
                className="object-cover"
              />
            </div>
            <div className="opacity-50 bg-gray-900 absolute w-full h-full z-10"></div>
            <div className="absolute w-full h-full flex items-center justify-center z-20">
              <PlayIcon className="w-8 h-8 text-blue-100" />
            </div>
          </div>
          <p className="text-xs text-blue-700 hover:underline hover:text-blue-500 mt-1">
            <VideoCameraIcon className="w-4 h-4 inline-block mr-0.5" />
            動画を再生
          </p>
        </a>
      );
    } else {
      return <div>media todo</div>;
    }
  };

  return (
    <>
      <div className="my-3">
        {content.blocks &&
          content.blocks[0].elements &&
          content.blocks[0].elements.map((element, index: number) => {
            if (element.type === "rich_text_section") {
              return (
                <div key={index}>
                  {element.elements.map((block, index) => (
                    <RichTextBlock key={index} block={block} />
                  ))}
                </div>
              );
            } else if (element.type === "rich_text_list") {
              return (
                <ul className="list-disc pl-4 py-2" key={index}>
                  {element.elements.map((innerElement) =>
                    innerElement.elements.map((block, index) => (
                      <li key={index}>
                        <RichTextBlock block={block} />
                      </li>
                    ))
                  )}
                </ul>
              );
            } else {
              return <div>element todo</div>;
            }
          })}
      </div>

      {content.files &&
        content.files.map((file) => (
          <div className="my-3" key={file.id}>
            {mediaLink(file)}
          </div>
        ))}
    </>
  );
}
