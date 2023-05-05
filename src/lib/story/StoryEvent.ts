//
// StoryEvent.ts
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

import { StoryElementTypes } from "./StoryElement"
import { EventFamilies } from "./EventFamily"
import type { Player } from "./Player"
import { EventNames } from "./StoryEventName"

/**
 * Represents an event which appears in story.
 */
export type StoryEvent = StoryEventAnnounce | StoryEventOrder | StoryEventExtra

interface StoryEventBase {
  /** Type of this element */
  readonly elementType: typeof StoryElementTypes.STORY_EVENT

  /** Lines of messages */
  readonly messageLines: string[]
}

export type StoryEventAnnounce
  = StartEntry
  | OnStage
  | StartMirror
  | OpenRole
  | Murdered
  | StartAssault
  | Survivor
  | Counting
  | SuddenDeath
  | NoMurder
  | WinVillage
  | WinWolf
  | WinHamster
  | PlayerList
  | Panic
  | Execution
  | Vanish
  | Checkout
  | ShortMember

interface StoryEventAnnounceBase extends StoryEventBase {
  /** Event family */
  readonly eventFamily: typeof EventFamilies.ANNOUNCE
}

export interface StartEntry extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.START_ENTRY
}

export interface OnStage extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.ON_STAGE
  readonly entryNo: number
  readonly avatarId: string
}

export interface StartMirror extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.START_MIRROR
}

export interface OpenRole extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.OPEN_ROLE
  readonly roleHeads: Record<string, number>
}

export interface Murdered extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.MURDERED
  readonly avatarIds: string[]
}

export interface StartAssault extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.START_ASSAULT
}

export interface Survivor extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.SURVIVOR
  readonly avatarIds: string[]
}

export interface Counting extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.COUNTING
  readonly victim?: string
  readonly votes: Record<string, string>
}

export interface SuddenDeath extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.SUDDEN_DEATH
  readonly avatarId: string
}

export interface NoMurder extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.NO_MURDER
}

export interface WinVillage extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.WIN_VILLAGE
}

export interface WinWolf extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.WIN_WOLF
}

export interface WinHamster extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.WIN_HAMSTER
}

export interface PlayerList extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.PLAYER_LIST
  players: Player[]
}

export interface Panic extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.PANIC
}

export interface Execution extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.EXECUTION
  readonly victim?: string
  readonly nominated: Record<string, number>
}

export interface Vanish extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.VANISH
  readonly avatarId: string
}

export interface Checkout extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.CHECKOUT
  readonly avatarId: string
}

export interface ShortMember extends StoryEventAnnounceBase {
  readonly eventName: typeof EventNames.SHORT_MEMBER
}

interface StoryEventOrderBase extends StoryEventBase {
  /** Event family */
  readonly eventFamily: typeof EventFamilies.ORDER
}

export type StoryEventOrder
  = AskEntry
  | AskCommit
  | NoComment
  | StayEpilogue
  | GameOver

export interface AskEntry extends StoryEventOrderBase {
  readonly eventName: typeof EventNames.ASK_ENTRY
}

export interface AskCommit extends StoryEventOrderBase {
  readonly eventName: typeof EventNames.ASK_COMMIT
}

export interface NoComment extends StoryEventOrderBase {
  readonly eventName: typeof EventNames.NO_COMMENT
}

export interface StayEpilogue extends StoryEventOrderBase {
  readonly eventName: typeof EventNames.STAY_EPILOGUE
}

export interface GameOver extends StoryEventOrderBase {
  readonly eventName: typeof EventNames.GAME_OVER
}

interface StoryEventExtraBase extends StoryEventBase {
  /** Event family */
  readonly eventFamily: typeof EventFamilies.EXTRA
}

export type StoryEventExtra
  = Judge
  | Guard
  | Counting2
  | Assault  

export interface Judge extends StoryEventExtraBase {
  readonly eventName: typeof EventNames.JUDGE
  readonly byWhom: string
  readonly target: string
}

export interface Guard extends StoryEventExtraBase {
  readonly eventName: typeof EventNames.GUARD
  readonly byWhom: string
  readonly target: string
}

export interface Counting2 extends StoryEventExtraBase {
  readonly eventName: typeof EventNames.COUNTING2
  readonly votes: Record<string, string>
}

export interface Assault extends StoryEventExtraBase {
  readonly eventName: typeof EventNames.ASSAULT
  readonly byWhom: string
  readonly target: string
  readonly xname: string
  readonly time: number
}
