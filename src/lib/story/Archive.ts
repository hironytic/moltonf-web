//
// Archive.ts
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

import type { Story } from "./Story"
import type { Avatar } from "./Avatar"
import type { Period } from "./Period"
import type { StoryElement } from "./StoryElement"
import { StoryElementTypes } from "./StoryElement"
import type { PeriodType } from "./PeriodType"
import type { Talk } from "./Talk"
import { millisecondsFromTimePart } from "./TimePart"
import type { TalkType } from "./TalkType"
import type {
  AskCommit,
  AskEntry, Assault,
  Checkout,
  Counting, Counting2, Execution, GameOver, Guard, Judge,
  Murdered, NoComment, NoMurder,
  OnStage,
  OpenRole, Panic, PlayerList, ShortMember,
  StartAssault,
  StartEntry,
  StartMirror, StayEpilogue, SuddenDeath,
  Survivor, Vanish, WinHamster, WinVillage, WinWolf
} from "./StoryEvent"
import { EventFamilies } from "./EventFamily"
import { EventNames } from "./StoryEventName"
import type { Player } from "./Player"
import { TalkTypes } from "./TalkType"

export async function loadStoryFromArchiveFile(file: File): Promise<Story> {
  const xml = await readFileAsText(file)
  const parser = new DOMParser()
  const document = parser.parseFromString(xml, "text/xml")
  return parseArciveDocument(document)
}

export class InvalidArchiveError extends Error {
  override readonly message: string
  constructor(message: string) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidArchiveError)
    }
    this.name = "InvalidArchiveError"

    this.message = message
  }
}

async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader()
      fileReader.readAsText(file)
      fileReader.onload = () => {
        resolve(fileReader.result as string)
      }
    } catch (e) {
      reject(e)
    }
  })
}

