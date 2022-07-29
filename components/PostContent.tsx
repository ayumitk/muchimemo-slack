import Image from "next/image";

// components
import RichTextBlock from "./RichTextBlock";

// types
import { Content, File } from "../type";

export default function PostContent({ content }: { content: Content }) {
  const mediaLink = (file: File) => {
    if (file.thumb_80) {
      return (
        <a href={file.url_private} target="_blank" rel="noreferrer">
          <Image
            src={file.thumb_80}
            alt=""
            width={80}
            height={80}
            className="hover:opacity-75"
          />
          <p className="text-xs text-blue-700 hover:underline hover:text-blue-500">
            拡大画像を見る
          </p>
        </a>
      );
    } else if (file.thumb_video && file.thumb_video_w && file.thumb_video_h) {
      return (
        <a href={file.url_private} target="_blank" rel="noreferrer">
          <Image
            src={file.thumb_video}
            alt=""
            width={file.thumb_video_w / 4}
            height={file.thumb_video_h / 4}
            className="hover:opacity-75"
          />
          <p className="text-xs text-blue-700 hover:underline hover:text-blue-500">
            動画を再生する
          </p>
        </a>
      );
    } else {
      return <div>media todo</div>;
    }
  };

  return (
    <>
      <div>
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
          <div className="mt-3" key={file.id}>
            {mediaLink(file)}
          </div>
        ))}
    </>
  );
}
