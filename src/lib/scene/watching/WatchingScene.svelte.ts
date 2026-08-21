//
// WatchingScene.svelte.ts
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
import type { Story } from "../../story/Story"
import type { StoryElement } from "../../story/StoryElement"
import { PeriodTypes } from "../../story/PeriodType"
import { createFaceIconUrlMap } from "./FaceIconUtils"
import type { Period } from "../../story/Period"
import { delay, runDetached } from "../../Utils"
import { type CharacterMap, createCharacterMap } from "../../story/CharacterMap"
import { currentElements, isTalkVisible } from "./CurrentElements"
import { HistoryLocation } from "../../../History"
import type { TalkMap } from "../../story/TalkMap"
import { createTalkMap, nullTalkMap } from "../../story/TalkMap"
import type { Talk } from "../../story/Talk"

const PROLOGUE_NAME = "プロローグ"
const EPILOGUE_NAME = "エピローグ"

function getNameOfDay(period: Period, day: number) {
  if (period.type === PeriodTypes.PROLOGUE) {
    return PROLOGUE_NAME
  } else if (period.type === PeriodTypes.EPILOGUE) {
    return EPILOGUE_NAME
  } else {
    return `${day}日目`
  }
}

export class WatchingScene extends Scene {
  private _story = $state<Story | undefined>(undefined)
  private _locationPath: string
  private _currentDay: number
  private _dayProgress: number | undefined
  private _isWorkspaceModified = false
  readonly workspace: Workspace
  readonly characterMap: CharacterMap
  readonly faceIconUrlMap: Map<string | symbol, string>
  readonly talkMap: TalkMap
  
  constructor(appContext: AppContext, workspace: Workspace, location: HistoryLocation) {
    super(appContext)
    this.workspace = workspace
    this._locationPath = $state(location.path)

    this._dayProgress = $state(workspace.dayProgress)

    this._currentDay = $derived.by(() => {
      const location = HistoryLocation.fromPath(this._locationPath)
      const dayString = location.components[2]
      const day = (dayString !== undefined) ? parseInt(dayString) : NaN
      if (isNaN(day)) {
        return this.workspace.currentDay
      } else {
        let currentDay: number
        if (this._dayProgress !== undefined) {
          currentDay = Math.min(day, this._dayProgress)
        } else {
          currentDay = Math.min(day, (this._story?.periods.length ?? 1) - 1)
        }
        
        // Side effect: save current day to workspace
        this.updateWorkspace(it => {
          it.currentDay = currentDay
        })
        return currentDay
      }
    })
    
    this.focusedElementId = $derived.by(() => {
      const location = HistoryLocation.fromPath(this._locationPath)
      const elementId = location.components[3]
      if (elementId === undefined) {
        return undefined
      } else {
        return elementId
      }
    })
    
    this.watchableDays = $derived.by(() => {
      if (this._story === undefined) {
        return [{ day: 0, text: PROLOGUE_NAME }]
      }

      const periods = (this._dayProgress === undefined) ? this._story.periods : this._story.periods.slice(0, this._dayProgress + 1)
      return periods.map((period, day) => ({
        day: day,
        text: getNameOfDay(period, day)
      }))
    })
    
    this.characterMap = $derived.by(() => {
      if (this._story === undefined) {
        return new Map()
      }
      return createCharacterMap(this._story)
    })
    
    this.faceIconUrlMap = $derived.by(() => {
      if (this._story === undefined) {
        return new Map()
      }
      return createFaceIconUrlMap(this._story)
    })
    
    this.talkMap = $derived.by(() => {
      if (this._story === undefined) {
        return nullTalkMap()
      }
      return createTalkMap(this._story)
      
    })
    
    this.canMoveToNextDay = $derived.by(() => {
      if (this._story === undefined) {
        return false
      }
      return (this._currentDay < this._story.periods.length - 1)
    })

    this.currentElements = $derived(
      currentElements(this._story, this.characterMap, workspace.playerCharacter, this._dayProgress, this._currentDay)
    )
    
    void this.loadStory()
  }

  updateLocation(location: HistoryLocation) {
    this._locationPath = location.path
  }
  
  private updateWorkspace(update: (workspace: Workspace) => void) {
    update(this.workspace)
    this.saveWorkspace()
  }
  
  private saveWorkspace() {
    runDetached(async () => {
      this._isWorkspaceModified = true
      this.workspace.lastModified = new Date()
      await delay(500)
      if (this._isWorkspaceModified) {
        const workspaceStore = await this.appContext.getWorkspaceStore()
        await workspaceStore.update(this.workspace)
        this._isWorkspaceModified = false
      }
    })
  }
  
  get story(): Story | undefined {
    return this._story
  }
  
  private async loadStory() {
    const workspaceStore = await this.appContext.getWorkspaceStore()
    const story = await workspaceStore.getStory(this.workspace.storyId)
    //TODO: check errors
    this._story = story
  }
  
  get currentDay(): number {
    return this._currentDay
  }
  readonly watchableDays: WatchableDay[]
  
  moveToNextDay() {
    const story = this._story
    const day = this._currentDay
    if (story === undefined) {
      return
    }

    if (day + 1 < story.periods.length) {
      const dayProgress = this.workspace.dayProgress
      if (dayProgress !== undefined && dayProgress < day + 1) {
        const nextDayProgress = ((day + 1) >= story.periods.length - 1) ? undefined : day + 1
        this.updateWorkspace(it => {
          it.dayProgress = nextDayProgress
        })
        this._dayProgress = nextDayProgress
      }
      this.appContext.history.navigate(this.getLocation(day + 1), false)
    }
  }
  
  getLocation(day: number, elementId?: string): HistoryLocation {
    if (elementId === undefined) {
      return HistoryLocation.fromComponents(["/", this.workspace.id, day.toString()])
    } else {
      return HistoryLocation.fromComponents(["/", this.workspace.id, day.toString(), elementId])
    }
  }
  
  readonly canMoveToNextDay: boolean
  
  readonly currentElements: WatchingElement[]
  readonly focusedElementId: string | undefined

  isTalkVisible(day: number, talk: Talk): boolean {
    if (this._story === undefined) {
      return false
    }
    const character = this.characterMap.get(this.workspace.playerCharacter)
    if (character === undefined) {
      return false
    }
    return isTalkVisible(this._story, day, talk, character, this._dayProgress)
  }
}

export interface WatchableDay {
  day: number
  text: string
}

export const MoltonfMessageType = "moltonf"
export interface MoltonfMessage {
  readonly elementType: typeof MoltonfMessageType
  readonly elementId: string
  readonly messageLines: string[]
}

export type WatchingElement = StoryElement | MoltonfMessage
