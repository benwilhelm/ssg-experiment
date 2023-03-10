export interface Content {
  id?: string;
  title: string;
  body: string;

  children: string[];
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

export type ContentTree = {
  content: Content;
  children: ContentTree[];
};
