import { WithId } from "mongodb";

export interface ArticleListType {
  title: string;
  userAvatar: string;
  userName: string;
  contentId: string;
}

export interface ArticleType extends WithId<Document> {
  id: string;
  title: string;
  content: string;
  createTime: string;
  userId: string;
}
