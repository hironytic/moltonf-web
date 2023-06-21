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
import { openMoltonfDB } from "./lib/storage/MoltonfDB"
import type { IDBPDatabase } from "idb"
import { WorkspaceStore } from "./lib/storage/WorkspaceStore"
import type { Readable } from "svelte/store"
import { derived, writable } from "svelte/store"
import type { Scene } from "./Scene"
import { SelectWorkspaceScene } from "./lib/scene/select-workspace/SelectWorkspaceScene"
import type { ExtendedMessageBoxItem, MessageBoxItem } from "./lib/MessageBoxItem"
import type { History } from "./History"
import { HistoryLocation } from "./History"
import { currentValueWritable } from "./lib/CurrentValueStore"
import { NewWorkspaceScene } from "./lib/scene/new-workspace/NewWorkspaceScene"
import { WatchingScene } from "./lib/scene/watching/WatchingScene"
import { InvalidScene } from "./lib/scene/invalid/InvalidScene"
import { runDetached } from "./lib/Utils"

export class AppContext {
  static readonly Key = Symbol()
  
  readonly history: History
  private _unsubscribeHistoryLocation: () => void
  private _dbPromise: Promise<IDBPDatabase<MoltonfDB> | undefined>
  private readonly _scene$ = currentValueWritable<Scene>(new SelectWorkspaceScene(this))
  private readonly _messageBoxItems$ = writable<ExtendedMessageBoxItem[]>([])
  
  constructor(history: History) {
    this.history = history
    this._dbPromise = Promise.resolve(undefined)
    this._unsubscribeHistoryLocation = history.location$.subscribe(it => {
      this.changeSceneByLocation(it.location)
    })
  }

  destroy() {
    this._unsubscribeHistoryLocation()
  }
  
  //#region Scene
  
  get scene$(): Readable<Scene> { return this._scene$ }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sceneAs$<T>(sceneClass: new (...args: any[]) => T): Readable<T | undefined> {
    return derived(this._scene$, it => (it instanceof sceneClass) ? it : undefined)
  }
  
  private changeSceneByLocation(location: HistoryLocation) {
    const currentScene = this._scene$.currentValue
    const [first, second] = location.components
    if (first !== "/") {
      // Invalid
      this._scene$.set(new InvalidScene(this, "Not Found"))
    } else {
      if (second === undefined) {
        // Select Workspace
        if (!(currentScene instanceof SelectWorkspaceScene)) {
          this._scene$.set(new SelectWorkspaceScene(this))
        }
      } else if (second === "new") {
        // New Workspace
        if (!(currentScene instanceof NewWorkspaceScene)) {
          this._scene$.set(new NewWorkspaceScene(this))
        }
      } else {
        // Watching
        const workspaceId = second
        if (currentScene instanceof WatchingScene && currentScene.workspace.id === workspaceId) {
          currentScene.updateLocation(location)
        } else {
          runDetached(async () => {
            const workspaceStore = await this.getWorkspaceStore()
            const workspace = await workspaceStore.getWorkspace(workspaceId)
            if (workspace === undefined) {
              this._scene$.set(new InvalidScene(this, "観戦データが見つかりません。"))
            } else {
              this._scene$.set(new WatchingScene(this, workspace, location))
            }
          })
        }
      }
    }
  }

  //#endregion

  //#region Message box
  
  get messageBoxItems$(): Readable<ExtendedMessageBoxItem[]> { return this._messageBoxItems$ }
  
  showMessageBox(item: MessageBoxItem): Promise<string | undefined> {
    return new Promise(resolve => {
      this._messageBoxItems$.update(it => {
        it.push({
          ...item,
          selected: undefined,
          resolve,
        })
        return it
      })
    })
  }
  
  onMessageBoxClosed() {
    this._messageBoxItems$.update(it => {
      const lastItem = it.pop()
      if (lastItem !== undefined) {
        lastItem.resolve(lastItem.selected)
      }
      return it
    })
  }
  
  //#endregion

  //#region Stores
  
  private async readyDB(): Promise<IDBPDatabase<MoltonfDB>> {
    const db = await this._dbPromise
    if (db !== undefined) {
      return db
    }
    
    const dbPromise = openMoltonfDB()
    this._dbPromise = dbPromise
    return await dbPromise
  }
  
  async getWorkspaceStore(): Promise<WorkspaceStore> {
    return new WorkspaceStore(await this.readyDB())
  }
  
  //#endregion
}
