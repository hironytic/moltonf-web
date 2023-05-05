//
// WorkspaceStore.ts
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

import type { IDBPDatabase } from "idb"
import type { MoltonfDB } from "./MoltonfDB"
import type { Workspace } from "../workspace/Workspace"
import { StoreNames } from "./MoltonfDB"

/**
 * Storage for workspaces.
 *
 * Workspaces are saved in IndexedDB.
 */
export class WorkspaceStore {
  private _db: IDBPDatabase<MoltonfDB>

  constructor(db: IDBPDatabase<MoltonfDB>) {
    this._db = db
  }

  async add(workspace: Omit<Workspace, "id">): Promise<number> {
    const tx = this._db.transaction(StoreNames.WORKSPACES, "readwrite")
    // It's OK to omit id because it is created by "autoIncrement"
    const key = await tx.store.add(workspace as Workspace)
    await tx.done
    return key
  }
  
  async update(workspace: Workspace) {
    const tx = this._db.transaction(StoreNames.WORKSPACES, "readwrite")
    await tx.store.put(workspace)
    await tx.done
  }
  
  async remove(id: number) {
    const tx = this._db.transaction(StoreNames.WORKSPACES, "readwrite")
    await tx.store.delete(id)
    await tx.done
  }

  async getWorkspaces(): Promise<Workspace[]> {
    const result: Workspace[] = []
    const tx = this._db.transaction(StoreNames.WORKSPACES)
    let cursor = await tx.store.openCursor()
    while (cursor !== null) {
      result.push(cursor.value)
      cursor = await cursor.continue()
    }
    return result
  }
  
  async getWorkspace(id: number): Promise<Workspace | undefined> {
    const tx = this._db.transaction(StoreNames.WORKSPACES)
    return await tx.store.get(id)
  }
}
