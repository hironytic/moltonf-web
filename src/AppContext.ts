//
// AppContext.ts
//
// Copyright (c) 2023 Hironori Ichimiya <hiron@hironytic.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//

import type { MoltonfDB } from "./lib/storage/MoltonfDB"
import type { IDBPDatabase } from "idb"
import { StoryStore } from "./lib/storage/StoryStore"
import { openMoltonfDB } from "./lib/storage/MoltonfDB"
import { WorkspaceStore } from "./lib/storage/WorkspaceStore"

export class AppContext {
  static Key = Symbol()
  
  private _dbPromise: Promise<IDBPDatabase<MoltonfDB> | undefined>
  
  constructor() {
    this._dbPromise = Promise.resolve(undefined)
  }

  private async readyDB(): Promise<IDBPDatabase<MoltonfDB>> {
    const db = await this._dbPromise
    if (db !== undefined) {
      return db
    }
    
    const dbPromise = openMoltonfDB()
    this._dbPromise = dbPromise
    return await dbPromise
  }
  
  async getStoryStore(): Promise<StoryStore> {
    return new StoryStore(await this.readyDB())
  }
  
  async getWorkspaceStore(): Promise<WorkspaceStore> {
    return new WorkspaceStore(await this.readyDB())
  }
}