function parseArciveDocument(document: XMLDocument): Story {
  let currentDay = 0
  let currentElementIndex = 0
  let currentElementId = ""
  let publicTalkCount = 0

  function getAttribute(element: Element, name: string): string | undefined {
    return element.getAttribute(name) ?? undefined
  }

  function getAttributeOrError(element: Element, name: string): string {
    const result = element.getAttribute(name) ?? undefined
    if (result === undefined) {
      throw new InvalidArchiveError(`Missing attribute "${name}" in element "${element.tagName}".`)
    }
    return result
  }

  function getFirstChildElement(parent: Element, name: string): Element | undefined {
    const children = parent.children
    for (const child of children) {
      if (child.nodeName === name) {
        return child
      }
    }
    return undefined
  }

  function getFirstChildElementOrError(parent: Element, name: string): Element {
    const result = getFirstChildElement(parent, name)
    if (result === undefined) {
      throw new InvalidArchiveError(`Missing child element "${name}" in element "${parent.tagName}".`)
    }
    return result
  }

  function getAllChildElement(parent: Element, name: string): Element[] {
    const result: Element[] = []
    const children = parent.children
    for (const child of children) {
      if (child.nodeName === name) {
        result.push(child)
      }
    }
    return result
  }

  function parseTime(timeString: string): number {
    // hh ':' mm ':' ss ('.' s+)? (zzzzzz)?
    //        -- see http://www.w3.org/TR/xmlschema-2/#dateTime
    const regex = /^(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?/
    const match = regex.exec(timeString) as [string, string, string, string, string?] | null
    if (!match) {
      throw new InvalidArchiveError(`Invalid time string "${timeString}".`)
    }

    const hourPart = parseInt(match[1], 10)
    const minutePart = parseInt(match[2], 10)
    const secondPart = parseInt(match[3], 10)
    const millisecondPart = match[4] ? parseInt(match[4], 10) : 0

    return millisecondsFromTimePart({
      hourPart,
      minutePart,
      secondPart,
      millisecondPart,
    })
  }

  function parseBoolean(booleanString: string): boolean {
    switch (booleanString) {
      case "0":
      case "false":
        return false
      case "1":
      case "true":
        return true
      default:
        throw new InvalidArchiveError(`Invalid boolean value "${booleanString}".`)
    }
  }

  function parseVillage(villageElem: Element): Story {
    const villageFullName = getAttributeOrError(villageElem, "fullName")
    const baseURI = getAttributeOrError(villageElem, "xml:base")
    const graveIconURI = getAttributeOrError(villageElem, "graveIconURI")
  
    const avatarListElem = getFirstChildElementOrError(villageElem, "avatarList")
    const avatarList = parseAvatarList(avatarListElem)
    
    const periodElems = getAllChildElement(villageElem, "period")
    const periods = periodElems.map(it => parsePeriod(it))
    
    return {
      version: 1,
      villageFullName,
      baseURI,
      graveIconURI,
      periods,
      avatarList,
    }
  }
  
  function parseAvatarList(avatarListElem: Element): Avatar[] {
    return getAllChildElement(avatarListElem, "avatar").map(avatarElem => {
      const avatarId = getAttributeOrError(avatarElem, "avatarId")
      const fullName = getAttributeOrError(avatarElem, "fullName")
      const shortName = getAttributeOrError(avatarElem, "shortName")
      const faceIconURI = getAttribute(avatarElem, "faceIconURI")
      return {
        avatarId,
        fullName,
        shortName,
        faceIconURI,
      }
    })
  }
  
  function parsePeriod(periodElem: Element): Period {
    const type = getAttributeOrError(periodElem, "type")
    const day = parseInt(getAttributeOrError(periodElem, "day"), 10)
    
    currentDay = day
    currentElementIndex = 0
    
    const elements: StoryElement[] = []
    const children = periodElem.children
    for (const child of children) {
      const storyElement = parseStoryElement(child)
      if (storyElement !== undefined) {
        elements.push(storyElement)
        currentElementIndex++
      }
    }
    
    return {
      type: type as PeriodType,
      day,
      elements,
    }
  }
  
  function parseStoryElement(elementElem: Element): StoryElement | undefined {
    currentElementId = `${currentDay}/${currentElementIndex}`
    
    const name = elementElem.tagName
    switch (name) {
      // talk
      case "talk":
        return parseTalk(elementElem)
      
      // EventAnnounceGroup
      case "startEntry":
        return parseStartEntry(elementElem)
      case "onStage":
        return parseOnStage(elementElem)
      case "startMirror":
        return parseStartMirror(elementElem)
      case "openRole":
        return parseOpenRole(elementElem)
      case "murdered":
        return parseMurdered(elementElem)
      case "startAssault":
        return parseStartAssault(elementElem)
      case "survivor":
        return parseSurvivor(elementElem)
      case "counting":
        return parseCounting(elementElem)
      case "suddenDeath":
        return parseSuddenDeath(elementElem)
      case "noMurder":
        return parseNoMurder(elementElem)
      case "winVillage":
        return parseWinVillage(elementElem)
      case "winWolf":
        return parseWinWolf(elementElem)
      case "winHamster":
        return parseWinHamster(elementElem)
      case "playerList":
        return parsePlayerList(elementElem)
      case "panic":
        return parsePanic(elementElem)
      case "execution":
        return parseExecution(elementElem)
      case "vanish":
        return parseVanish(elementElem)
      case "checkout":
        return parseCheckout(elementElem)
      case "shortMember":
        return parseShortMember(elementElem)
      
      // EventOrderGroup
      case "askEntry":
        return parseAskEntry(elementElem)
      case "askCommit":
        return parseAskCommit(elementElem)
      case "noComment":
        return parseNoComment(elementElem)
      case "stayEpilogue":
        return parseStayEpilogue(elementElem)
      case "gameOver":
        return parseGameOver(elementElem)
      
      // EventExtraGroup
      case "judge":
        return parseJudge(elementElem)
      case "guard":
        return parseGuard(elementElem)
      case "counting2":
        return parseCounting2(elementElem)
      case "assault":
        return parseAssault(elementElem)
      
      default:
        return undefined
    }
  }
  
  function parseMessageLines(parentElem: Element): string[] {
    const lines: string[] = []
    const children = parentElem.children
    for (const child of children) {
      if (child.nodeName === "li") {
        lines.push(parseLi(child))
      }
    }
    return lines
  }
  
  function parseAvatarRefs(parentElem: Element): string[] {
    const avatarIds: string[] = []
    const children = parentElem.children
    for (const child of children) {
      if (child.nodeName === "avatarRef") {
        const avatarId = getAttributeOrError(child, "avatarId")
        avatarIds.push(avatarId)
      }
    }
    return avatarIds
  }
  
  function parseLi(liElem: Element): string {
    let result = ""
    const childNodes = liElem.childNodes
    for (const node of childNodes) {
      switch (node.nodeType) {
        case 1: // ELEMENT_NODE
        if (node.nodeName === "rawdata") {
          result += node.nodeValue
        }
        break
        case 3: // TET_NODE
          result += node.nodeValue
          break
      }
    }
    return result
  }
  
  function parseTalk(talkElem: Element): Talk {
    const talkType = getAttributeOrError(talkElem, "type")
    const avatarId = getAttributeOrError(talkElem, "avatarId")
    const xname = getAttributeOrError(talkElem, "xname")
    const time = parseTime(getAttributeOrError(talkElem, "time"))
    const messageLines = parseMessageLines(talkElem)

    let talkNo: number | undefined = undefined
    if (talkType === TalkTypes.PUBLIC) {
      publicTalkCount++
      talkNo = publicTalkCount
    }
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.TALK,
      talkType: talkType as TalkType,
      avatarId,
      xname,
      time,
      talkNo,
      messageLines,
    }
  }
  
  function parseStartEntry(startEntryElem: Element): StartEntry {
    const messageLines = parseMessageLines(startEntryElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.START_ENTRY,
      messageLines,
    }
  }
  
  function parseOnStage(onStageElem: Element): OnStage {
    const entryNo = parseInt(getAttributeOrError(onStageElem, "entryNo"))
    const avatarId = getAttributeOrError(onStageElem, "avatarId")
    const messageLines = parseMessageLines(onStageElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.ON_STAGE,
      entryNo,
      avatarId,
      messageLines,
    }
  }
  
  function parseStartMirror(startMirrorElem: Element): StartMirror {
    const messageLines = parseMessageLines(startMirrorElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.START_MIRROR,
      messageLines,
    }
  }
  
  function parseOpenRole(openRoleElem: Element): OpenRole {
    const roleHeads: Record<string, number> = {}
    const children = openRoleElem.children
    for (const child of children) {
      if (child.nodeName === "roleHeads") {
        const role = getAttributeOrError(child, "role")
        roleHeads[role] = parseInt(getAttributeOrError(child, "heads"), 10)
      }
    }
    const messageLines = parseMessageLines(openRoleElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.OPEN_ROLE,
      roleHeads,
      messageLines,
    }
  }
  
  function parseMurdered(murderedElem: Element): Murdered {
    const avatarIds = parseAvatarRefs(murderedElem)
    const messageLines = parseMessageLines(murderedElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.MURDERED,
      avatarIds,
      messageLines,
    }
  }
  
  function parseStartAssault(startAssaultElem: Element): StartAssault {
    const messageLines = parseMessageLines(startAssaultElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.START_ASSAULT,
      messageLines,
    }
  }
  
  function parseSurvivor(survivorElem: Element): Survivor {
    const avatarIds = parseAvatarRefs(survivorElem)
    const messageLines = parseMessageLines(survivorElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.SURVIVOR,
      avatarIds,
      messageLines,
    }
  }
  
  function parseCounting(countingElem: Element): Counting {
    const victim = getAttribute(countingElem, "victim")
    const votes: Record<string, string> = {}
    const children = countingElem.children
    for (const child of children) {
      if (child.nodeName === "vote") {
        const byWhom = getAttributeOrError(child, "byWhom")
        votes[byWhom] = getAttributeOrError(child, "target")
      }
    }
    const messageLines = parseMessageLines(countingElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.COUNTING,
      victim,
      votes,
      messageLines,
    }
  }
  
  function parseSuddenDeath(suddenDeathElem: Element): SuddenDeath {
    const avatarId = getAttributeOrError(suddenDeathElem, "avatarId")
    const messageLines = parseMessageLines(suddenDeathElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.SUDDEN_DEATH,
      avatarId,
      messageLines,
    }
  }
  
  function parseNoMurder(noMurderElem: Element): NoMurder {
    const messageLines = parseMessageLines(noMurderElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.NO_MURDER,
      messageLines,
    }
  }
  
  function parseWinVillage(winVillageElem: Element): WinVillage {
    const messageLines = parseMessageLines(winVillageElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.WIN_VILLAGE,
      messageLines,
    }
  }
  
  function parseWinWolf(winWolfElem: Element): WinWolf {
    const messageLines = parseMessageLines(winWolfElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.WIN_WOLF,
      messageLines,
    }
  }
  
  function parseWinHamster(winHamsterElem: Element): WinHamster {
    const messageLines = parseMessageLines(winHamsterElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.WIN_HAMSTER,
      messageLines,
    }
  }
  
  function parsePlayerList(playerListElem: Element): PlayerList {
    const players: Player[] = []
    const children = playerListElem.children
    for (const child of children) {
      if (child.nodeName === "playerInfo") {
        const playerId = getAttributeOrError(child, "playerId")
        const avatarId = getAttributeOrError(child, "avatarId")
        const survive = parseBoolean(getAttributeOrError(child, "survive"))
        const role = getAttributeOrError(child, "role")
        const uri = getAttribute(child, "uri")
        players.push({
          playerId,
          avatarId,
          survive,
          role,
          uri,
        })
      }
    }
    const messageLines = parseMessageLines(playerListElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.PLAYER_LIST,
      players,
      messageLines,
    }
  }
  
  function parsePanic(panicElem: Element): Panic {
    const messageLines = parseMessageLines(panicElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.PANIC,
      messageLines,
    }
  }
  
  function parseExecution(executionElem: Element): Execution {
    const victim = getAttributeOrError(executionElem, "victim")
    const nominated: Record<string, number> = {}
    const children = executionElem.children
    for (const child of children) {
      if (child.nodeName === "nominated") {
        const avatarId = getAttributeOrError(child, "avatarId")
        nominated[avatarId] = parseInt(getAttributeOrError(child, "count"), 10)
      }
    }
    const messageLines = parseMessageLines(executionElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.EXECUTION,
      victim,
      nominated,
      messageLines,
    }
  }
  
  function parseVanish(vanishElem: Element): Vanish {
    const avatarId = getAttributeOrError(vanishElem, "avatarId")
    const messageLines = parseMessageLines(vanishElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.VANISH,
      avatarId,
      messageLines,
    }
  }
  
  function parseCheckout(checkoutElem: Element): Checkout {
    const avatarId = getAttributeOrError(checkoutElem, "avatarId")
    const messageLines = parseMessageLines(checkoutElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.CHECKOUT,
      avatarId,
      messageLines,
    }
  }
  
  function parseShortMember(shortMemberElem: Element): ShortMember {
    const messageLines = parseMessageLines(shortMemberElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ANNOUNCE,
      eventName: EventNames.SHORT_MEMBER,
      messageLines,
    }
  }
  
  function parseAskEntry(askEntryElem: Element): AskEntry {
    const messageLines = parseMessageLines(askEntryElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ORDER,
      eventName: EventNames.ASK_ENTRY,
      messageLines,
    }
  }
  
  function parseAskCommit(askCommitElem: Element): AskCommit {
    const messageLines = parseMessageLines(askCommitElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ORDER,
      eventName: EventNames.ASK_COMMIT,
      messageLines,
    }
  }
  
  function parseNoComment(noCommentElem: Element): NoComment {
    const messageLines = parseMessageLines(noCommentElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ORDER,
      eventName: EventNames.NO_COMMENT,
      messageLines,
    }
  }
  
  function parseStayEpilogue(stayEpilogueElem: Element): StayEpilogue {
    const messageLines = parseMessageLines(stayEpilogueElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ORDER,
      eventName: EventNames.STAY_EPILOGUE,
      messageLines,
    }
  }
  
  function parseGameOver(gameOverElem: Element): GameOver {
    const messageLines = parseMessageLines(gameOverElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.ORDER,
      eventName: EventNames.GAME_OVER,
      messageLines,
    }
  }
  
  function parseJudge(judgeElem: Element): Judge {
    const byWhom = getAttributeOrError(judgeElem, "byWhom")
    const target = getAttributeOrError(judgeElem, "target")
    const messageLines = parseMessageLines(judgeElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.EXTRA,
      eventName: EventNames.JUDGE,
      byWhom,
      target,
      messageLines,
    }
  }
  
  function parseGuard(guardElem: Element): Guard {
    const byWhom = getAttributeOrError(guardElem, "byWhom")
    const target = getAttributeOrError(guardElem, "target")
    const messageLines = parseMessageLines(guardElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.EXTRA,
      eventName: EventNames.GUARD,
      byWhom,
      target,
      messageLines,
    }
  }
  
  function parseCounting2(counting2Elem: Element): Counting2 {
    const votes: Record<string, string> = {}
    const children = counting2Elem.children
    for (const child of children) {
      if (child.nodeName === "vote") {
        const byWhom = getAttributeOrError(child, "byWhom")
        votes[byWhom] = getAttributeOrError(child, "target")
      }
    }
    const messageLines = parseMessageLines(counting2Elem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.EXTRA,
      eventName: EventNames.COUNTING2,
      votes,
      messageLines,
    }
  }
  
  function parseAssault(assaultElem: Element): Assault {
    const byWhom = getAttributeOrError(assaultElem, "byWhom")
    const target = getAttributeOrError(assaultElem, "target")
    const xname = getAttributeOrError(assaultElem, "xname")
    const time = parseTime(getAttributeOrError(assaultElem, "time"))
    const messageLines = parseMessageLines(assaultElem)
    return {
      elementId: currentElementId,
      elementType: StoryElementTypes.STORY_EVENT,
      eventFamily: EventFamilies.EXTRA,
      eventName: EventNames.ASSAULT,
      byWhom,
      target,
      xname,
      time,
      messageLines,
    }
  }

  return parseVillage(document.documentElement)
}


