//
// WatchingScene.ts
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
import type { Workspace } from "../../workspace/Workspace"
import { derived, type Readable } from "svelte/store"
import type { Story } from "../../story/Story"
import { currentValueWritable } from "../../CurrentValueStore"
import type { StoryElement } from "../../story/StoryElement"
import type { Avatar } from "../../story/Avatar"
import { PeriodTypes } from "../../story/PeriodType"
import { createFaceIconUrlMap } from "./FaceIconUtils"

export class WatchingScene extends Scene {
  constructor(appContext: AppContext, workspace: Workspace) {
    super(appContext)
    this.workspace = workspace
    
    this.watchableDays$ = derived(this._story$, story => {
      if (story === undefined) {
        return [{day: 0, text: "プロローグ"}]
      }
      
      const result: WatchableDay[] = []
      for (let ix = 0; ix < story.periods.length; ix++) {
        let text = ""
        if (story.periods[ix]?.type === PeriodTypes.PROLOGUE) {
          text = "プロローグ"
        } else if (story.periods[ix]?.type === PeriodTypes.EPILOGUE) {
          text = "エピローグ"
        } else {
          text = `${ix}日目`
        }
        result.push({
          day: ix,
          text,
        })
      }
      return result
    })
    
    this.currentStoryElements$ = derived([this._story$, this._currentDay$], ([story, currentDay]) => {
      if (story === undefined) {
        return []
      }
      
      const period = story.periods[currentDay]
      if (period === undefined) {
        return []
      }
      
      // TODO: filter it
      return period.elements
    })
    
    this.avatarMap$ = derived(this._story$, story => {
      if (story === undefined) {
        return new Map()
      }
      
      return new Map(story.avatarList.map(it => [it.avatarId, it]))
    })
    
    this.faceIconUrlMap$ = derived(this._story$, story => {
      if (story === undefined) {
        return new Map()
      }
      return createFaceIconUrlMap(story)
    })
    
    void this.loadStory()
  }

  private readonly _story$ = currentValueWritable<Story | undefined>(undefined)
  private readonly _currentDay$ = currentValueWritable<number>(0)
  
  readonly workspace: Workspace

  async saveWorkspace() {
    const workspaceStore = await this.appContext.getWorkspaceStore()
    await workspaceStore.update(this.workspace)
  }
  
  get story$(): Readable<Story | undefined> { return this._story$ }
  
  private async loadStory() {
    const storyStore = await this.appContext.getStoryStore()
    const story = await storyStore.getStory(this.workspace.storyId)
    //TODO: check errors
    this._story$.set(story)
  }
  
  readonly avatarMap$: Readable<Map<string, Avatar>>
  readonly faceIconUrlMap$: Readable<Map<string | symbol, string>>
  
  get currentDay$(): Readable<number> { return this._currentDay$ }
  readonly watchableDays$: Readable<WatchableDay[]>
  
  changeCurrentDay(day: number) {
    const story = this._story$.currentValue
    if (story === undefined) {
      return
    }
    
    if (0 <= day && day < story.periods.length) {
      this._currentDay$.set(day)
    }
  }
  
  readonly currentStoryElements$: Readable<StoryElement[]>
}

export interface WatchableDay {
  day: number
  text: string
}
