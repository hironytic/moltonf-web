//
// AppContext.svelte.ts
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
import type { Scene } from "./Scene"
import { SelectWorkspaceScene } from "./lib/scene/select-workspace/SelectWorkspaceScene.svelte"
import type { ExtendedMessageBoxItem, MessageBoxItem } from "./lib/MessageBoxItem"
import type { History } from "./History.svelte"
import { HistoryLocation } from "./History.svelte"
import { NewWorkspaceScene } from "./lib/scene/new-workspace/NewWorkspaceScene.svelte"
import { WatchingScene } from "./lib/scene/watching/WatchingScene.svelte"
import { InvalidScene } from "./lib/scene/invalid/InvalidScene"
import { runDetached } from "./lib/Utils"
import { untrack } from "svelte"

export class AppContext {
  static readonly Key = Symbol()
  
  readonly history: History
  private _cleanupEffectRoot: () => void
  private _dbPromise: Promise<IDBPDatabase<MoltonfDB> | undefined>
  private _scene = $state<Scene>(new SelectWorkspaceScene(this))
  private _messageBoxItems = $state<ExtendedMessageBoxItem[]>([])
  
  constructor(history: History) {
    this.history = history
    this._dbPromise = Promise.resolve(undefined)
    this._cleanupEffectRoot = $effect.root(() => {
      $effect(() => {
        this.changeSceneByLocation(history.locationWithId.location)
      })
    }) 
  }

  destroy() {
    this._cleanupEffectRoot()
    this.history.destroy()
  }
  
  //#region Scene
  
  get scene(): Scene { return this._scene }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sceneAs<T>(sceneClass: new (...args: any[]) => T): T | undefined {
    return (this._scene instanceof sceneClass) ? this._scene : undefined
  }
  
  private changeSceneByLocation(location: HistoryLocation) {
    const currentScene = untrack(() => this._scene)
    const [first, second] = location.components
    if (first !== "/") {
      // Invalid
      this._scene = new InvalidScene(this, "Not Found")
    } else {
      if (second === undefined) {
        // Select Workspace
        if (!(currentScene instanceof SelectWorkspaceScene)) {
          this._scene = new SelectWorkspaceScene(this)
        }
      } else if (second === "new") {
        // New Workspace
        if (!(currentScene instanceof NewWorkspaceScene)) {
          this._scene = new NewWorkspaceScene(this)
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
              this._scene = new InvalidScene(this, "観戦データが見つかりません。")
            } else {
              this._scene = new WatchingScene(this, workspace, location)
            }
          })
        }
      }
    }
  }

  //#endregion

  //#region Message box
  
  get messageBoxItems(): ExtendedMessageBoxItem[] { return this._messageBoxItems }
  
  showMessageBox(item: MessageBoxItem): Promise<string | undefined> {
    return new Promise(resolve => {
      this._messageBoxItems.push({
        ...item,
        selected: undefined,
        resolve,
      })
    })
  }
  
  onMessageBoxClosed() {
    const lastItem = this._messageBoxItems.pop()
    if (lastItem !== undefined) {
      lastItem.resolve(lastItem.selected)
    }
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
