import { Content, InMemoryContentRepository } from './domain';

const child1: Content = {
  id: 'child1',
  title: 'Child 1',
  body: 'Ad do amet occaecat officia enim exercitation minim. Est sit enim amet fugiat culpa officia minim magna mollit. Laborum ullamco nisi reprehenderit anim enim anim veniam excepteur officia pariatur nostrud. Dolore veniam ex quis duis duis sit.',
  children: [],
};

const child2: Content = {
  id: 'child2',
  title: 'Child 2',
  body: 'Ullamco id aute aliqua veniam excepteur anim est ullamco deserunt excepteur sint consequat est veniam. Magna nostrud non nostrud cupidatat nulla amet. Nisi laborum proident consequat sunt minim id nostrud eu aute non non pariatur ad. Cillum id laborum sit nulla ex magna voluptate adipisicing aute sit sit elit. Reprehenderit officia non exercitation nulla quis pariatur amet laborum officia quis.',
  children: ['parent'],
};

const parent: Content = {
  id: 'parent',
  title: 'Parent',
  body: 'Dolore ex veniam ut voluptate non. Sit dolor amet elit incididunt. Aliquip excepteur officia minim labore. Dolore proident eiusmod quis eiusmod cillum aute consectetur nisi enim.',
  children: ['child1', 'child2'],
};

const repo = new InMemoryContentRepository();

(async () => {
  await repo.writeContent(child1);
  await repo.writeContent(child2);
  await repo.writeContent(parent);

  console.log(await repo.getContentTree('parent'));
})();
