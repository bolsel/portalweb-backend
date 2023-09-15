import { defineHook } from '@directus/extensions-sdk';
import slugifyHook from './slugify';
export default defineHook((fn, context) => {
  slugifyHook(fn, context);
});
