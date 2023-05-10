//
// Talk.ts
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

import type { TalkType } from "./TalkType"
import { type StoryElementBase, StoryElementTypes } from "./StoryElement"

/**
 * Represents a talk which appears in story.
 */
export interface Talk extends StoryElementBase {
  /** Type of this element */
  readonly elementType: typeof StoryElementTypes.TALK

  /** Type of talk */
  readonly talkType: TalkType
  
  /** Avatar which makes this talk */
  readonly avatarId: string

  /** Almost unique identifier in this village */
  readonly xname: string
  
  /** Time on which this talk is made (in milliseconds) */
  readonly time: number
  
  /** Sequence number of public talk (only exists in public talk) */
  readonly talkNo: number | undefined
  
  /** Lines of messages */
  readonly messageLines: string[]
}
