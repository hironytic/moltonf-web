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
import { derived, type Readable, type Writable, writable } from "svelte/store"
import type { Story } from "../../story/Story"
import type { StoryElement } from "../../story/StoryElement"
import { PeriodTypes } from "../../story/PeriodType"
import { createFaceIconUrlMap } from "./FaceIconUtils"
import type { Period } from "../../story/Period"
import { delay, runDetached } from "../../Utils"
import { type CharacterMap, createCharacterMap } from "../../story/CharacterMap"
import { currentElements } from "./CurrentElements"
import { HistoryLocation } from "../../../History"

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
  private readonly _story$ = writable<Story | undefined>(undefined)
  private readonly _locationPath$: Writable<string>
  private readonly _currentDay$: Readable<number>
  private readonly _dayProgress$: Writable<number | undefined>
  private _isWorkspaceModified = false
  readonly workspace: Workspace
  readonly characterMap$: Readable<CharacterMap>
  readonly faceIconUrlMap$: Readable<Map<string | symbol, string>>
  
  constructor(appContext: AppContext, workspace: Workspace, location: HistoryLocation) {
    super(appContext)
    this.workspace = workspace
    this._locationPath$ = writable(location.path)

    this._dayProgress$ = writable(workspace.dayProgress)

    this._currentDay$ = derived([this._locationPath$, this._dayProgress$, this._story$], ([locationPath, dayProgress, story]) => {
      const location = HistoryLocation.fromPath(locationPath)
      const dayString = location.components[2]
      const day = (dayString !== undefined) ? parseInt(dayString) : NaN
      if (isNaN(day)) {
        return this.workspace.currentDay
      } else {
        let currentDay: number
        if (dayProgress !== undefined) {
          currentDay = Math.min(day, dayProgress)
        } else {
          currentDay = Math.min(day, (story?.periods.length ?? 1) - 1)
        }
        
        // Side effect: save current day to workspace
        this.updateWorkspace(it => {
          it.currentDay = currentDay
        })
        return currentDay
      }
    })
    
    this.focusedElementId$ = derived(this._locationPath$, locationPath => {
      const location = HistoryLocation.fromPath(locationPath)
      const elementId = location.components[3]
      if (elementId === undefined) {
        return undefined
      } else {
        return elementId
      }
    })
    
    this.watchableDays$ = derived([this._story$, this._dayProgress$], ([story, dayProgress]) => {
      if (story === undefined) {
        return [{ day: 0, text: PROLOGUE_NAME }]
      }

      const periods = (dayProgress === undefined) ? story.periods : story.periods.slice(0, dayProgress + 1)
      return periods.map((period, day) => ({
        day: day,
        text: getNameOfDay(period, day)
      }))
    })
    
    this.characterMap$ = derived(this._story$, story => {
      if (story === undefined) {
        return new Map()
      }
      return createCharacterMap(story)
    })
    
    this.faceIconUrlMap$ = derived(this._story$, story => {
      if (story === undefined) {
        return new Map()
      }
      return createFaceIconUrlMap(story)
    })
    
    this.canMoveToNextDay$ = derived([this._story$, this._currentDay$], ([story, currentDay]) => {
      if (story === undefined) {
        return false
      }
      return (currentDay < story.periods.length - 1)
    })

    this.moveToNextDay$ = derived([this._story$, this._currentDay$], ([story, currentDay]) => {
      return () => this.moveToNextDay(story, currentDay)
    })

    this.currentElements$ = derived([this._story$, this.characterMap$, this._dayProgress$, this._currentDay$],
      ([story, characterMap, dayProgress, currentDay,]) => {
      return currentElements(story, characterMap, workspace.playerCharacter, dayProgress, currentDay)
    })

    void this.loadStory()
  }

  updateLocation(location: HistoryLocation) {
    this._locationPath$.set(location.path)
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
  
  get story$(): Readable<Story | undefined> { return this._story$ }
  
  private async loadStory() {
    const workspaceStore = await this.appContext.getWorkspaceStore()
    const story = await workspaceStore.getStory(this.workspace.storyId)
    //TODO: check errors
    this._story$.set(story)
  }
  
  get currentDay$(): Readable<number> { return this._currentDay$ }
  readonly watchableDays$: Readable<WatchableDay[]>
  
  private moveToNextDay(story: Story | undefined, day: number) {
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
        this._dayProgress$.set(nextDayProgress)
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
  
  readonly canMoveToNextDay$: Readable<boolean>
  readonly moveToNextDay$: Readable<() => void> 

  readonly currentElements$: Readable<WatchingElement[]>
  readonly focusedElementId$: Readable<string | undefined>
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
