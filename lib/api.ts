import fs from "fs";
import { join } from "path";
import { isNotJunk } from "junk";

export function getChannelPostDate(id: string) {
  return fs.readdirSync(join(process.cwd(), "data", id)).filter(isNotJunk);
}

export function getPostBySlug(slug: string, id: string) {
  const realSlug = slug.replace(/\.json$/, "");
  const fullPath = join(join(process.cwd(), "data", id), `${realSlug}.json`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  type Items = {
    [key: string]: string;
  };

  const items: Items = {};

  items["slug"] = realSlug;
  items["contents"] = JSON.parse(fileContents);

  return items;
}

// for getStaticProps
export function getChannelPost(id: string) {
  const dates = getChannelPostDate(id);
  const posts = dates
    .map((date) => getPostBySlug(date, id))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.slug < post2.slug ? -1 : 1));
  return posts;
}
