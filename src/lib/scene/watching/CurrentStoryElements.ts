//
// CurrentStoryElements.ts
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

import type { Story } from "../../story/Story"
import type { Character, CharacterMap } from "../../story/CharacterMap"
import type { StoryElement } from "../../story/StoryElement"
import { StoryElementTypes } from "../../story/StoryElement"
import { EventNames } from "../../story/StoryEventName"
import { TalkTypes } from "../../story/TalkType"
import { Roles } from "../../story/Role"
import type { Talk } from "../../story/Talk"
import type { MoltonfMessage, WatchingElement } from "./WatchingScene"
import { MoltonfMessageType } from "./WatchingScene"
import type { Guard } from "../../story/StoryEvent"

export function currentStoryElements(
  story: Story | undefined,
  characterMap: CharacterMap,
  playerCharacter: string,
  dayProgress: number | undefined,
  currentDay: number
): WatchingElement[] {
  // Handle irregular cases
  if (story === undefined) {
    return []
  }
  const period = story.periods[currentDay]
  if (period === undefined) {
    return []
  }
  const character = characterMap.get(playerCharacter)
  if (character === undefined) {
    return period.elements
  }
  if (dayProgress !== undefined && currentDay > dayProgress) {
    return []
  }

  // Other cases
  return period.elements.flatMap(element => filterStoryElement(story, characterMap, dayProgress, element, character, currentDay))
}

function filterStoryElement(story: Story, characterMap: CharacterMap, dayProgress: number | undefined, element: StoryElement, character: Character, currentDay: number): WatchingElement[] {
  function filter(predicate: boolean, ...elements: (WatchingElement | undefined)[]): WatchingElement[] {
    const additional = elements.filter((it): it is WatchingElement => it !== undefined)
    return (dayProgress === undefined || predicate) ? [element, ...additional] : [...additional]
  }
  
  switch (element.elementType) {
    case StoryElementTypes.TALK:
      switch (element.talkType) {
        case TalkTypes.PUBLIC:
          return filter(isPublicTalkVisible())
        case TalkTypes.PRIVATE:
          return filter(isPrivateTalkVisible(element, character))
        case TalkTypes.WOLF:
          return filter(isWolfTalkVisible(story, character))
        case TalkTypes.GRAVE:
          return filter(isGraveTalkVisible(character, currentDay))
        default:
          return [element]
      }

    case StoryElementTypes.STORY_EVENT:
      switch (element.eventName) {
        case EventNames.START_MIRROR:
          return filter(
            true,
            createPlayerCharacterMessage(element.elementId, character, characterMap)
          )
        case EventNames.SUDDEN_DEATH:
          return filter(
            true,
            createInformedMessage(element.elementId, currentDay, characterMap, character, element.avatarId)
          )
        case EventNames.COUNTING:
          return filter(
            true,
            createInformedMessage(element.elementId, currentDay, characterMap, character, element.victim)
          )
        case EventNames.EXECUTION:
          return filter(
            true,
            createInformedMessage(element.elementId, currentDay, characterMap, character, element.victim)
          )
        case EventNames.JUDGE:
          return filter(
            isJudgeVisible(character),
            createJudgeMessage(element.elementId, story, currentDay, characterMap, character, element.target)
          )
        case EventNames.GUARD:
          return filter(isGuardVisible(character))
        case EventNames.COUNTING2:
          return filter(isCounting2Visible())
        case EventNames.ASSAULT:
        {
          return filter(
            isAssaultVisible(character),
            createGuardedMessage(element.elementId, story, currentDay, characterMap, character, element.target)
          )
        }
        default:
          return [element]
      }
      break

    default:
      return [element]
  }
}

function isPublicTalkVisible(): boolean {
  return true
}

function isPrivateTalkVisible(talk: Talk, character: Character): boolean {
  return talk.avatarId === character.avatar.avatarId
}

function isWolfTalkVisible(story: Story, character: Character): boolean {
  return character.role === Roles.WOLF
    || (story.landId === "wolfc" && character.role === Roles.MADMAN)
}

function isGraveTalkVisible(character: Character, currentDay: number): boolean {
  return character.aliveUntil < currentDay
}

function isJudgeVisible(character: Character): boolean {
  return character.role === Roles.SEER
}

function isGuardVisible(character: Character): boolean {
  return character.role === Roles.HUNTER
}

function isCounting2Visible(): boolean {
  return false
}

function isAssaultVisible(character: Character): boolean {
  return character.role === Roles.WOLF
}

