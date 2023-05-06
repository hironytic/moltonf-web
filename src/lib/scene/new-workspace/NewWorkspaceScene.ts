//
// NewWorkspaceScene.ts
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

import { type AppContext } from "../../../AppContext"
import { Scene } from "../../../Scene"
import { type Readable, writable } from "svelte/store"
import { WatchingScene } from "../watching/WatchingScene"
import type { Story } from "../../story/Story"
import { SelectWorkspaceScene } from "../select-workspace/SelectWorkspaceScene"

export class NewWorkspaceScene extends Scene {
  constructor(appContext: AppContext) {
    super(appContext)
  }
  
  private readonly _step$ = writable<NewWorkspaceStep>(NewWorkspaceSteps.SELECT_STORY)
  get step$(): Readable<NewWorkspaceStep> { return this._step$ }

  private _storyId: number | undefined = undefined
  private readonly _storyId$ = writable<number | undefined>(undefined)
  private _name: string | undefined = undefined
  private readonly _name$ = writable<string | undefined>(undefined)
  
  get storyId$(): Readable<number | undefined> { return this._storyId$ }

  selectStory(storyId: number) {
    this._storyId = storyId
    this._storyId$.set(storyId)

    this._step$.set(NewWorkspaceSteps.INPUT_NAME)
  }
  
  async registerNewStory(story: Story): Promise<void> {
    const storyStore = await this.appContext.getStoryStore()
    const storyId = await storyStore.add(story)
    this.selectStory(storyId)
  }
  
  backFromSelectStoryStep() {
    this.appContext.changeScene(new SelectWorkspaceScene(this.appContext))
  }
  
  get name$(): Readable<string | undefined> { return this._name$ }
  
  setName(name: string) {
    this._name = name
    this._name$.set(name)
  }
  
  backFromInputNameStep() {
    this._step$.set(NewWorkspaceSteps.SELECT_STORY)
  }
  
  async registerNewWorkspace(): Promise<void> {
    if (this._storyId === undefined || this._name === undefined) {
      console.error("Story ID or name is not set!")
    } else {
      const workspaceStore = await this.appContext.getWorkspaceStore()
      const workspaceData = {
        storyId: this._storyId,
        name: this._name,
      }
      const workspaceId = await workspaceStore.add(workspaceData)
      
      this.appContext.changeScene(new WatchingScene(this.appContext, {
        id: workspaceId,
        ...workspaceData
      }))
    }
  }
}

export const NewWorkspaceSteps = {
  SELECT_STORY: "selectStory",
  INPUT_NAME: "inputName",
} as const
export type NewWorkspaceStep = typeof NewWorkspaceSteps[keyof typeof NewWorkspaceSteps]
