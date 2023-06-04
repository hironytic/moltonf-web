//
// CharacterMap.ts
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

import type { Role } from "./Role"
import type { Story } from "./Story"
import { Roles } from "./Role"
import { StoryElementTypes } from "./StoryElement"
import { EventNames } from "./StoryEventName"
import type { Avatar } from "./Avatar"

export interface Character {
  /** The avatar which describes this character */
  readonly avatar: Avatar

  /** Role */
  readonly role: Role

  /** The day this character survives until that day */
  readonly aliveUntil: number
}

export type CharacterMap = Map<string, Character>

export function createCharacterMap(story: Story): CharacterMap {
  interface MutableCharacter {
    avatar: Avatar
    role: Role
    aliveUntil: number
  }
  const map: Map<string, MutableCharacter> = new Map<string, MutableCharacter>(story.avatarList.map(it => [it.avatarId, {
    avatar: it,
    role: Roles.INNOCENT,
    aliveUntil: 1,
  }]))
  
  for (const period of story.periods) {
    for (const element of period.elements) {
      if (element.elementType === StoryElementTypes.STORY_EVENT) {
        if (element.eventName === EventNames.SURVIVOR) {
          for (const avatarId of element.avatarIds) {
            const character = map.get(avatarId)
            if (character !== undefined) {
              character.aliveUntil = period.day
            }
          }
        } else if (element.eventName === EventNames.PLAYER_LIST) {
          for (const player of element.players) {
            const character = map.get(player.avatarId)
            if (character !== undefined) {
              character.role = player.role
              if (player.survive) {
                character.aliveUntil = period.day
              }
            }
          }
        }
      }
    }
  }
  
  return map
}
