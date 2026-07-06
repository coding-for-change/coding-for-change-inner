import * as migration_20260604_112404_initial from './20260604_112404_initial';
import * as migration_20260604_120028_add_blog_posts from './20260604_120028_add_blog_posts';
import * as migration_20260604_123322_add_forms_and_mcp from './20260604_123322_add_forms_and_mcp';
import * as migration_20260604_154011_add_site_config_stats from './20260604_154011_add_site_config_stats';
import * as migration_20260604_154226_add_companies from './20260604_154226_add_companies';
import * as migration_20260608_205054_advisers_companies_booking from './20260608_205054_advisers_companies_booking';
import * as migration_20260610_193625_team_orderable from './20260610_193625_team_orderable';
import * as migration_20260706_221019_add_waitlist_signups from './20260706_221019_add_waitlist_signups';
import * as migration_20260706_222240_add_membership_tracks from './20260706_222240_add_membership_tracks';

export const migrations = [
  {
    up: migration_20260604_112404_initial.up,
    down: migration_20260604_112404_initial.down,
    name: '20260604_112404_initial',
  },
  {
    up: migration_20260604_120028_add_blog_posts.up,
    down: migration_20260604_120028_add_blog_posts.down,
    name: '20260604_120028_add_blog_posts',
  },
  {
    up: migration_20260604_123322_add_forms_and_mcp.up,
    down: migration_20260604_123322_add_forms_and_mcp.down,
    name: '20260604_123322_add_forms_and_mcp',
  },
  {
    up: migration_20260604_154011_add_site_config_stats.up,
    down: migration_20260604_154011_add_site_config_stats.down,
    name: '20260604_154011_add_site_config_stats',
  },
  {
    up: migration_20260604_154226_add_companies.up,
    down: migration_20260604_154226_add_companies.down,
    name: '20260604_154226_add_companies',
  },
  {
    up: migration_20260608_205054_advisers_companies_booking.up,
    down: migration_20260608_205054_advisers_companies_booking.down,
    name: '20260608_205054_advisers_companies_booking',
  },
  {
    up: migration_20260610_193625_team_orderable.up,
    down: migration_20260610_193625_team_orderable.down,
    name: '20260610_193625_team_orderable',
  },
  {
    up: migration_20260706_221019_add_waitlist_signups.up,
    down: migration_20260706_221019_add_waitlist_signups.down,
    name: '20260706_221019_add_waitlist_signups',
  },
  {
    up: migration_20260706_222240_add_membership_tracks.up,
    down: migration_20260706_222240_add_membership_tracks.down,
    name: '20260706_222240_add_membership_tracks'
  },
];
