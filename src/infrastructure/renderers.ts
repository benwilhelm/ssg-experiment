import * as path from 'path';
import { writeFile } from 'fs/promises';
import { ContentTree } from '../domain';
import * as ReactDOMServer from 'react-dom/server';
import React from 'react';

type Template = (contentTree: ContentTree) => string;

export interface TemplateProps {
  contentTree: ContentTree;
}

export const makeReactTemplate = (component: React.FC<TemplateProps>) => {
  return (contentTree: ContentTree) =>
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(component, { contentTree }, null)
    );
};

interface ReactRendererConfig {
  baseDirectory: string;
}

export class ReactRenderer {
  constructor(private config: ReactRendererConfig) {}

  private fullPath(relativePath: string) {
    return path.resolve(this.config.baseDirectory, relativePath);
  }

  async render(contentTree: ContentTree, template: Template) {
    const markup = template(contentTree);
    if (!contentTree.content.id) {
      throw new Error("Can't write file without an id (filePath)");
    }
    const relativePath = contentTree.content.id.replace(/\.md$/, '.html');
    const outPath = this.fullPath(relativePath);
    await writeFile(outPath, markup, 'utf-8');
  }
}
