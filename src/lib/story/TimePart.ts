//
// TimePart.ts
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

/**
 * Represents time components which doesn't specify a specific point of time.
 * It is not related to any time zone, either.
 */
export interface TimePart {
  /** Hour part value */
  readonly hourPart: number,
  
  /** Minute part value */
  readonly minutePart: number,
  
  /** Second part value */
  readonly secondPart: number,
  
  /** Millisecond part value */
  readonly millisecondPart: number,
}

/**
 * Convert milliseconds to a TimePart.
 * @param milliseconds Number of milliseconds
 */
export function timePartFromMilliseconds(milliseconds: number): TimePart {
  return {
    hourPart: milliseconds / (1000 * 60 * 60),
    minutePart: (milliseconds / (1000 * 60)) % 60,
    secondPart: (milliseconds / 1000) % 60,
    millisecondPart: milliseconds % 1000,
  }
}

/**
 * Convert a TimePart to milliseconds.
 * @param timePart Time part
 */
export function millisecondsFromTimePart(timePart: TimePart): number {
  return timePart.hourPart * (1000 * 60 * 60) +
    timePart.minutePart * (1000 * 60) +
    timePart.secondPart * 1000 +
    timePart.millisecondPart
}
