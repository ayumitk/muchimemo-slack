import Image from "next/image";
import { PlayIcon } from "@heroicons/react/solid";
import { PhotographIcon, VideoCameraIcon } from "@heroicons/react/outline";
import { Youtube } from "@styled-icons/fa-brands/Youtube";

// components
import RichTextBlock from "./RichTextBlock";

// types
import { Content, File, Attachment } from "../type";

export default function PostContent({ content }: { content: Content }) {
  const mediaLink = (file: File) => {
    if (file.thumb_360) {
      return (
        <a href={file.url_private} target="_blank" rel="noreferrer">
          <div className="" style={{ lineHeight: 0 }}>
            <Image
              src={file.thumb_360}
              alt=""
              width={file.thumb_360_w}
              height={file.thumb_360_h}
              className="hover:opacity-70 overflow-hidden rounded-xl drop-shadow-sm"
            />
            {/* <p className="text-xs text-blue-700 hover:underline hover:text-blue-500 mt-1">
              <PhotographIcon className="w-4 h-4 inline-block mr-0.5" />
              拡大を画像
            </p> */}
          </div>
        </a>
      );
    } else if (file.thumb_video) {
      return (
        <a href={file.url_private} target="_blank" rel="noreferrer">
          <div
            className="relative hover:opacity-70 rounded-xl overflow-hidden drop-shadow-sm"
            style={{
              width: `200px`,
              height: `200px`,
            }}
          >
            <div
              className="absolute z-0"
              style={{
                width: `200px`,
                height: `200px`,
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
              <PlayIcon className="w-12 h-12 text-blue-100" />
            </div>
          </div>
          {/* <p className="text-xs text-blue-700 hover:underline hover:text-blue-500 mt-1">
            <VideoCameraIcon className="w-4 h-4 inline-block mr-0.5" />
            動画を再生
          </p> */}
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

      {content.attachments &&
        content.attachments.map((attachment: Attachment) => {
          if (
            attachment.from_url &&
            !attachment.from_url.match(/twitter.com/)
          ) {
            return (
              <div key={attachment.id} className="my-3">
                <a
                  href={attachment.from_url}
                  className="block bg-white rounded-xl overflow-hidden drop-shadow-sm hover:opacity-70"
                  target="_blank"
                  style={{
                    maxWidth: `${
                      attachment.image_width
                        ? attachment.image_width
                        : attachment.thumb_width
                    }px`,
                  }}
                  rel="noreferrer"
                >
                  {attachment.image_url && (
                    <Image
                      src={attachment.image_url}
                      width={attachment.image_width}
                      height={attachment.image_height}
                      alt={attachment.title}
                      layout="responsive"
                      style={{
                        backgroundImage: "url(/placeholder.svg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  )}
                  {attachment.thumb_url && (
                    <Image
                      src={attachment.thumb_url}
                      width={attachment.thumb_width}
                      height={attachment.thumb_height}
                      alt={attachment.title}
                      layout="responsive"
                    />
                  )}
                  <div className="p-4">
                    <p className="font-bold">
                      {(attachment.from_url.match(/youtu.be/) ||
                        attachment.from_url.match(/youtube.com/)) && (
                        <Youtube className="w-6 h-6 mr-1 text-red-500" />
                      )}
                      {attachment.title}
                    </p>
                    {attachment.text && (
                      <p className="text-sm text-gray-600 mt-1">
                        {attachment.text}
                      </p>
                    )}
                  </div>
                </a>
              </div>
            );
          }
        })}
    </>
  );
}
