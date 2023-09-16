import { defineHook } from '@directus/extensions-sdk';
import { generateSlugByCollection } from '../utils';

type _Input = {
  title: string;
  slug?: string;
};

export default defineHook((fn, context) => {
  const { filter } = fn;

  const slugifyInput = async ({ _input, collection, database }) => {
    const input: _Input = _input as _Input;
    input.slug = await generateSlugByCollection({ database, collection, text: input.slug ?? input.title });
    return input;
  };

  const collections: string[] = ['documents', 'news', 'organization_documents', 'public_services', 'web_news'];

  collections.forEach((collection) => {
    filter(`${collection}.items.create`, (_input, { collection }, { database }) =>
      slugifyInput({ _input, collection, database })
    );
  });
});
