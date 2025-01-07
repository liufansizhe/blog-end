import { WithId } from "mongodb";

//返回前端的数据
export interface ArticleListType {
  title: string;
  userAvatar: string;
  userName: string;
  contentId: string;
  createTime: string;
  describe: string;
  praise: number;
  collect: number;
}

//数据库里数据结构
export interface ArticleType extends WithId<Document> {
  id: string;
  title: string;
  content: string;
  createTime: string;
  userId: string;
  describe: string;
  praise: number;
  collect: number;
}
