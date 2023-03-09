import { v4 as uuid } from 'uuid';

export interface Content {
  id?: string;
  title: string;
  body: string;

  children: string[];
}

interface Template {}

abstract class ContentRepository {
  abstract readContent(id: string): Promise<Content>;
  abstract writeContent(content: Content): Promise<Content>;
  abstract getContentTree(id: string): Promise<ContentTree>;
}

export class Page implements Content {
  id?: string;
  title: string;
  body: string;
  children: string[] = [];

  constructor(pageDef: Content) {
    this.id = pageDef.id;
    this.title = pageDef.title;
    this.body = pageDef.body;
    this.children = pageDef.children;
  }
}

type ContentTree = {
  content: Content;
  children: ContentTree[];
};

export class InMemoryContentRepository extends ContentRepository {
  private contentRecord: Record<string, Content> = {};

  async readContent(id: string) {
    return this.contentRecord[id];
  }

  async writeContent(content: Content) {
    content.id ||= uuid();
    this.contentRecord[content.id] = content;
    return content;
  }

  async getContentTree(id: string, maxDepth = 3): Promise<ContentTree> {
    const content = await this.readContent(id);
    const children =
      maxDepth > 0
        ? await Promise.all(
            content.children.map((id) => this.getContentTree(id, maxDepth - 1))
          )
        : [];

    return { content, children };
  }
}