function createPlayerCharacterMessage(idBase: string, character: Character, characterMap: CharacterMap): MoltonfMessage {
  let messageLines: string[] = []
  switch (character.role) {
    case Roles.INNOCENT:
      messageLines = [
        `あなたは ${character.avatar.fullName}、ただの村人です。しかしあなたの推理力や発言が、村人側の勝利の鍵となるかもしれません。`
      ]
      break
    case Roles.WOLF:
      messageLines = [
        `あなたは ${character.avatar.fullName}、人狼です。村人を人狼と同数以下まで減らせば勝利です。村人に悟られないように、慎重に邪魔者を排除していきましょう。`
      ]
      break
    case Roles.SEER:
      messageLines = [
        `あなたは ${character.avatar.fullName}、占い師です。毎夜、誰かひとりを占うことができます。それにより、相手が人狼か人間かを知ることができます。`
      ]
      break
    case Roles.SHAMAN:
      messageLines = [
        `あなたは ${character.avatar.fullName}、霊能者です。処刑によって命を失ったものが、人間であったか人狼であったかを知ることができます。`
      ]
      break
    case Roles.HUNTER:
      messageLines = [
        `あなたは ${character.avatar.fullName}、狩人です。毎夜、ひとりだけを、人狼の襲撃から守ることができます。人狼の行動を読み、村人たちを人狼から守って下さい。`
      ]
      break
    case Roles.FRATER:
    {
      messageLines = [
        `あなたは ${character.avatar.fullName}、共有者です。もうひとりの共有者が誰であるかを知る事ができます。`
      ]
      let otherFrater: Character | undefined = undefined
      for (const ch of characterMap.values()) {
        if (ch.role === Roles.FRATER && ch.avatar.avatarId !== character.avatar.avatarId) {
          otherFrater = ch
          break
        }
      }
      if (otherFrater !== undefined) {
        messageLines.push("")
        messageLines.push(`もうひとりの共有者は、${otherFrater.avatar.fullName} です。`)
      }
      break
    }
    case Roles.MADMAN:
      messageLines = [
        `あなたは ${character.avatar.fullName}、人狼の繁栄を望む狂人です。人狼の勝利があなたの勝利となります。`,
        "",
        "人狼の勝利のため、存分に議論をかきまわして下さい。"
      ]
      break
    case Roles.HAMSTER:
      messageLines = [
        `あなたは ${character.avatar.fullName}、ハムスター人間です。人狼に襲撃されても死亡しませんが、占い師に占われると死亡します。`,
        "",
        "人狼の全滅時、もしくは村人の数が人狼の数より少なくなった時に生存していればあなたの勝利になります。"
      ]
      break
  }
  
  return {
    elementId: `${idBase}_player-character`,
    elementType: MoltonfMessageType,
    messageLines: messageLines,
  }
}

function createGuardedMessage(idBase: string, story: Story, currentDay: number, characterMap: CharacterMap, character: Character, targetId: string): MoltonfMessage | undefined {
  if (character.role !== Roles.HUNTER) {
    return undefined
  }
  
  // Handle special case of land G
  // In land G, the hunter cannot aware if he/she is guarded or not.
  if (story.landId === "wolfg") {
    return undefined
  }

  if (character.aliveUntil < currentDay) {
    return undefined
  }
  
  const period = story.periods[currentDay]
  if (period === undefined) {
    return undefined
  }
  
  const guard = period.elements.find((it): it is Guard => {
    return it.elementType === StoryElementTypes.STORY_EVENT
      && it.eventName === EventNames.GUARD
      && it.byWhom === character.avatar.avatarId
  })
  if (guard === undefined) {
    return undefined
  }
  
  if (guard.target === targetId) {
    const guarded = characterMap.get(guard.target)
    if (guarded !== undefined) {
      const messageLines = [
        `${guarded.avatar.fullName} を人狼の襲撃から守った。`,
      ]
      return {
        elementId: `${idBase}_guarded`,
        elementType: MoltonfMessageType,
        messageLines,
      }
    }
  }
  
  return undefined
}

function createJudgeMessage(idBase: string, story: Story, currentDay: number, characterMap: CharacterMap, character: Character, targetId: string): MoltonfMessage | undefined {
  if (character.role !== Roles.SEER) {
    return undefined
  }
  
  if (character.aliveUntil < currentDay) {
    return undefined
  }
  
  const target = characterMap.get(targetId)
  if (target === undefined) {
    return undefined
  }

  let messageLines: string[]
  if (story.landId === "wolfe") {
    if (target.role === Roles.WOLF) {
      messageLines = [
        `${target.avatar.fullName} は人狼のようだ。`,
      ]
    } else {
      messageLines = [
        `${target.avatar.fullName} は人狼ではないようだ。`,
      ]
    }
  } else { 
    if (target.role === Roles.WOLF) {
      messageLines = [
        `${target.avatar.fullName} は人狼のようだ。`,
      ]
    } else {
      messageLines = [
        `${target.avatar.fullName} は人間のようだ。`,
      ]
    }
  }
  
  return {
    elementId: `${idBase}_judgement`,
    elementType: MoltonfMessageType,
    messageLines,
  }
}

function createInformedMessage(idBase: string, currentDay: number, characterMap: CharacterMap, character: Character, targetId: string | undefined): MoltonfMessage | undefined {
  if (targetId === undefined) {
    return undefined
  }

  if (currentDay < 3) {
    return undefined
  }
  
  if (character.role !== Roles.SHAMAN) {
    return undefined
  }

  if (character.aliveUntil < currentDay) {
    return undefined
  }

  const target = characterMap.get(targetId)
  if (target === undefined) {
    return undefined
  }

  let messageLines: string[]
  if (target.role === Roles.WOLF) {
    messageLines = [
      `${target.avatar.fullName} は人狼だった。`,
    ]
  } else {
    messageLines = [
      `${target.avatar.fullName} は人狼ではなかった。`,
    ]
  }
  
  return {
    elementId: `${idBase}_informed`,
    elementType: MoltonfMessageType,
    messageLines,
  }
}
