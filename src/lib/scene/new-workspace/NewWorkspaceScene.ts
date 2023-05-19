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
import { type Readable, type Writable, writable } from "svelte/store"
import { WatchingScene } from "../watching/WatchingScene"
import type { Story } from "../../story/Story"
import { SelectWorkspaceScene } from "../select-workspace/SelectWorkspaceScene"
import { currentValueWritable } from "../../CurrentValueStore"

export class NewWorkspaceScene extends Scene {
  constructor(appContext: AppContext) {
    super(appContext)
  }
  
  private readonly _step$ = writable<NewWorkspaceStep>(NewWorkspaceSteps.SELECT_STORY)
  get step$(): Readable<NewWorkspaceStep> { return this._step$ }

  private readonly _story$ = currentValueWritable<Story | undefined>(undefined)
  private readonly _name$ = currentValueWritable<string>("")

  get story$(): Readable<Story | undefined> { return this._story$ }
  
  setStory(story: Story) {
    this._story$.set(story)
    this.forwardToInputNameStep()
  }
  
  backFromSelectStoryStep() {
    this.appContext.changeScene(new SelectWorkspaceScene(this.appContext))
  }
  
  get name$(): Writable<string> { return this._name$ }
  
  forwardToInputNameStep() {
    this._name$.set(this._story$.currentValue?.villageFullName ?? "")
    this._step$.set(NewWorkspaceSteps.INPUT_NAME)
  }
  
  backFromInputNameStep() {
    this._name$.set("")
    this._step$.set(NewWorkspaceSteps.SELECT_STORY)
  }
  
  async registerNewWorkspace(): Promise<void> {
    if (this._story$.currentValue === undefined || this._name$.currentValue === undefined) {
      console.error("Story or name is not set!")
    } else {
      const workspaceStore = await this.appContext.getWorkspaceStore()
      const story = this._story$.currentValue
      const workspaceData = {
        name: this._name$.currentValue,
        currentDay: 0,
        dayProgress: 0,
        // TODO: other stuff...
        
        lastModified: new Date(),
      }
      const workspace = await workspaceStore.add(story, workspaceData)
      
      this.appContext.changeScene(new WatchingScene(this.appContext, workspace))
    }
  }
}

export const NewWorkspaceSteps = {
  SELECT_STORY: "selectStory",
  INPUT_NAME: "inputName",
} as const
export type NewWorkspaceStep = typeof NewWorkspaceSteps[keyof typeof NewWorkspaceSteps]
