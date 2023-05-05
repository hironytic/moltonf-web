//
// EventFamily.ts
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

export const EventFamilies = {
  /**
   * System announce
   * 
   * ex. "次の日の朝、楽天家 ゲルト が無残な姿で発見された。"
   */
  ANNOUNCE: "announce",

  /**
   * Request for operation
   * 
   * ex. "00:15 までに、誰を処刑するべきかの投票先を決定して下さい。"
   */
  ORDER: "order",

  /**
   * About specific ability
   * 
   * ex. "司書 クララ は、村長 ヴァルター を守っている。"
   */
  EXTRA: "extra",
} as const

/**
 * Event family
 */
export type EventFamily = typeof EventFamilies[keyof typeof EventFamilies]
