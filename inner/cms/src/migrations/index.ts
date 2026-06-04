import * as migration_20260604_112404_initial from './20260604_112404_initial';
import * as migration_20260604_120028_add_blog_posts from './20260604_120028_add_blog_posts';

export const migrations = [
  {
    up: migration_20260604_112404_initial.up,
    down: migration_20260604_112404_initial.down,
    name: '20260604_112404_initial',
  },
  {
    up: migration_20260604_120028_add_blog_posts.up,
    down: migration_20260604_120028_add_blog_posts.down,
    name: '20260604_120028_add_blog_posts'
  },
];
