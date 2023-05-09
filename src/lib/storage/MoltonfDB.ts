//
// MoltonfDB.ts
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

import type { DBSchema, IDBPDatabase } from "idb"
import type { Story } from "../story/Story"
import { openDB } from "idb"
import type { Workspace } from "../workspace/Workspace"

export const StoreNames = {
  STORIES: "stories",
  WORKSPACES: "workspaces",
} as const

export const IndexNames = {
  STORIES: {
    NAME: "name",
  } as const,
  
  WORKSPACES: {
    LAST_MODIFIED: "lastModified",
  }
} as const

export interface MoltonfDB extends DBSchema {
  stories: {
    key: number
    value: Story
    indexes: { "name": string }
  }

  workspaces: {
    key: number
    value: Workspace
    indexes: { "lastModified": Date }
  }
}

export async function openMoltonfDB(): Promise<IDBPDatabase<MoltonfDB>> {
  return await openDB<MoltonfDB>("moltonf-db", 1, {
    upgrade(database: IDBPDatabase<MoltonfDB>) {
      const storiesStore = database.createObjectStore(StoreNames.STORIES, { autoIncrement: true })
      storiesStore.createIndex(IndexNames.STORIES.NAME, "villageFullName", { unique: false })
      
      const workspacesStore = database.createObjectStore(StoreNames.WORKSPACES, { keyPath: "id", autoIncrement: true })
      workspacesStore.createIndex(IndexNames.WORKSPACES.LAST_MODIFIED, "lastModified", { unique: false })
    }
  })
}
