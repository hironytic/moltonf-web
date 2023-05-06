//
// SelectWorkspaceScene.ts
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

import type { AppContext } from "../../../AppContext"
import { Scene } from "../../../Scene"
import { type Readable, writable } from "svelte/store"
import type { Workspace } from "../../workspace/Workspace"
import { NewWorkspaceScene } from "../new-workspace/NewWorkspaceScene"
import { WatchingScene } from "../watching/WatchingScene"

export class SelectWorkspaceScene extends Scene {
  constructor(appContext: AppContext) {
    super(appContext)
    void this.reloadWorkspaces()
  }
  
  private _workspaces$ = writable<Workspace[] | undefined>(undefined)
  get workspaces$(): Readable<Workspace[] | undefined> { return this._workspaces$ }
  
  async reloadWorkspaces(): Promise<void> {
    const workspaceStore = await this.appContext.getWorkspaceStore()
    this._workspaces$.set(await workspaceStore.getWorkspaces())
  }
  
  selectWorkspace(workspace: Workspace) {
    this.appContext.changeScene(new WatchingScene(this.appContext, workspace))
  }
  
  createNewWorkspace() {
    this.appContext.changeScene(new NewWorkspaceScene(this.appContext))
  }
}
