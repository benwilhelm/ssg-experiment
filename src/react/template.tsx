import React from 'react';
import { TemplateProps } from '../infrastructure/renderers';
import showdown from 'showdown';

const converter = new showdown.Converter();
const Body: React.FC<{ markdown: string }> = ({ markdown }) => {
  const markup = { __html: converter.makeHtml(markdown) };
  return <div dangerouslySetInnerHTML={markup} />;
};

export const PageTemplate: React.FC<TemplateProps> = ({ contentTree }) => {
  const parentNode = contentTree.content;
  const childNodes = contentTree.children.map((c) => c.content);
  return (
    <html>
      <head>
        <title>{parentNode.title}</title>
      </head>
      <body>
        <div>
          <h1>{parentNode.title}</h1>
          <Body markdown={parentNode.body} />

          {childNodes.map((childNode) => (
            <div key={childNode.id}>
              <h2>{childNode.title}</h2>
              <Body markdown={childNode.body} />
            </div>
          ))}
        </div>
      </body>
    </html>
  );
};
