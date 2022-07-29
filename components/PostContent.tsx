import Image from "next/image";

// components
import RichTextBlock from "./RichTextBlock";

// types
import { Content } from "../type";

export default function PostContent({ content }: { content: Content }) {
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
                      <RichTextBlock key={index} block={block} />
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
          <div className="mt-4" key={file.id}>
            {file.thumb_360 ? (
              <a href={file.url_private} target="_blank" rel="noreferrer">
                <Image
                  src={file.thumb_360}
                  alt=""
                  width={file.thumb_360_w}
                  height={file.thumb_360_h}
                />
              </a>
            ) : (
              <video
                controls
                muted
                width={file.thumb_video_w ? file.thumb_video_w / 3 : 360}
              >
                <source src={file.mp4} type="video/mp4" />
              </video>
            )}
          </div>
        ))}
    </>
  );
}
