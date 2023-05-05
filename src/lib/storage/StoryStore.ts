//
// StoryStore.ts
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
import type { Story } from "../story/Story"
import { StoreNames } from "./MoltonfDB"

/**
 * Storage for stories.
 * 
 * Stories are saved in IndexedDB.
 */
export class StoryStore {
  private _db: IDBPDatabase<MoltonfDB>

  constructor(db: IDBPDatabase<MoltonfDB>) {
    this._db = db
  }
  
  async add(story: Story) {
    const tx = this._db.transaction([StoreNames.STORIES, StoreNames.STORY_ENTRIES], "readwrite")
    const storiesStore = tx.objectStore(StoreNames.STORIES)
    const storyNamesStore = tx.objectStore(StoreNames.STORY_ENTRIES)
    const key = await storiesStore.add(story)
    await storyNamesStore.put({
      id: key,
      name: story.villageFullName,
    })
    await tx.done
  }
  
  async remove(id: number) {
    const tx = this._db.transaction([StoreNames.STORIES, StoreNames.STORY_ENTRIES], "readwrite")
    const storiesStore = tx.objectStore(StoreNames.STORIES)
    const storyNamesStore = tx.objectStore(StoreNames.STORY_ENTRIES)
    await storiesStore.delete(id)
    await storyNamesStore.delete(id)
    await tx.done
  }
  
  async getEntries(): Promise<StoryEntry[]> {
    const result: StoryEntry[] = []
    const tx = this._db.transaction(StoreNames.STORY_ENTRIES)
    let cursor = await tx.store.openCursor()
    while (cursor !== null) {
      result.push(cursor.value)
      cursor = await cursor.continue()
    }
    return result
  }
  
  async getStory(id: number): Promise<Story | undefined> {
    const tx = this._db.transaction(StoreNames.STORIES)
    return await tx.store.get(id)
  }
}

export interface StoryEntry {
  id: number
  name: string
}
