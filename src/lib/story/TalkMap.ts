//
// TalkMap.ts
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
import type { Talk } from "./Talk"
import { StoryElementTypes } from "./StoryElement"
import { timePartFromMilliseconds } from "./TimePart"

export interface TalkMap {
  getTalkByTalkNo(talkNo: number): TalkWithDay | undefined
  getTalkByTime(day: number, hour: number, minute: number): Talk[]
}

export interface TalkWithDay {
  talk: Talk
  day: number
}

export function createTalkMap(story: Story): TalkMap {
  function timeString(day: number, hour: number, minute: number): string {
    return `${day}-${hour}-${minute}`
  }
  
  const talkNoMap = new Map<number, TalkWithDay>()
  const timeMap = new Map<string, Talk[]>()

  for (const period of story.periods) {
    const day = period.day
    for (const element of period.elements) {
      if (element.elementType === StoryElementTypes.TALK) {
        if (element.talkNo !== undefined) {
          talkNoMap.set(element.talkNo, { talk: element, day })
        }
        const timePart = timePartFromMilliseconds(element.time)
        const key = timeString(day, timePart.hourPart, timePart.minutePart)
        const talks = timeMap.get(key)
        if (talks !== undefined) {
          talks.push(element)
        } else {
          timeMap.set(key, [element])
        }
      }
    }
  }

  function getTalkByTalkNo(talkNo: number): TalkWithDay | undefined {
    return talkNoMap.get(talkNo)
  }
  
  function getTalkByTime(day: number, hour: number, minute: number): Talk[] {
    return timeMap.get(timeString(day, hour, minute)) ?? []
  }
  
  return {
    getTalkByTalkNo,
    getTalkByTime,
  }
}

export function nullTalkMap(): TalkMap {
  return {
    getTalkByTalkNo: () => undefined,
    getTalkByTime: () => [],
  }
}
