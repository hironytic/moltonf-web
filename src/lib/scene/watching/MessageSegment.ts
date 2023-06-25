//
// MessageSegment.ts
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

import type { TalkMap, TalkWithDay } from "../../story/TalkMap"

export const MessageSegmentTypes = {
  general: "general",
  linkToTalk: "linkToTalk",
} as const

export type MessageSegmentType = typeof MessageSegmentTypes[keyof typeof MessageSegmentTypes]

export type MessageSegment = GeneralMessageSegment | LinkToTalkSegment

interface MessageSegmentBase {
  type: MessageSegmentType
  text: string
}

export interface GeneralMessageSegment extends MessageSegmentBase {
  type: typeof MessageSegmentTypes.general
}

export interface LinkToTalkSegment extends MessageSegmentBase {
  type: typeof MessageSegmentTypes.linkToTalk
  talks: TalkWithDay[]
}

export interface ParseOptions {
  currentDay?: number
  talkMap?: TalkMap
  isTalkVisible: (talk: TalkWithDay) => boolean
}

export function parseMessageSegments(text: string, { currentDay, talkMap, isTalkVisible }: ParseOptions): MessageSegment[] {
  const segments: MessageSegment[] = []
  let begin = 0
  let cur = 0
  
  function pushGeneral() {
    if (begin < cur) {
      segments.push({
        type: MessageSegmentTypes.general,
        text: text.slice(begin, cur),
      })
      begin = cur
    }
  }
  
  function isDigit(ch: string | undefined) {
    if (ch === undefined) return false
    
    // suppose ch is a single character
    return (ch >= "0" && ch <= "9")
  }
  
  function toNumber(str: string | undefined): number | undefined {
    if (str === undefined) {
      return undefined
    }
    
    const num = parseInt(str)
    if (isNaN(num)) {
      return undefined
    } 
    
    return num
  }
  
  while (cur < text.length) {
    let isMatched = false
    if (talkMap !== undefined && text[cur] === ">") {
      // possibly anchor
      // ex. ">>123"
      const match = text.slice(cur).match(/^>>([0-9]+)/)
      if (match !== null) {
        const talkNo = toNumber(match[1])
        if (talkNo !== undefined) {
          const talkWithDay = talkMap.getTalkByTalkNo(talkNo)
          if (talkWithDay !== undefined && isTalkVisible(talkWithDay)) {
            pushGeneral()
            const text = match[0]
            segments.push({
              type: MessageSegmentTypes.linkToTalk,
              text,
              talks: [talkWithDay],
            })
            cur += text.length
            begin = cur
            isMatched = true
          }
        }
      }
    } else if (talkMap !== undefined && isDigit(text[cur])) {
      // possibly mention by time
      // ex. "3d12:34", "3d1234", "12:34" or "1234"
      const match = text.slice(cur).match(/^(([0-9]+)d)?([0-9][0-9]):?([0-9][0-9])/i)
      if (match !== null) {
        const dayInMessage = toNumber(match[2])
        const hour = toNumber(match[3])
        const minute = toNumber(match[4])
        if (hour !== undefined && minute !== undefined) {
          // If day is not specified, use current day.
          const day = (dayInMessage !== undefined) ? dayInMessage : currentDay
          if (day !== undefined) {
            const talks = talkMap.getTalkByTime(day, hour, minute)
              .map(it => ({ day, talk: it }))
              .filter(isTalkVisible)
            if (talks.length > 0) {
              pushGeneral()
              const text = match[0]
              segments.push({
                type: MessageSegmentTypes.linkToTalk,
                text,
                talks,
              })
              cur += text.length
              begin = cur
              isMatched = true
            }
          }
        }
      }
    }
    
    if (!isMatched) {
      cur += 1
    }
  }
  pushGeneral()
  return segments
}
