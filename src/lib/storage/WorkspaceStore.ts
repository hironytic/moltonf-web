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
import { IndexNames, StoreNames } from "./MoltonfDB"
import type { Story } from "../story/Story"

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

  async add(story: Story, workspace: Omit<Workspace, "id" | "storyId">): Promise<Workspace> {
    const tx = this._db.transaction([StoreNames.STORIES, StoreNames.WORKSPACES], "readwrite")
    const storyId = await tx.objectStore(StoreNames.STORIES).add(story)
    const newWorkspace: Workspace = {
      ...workspace,
      storyId,
    } as Workspace  // It's OK to omit id because it is created by "autoIncrement"
    const key = await tx.objectStore(StoreNames.WORKSPACES).add(newWorkspace)
    await tx.done
    newWorkspace.id = key
    return  newWorkspace
  }
  
  async update(workspace: Workspace) {
    const tx = this._db.transaction(StoreNames.WORKSPACES, "readwrite")
    await tx.store.put(workspace)
    await tx.done
  }
  
  async remove(workspace: Workspace) {
    const workspaceId = workspace.id
    const storyId = workspace.storyId
    const tx = this._db.transaction([StoreNames.STORIES, StoreNames.WORKSPACES], "readwrite")
    await tx.objectStore(StoreNames.WORKSPACES).delete(workspaceId)
    await tx.objectStore(StoreNames.STORIES).delete(storyId)
    await tx.done
  }

  async getWorkspaces(): Promise<Workspace[]> {
    const result: Workspace[] = []
    const tx = this._db.transaction(StoreNames.WORKSPACES)
    const index = tx.store.index(IndexNames.WORKSPACES.LAST_MODIFIED)
    let cursor = await index.openCursor(null, "prev")
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
