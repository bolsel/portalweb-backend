export function makeRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export async function generateSlugByCollection({ database, collection, text, slugMaxCount = 80 }) {
  const slug = text
    .toLowerCase()
    .substring(0, slugMaxCount)
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const c = await database(collection).where({ slug }).count('slug').first();
  if (c && c.count && c.count > 0) {
    const newSlug = `${slug}-${makeRandomString(4)}`;
    return await generateSlugByCollection({ database, collection, text: newSlug, slugMaxCount: newSlug.length });
  }
  return slug;
}
