import { v4 as uuid } from 'uuid';
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';
import fm from 'front-matter';
import yaml from 'yaml';

import { Content, ContentTree } from '../domain';

abstract class ContentRepository {
  abstract readContent(id: string): Promise<Content>;
  abstract writeContent(content: Content): Promise<Content>;

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
}

interface FSContentRepoConfig {
  baseDirectory: string;
}

export class FileSystemContentRepository extends ContentRepository {
  constructor(private config: FSContentRepoConfig) {
    super();
  }

  async readContent(filePath: string) {
    const fullPath = path.join(this.config.baseDirectory, filePath);
    const fileContent = await readFile(fullPath, 'utf-8');
    const file = fm(fileContent);

    const { title, children } = file.attributes as Content;
    return {
      id: filePath,
      title: title || '',
      children: children || [],
      body: file.body,
    };
  }

  async writeContent(content: Content) {
    const { body, id, ...attributes } = content;
    if (!id) {
      throw new Error("Can't write file with no id (filepath)");
    }

    const fullPath = path.join(this.config.baseDirectory, id);
    const fileContent = markdownWithFrontMatter(body, attributes);
    await writeFile(fullPath, fileContent, 'utf-8');
    return content;
  }
}

const markdownWithFrontMatter = (
  markdown: string,
  attributes: Record<string, unknown>
) => {
  const frontMatter = yaml.stringify(attributes);

  // prettier-ignore
  return [
    '---',
    frontMatter,
    '---',
    '',
    markdown
  ].join('\n')
};
