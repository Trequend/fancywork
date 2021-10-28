import Dexie from 'dexie';
import 'dexie-observable';
import { EventEmitter } from '@fancywork/core';
import { SchemaStorage, WorkStorage } from 'lib/storage';
import { config } from './config';
import { IDatabaseChange } from 'dexie-observable/api';

const DB_NAME = 'fancywork';

type EventMap = {
  changes: { changes: Array<IDatabaseChange>; partial: boolean };
};

export class Database extends EventEmitter<EventMap, Database> {
  public readonly schemas: SchemaStorage;
  public readonly works: WorkStorage;

  private constructor(dexie: Dexie) {
    super();
    this.attach(dexie);

    this.schemas = new SchemaStorage(dexie);
    this.works = new WorkStorage(dexie);
  }

  private attach(dexie: Dexie) {
    dexie.on('changes', (changes, partial) => {
      this.emit('changes', { changes, partial });
    });
  }

  public static async open() {
    const dexie = new Dexie(DB_NAME, { autoOpen: false });
    config(dexie);
    await dexie.open();
    const database = new Database(dexie);
    return {
      database,
      close: () => {
        dexie.close();
      },
    };
  }
}
