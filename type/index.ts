export type AllPosts = {
  allPosts: Array<PostType>;
};

export type PostType = {
  slug: string;
  contents: Array<Content>;
};

export type Content = {
  subtype?: string;
  parent_user_id?: string;
  blocks?: Array<Block>;
  ts: string;
  files?: Array<File>;
  user: string;
  reply_count?: number;
  replies?: Array<Reply>;
  text: string;
  client_msg_id: string;
};

export type Block = {
  type: string;
  range?: string;
  text?: string;
  url?: string;
  unicode?: string;
  elements?: Array<Element>;
};

export type Element = {
  type: string;
  elements: Array<Element>;
};

export type Reply = {
  user: string;
  ts: string;
};

export type File = {
  id: string;
  thumb_80?: string;
  mp4?: string;
  url_private: string;
  thumb_video?: string;
};

export type Params = {
  params: {
    id: string;
  };
};
