import * as migration_20260604_112404_initial from './20260604_112404_initial';

export const migrations = [
  {
    up: migration_20260604_112404_initial.up,
    down: migration_20260604_112404_initial.down,
    name: '20260604_112404_initial'
  },
];
