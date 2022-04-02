import { createRealmContext, Realm } from '@realm/react';
import { Task } from './Task';
import {Address} from "./Address";
import {NativeToken} from "./NativeToken";
import { Account } from './Account';

export class Project {
  createdAt: Date;
  _id: Realm.BSON.ObjectId;
  tasks: any[];
  constructor({id = new Realm.BSON.ObjectId()}) {
    this.createdAt = new Date();
    this._id = id;
    this.tasks = [];
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Project',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      createdAt: 'date'
    },
  };
}

export const { useRealm, useQuery, RealmProvider } = createRealmContext({
  schema: [Address, NativeToken, Account, Project],
  deleteRealmIfMigrationNeeded: true,
});
