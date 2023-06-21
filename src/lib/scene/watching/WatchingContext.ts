//
// WatchingContext.ts
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

export class WatchingContext {
  static readonly Key = Symbol()

  private _elementMap = new Map<string, HTMLElement>()

  addElement(id: string, elem: HTMLElement) {
    this._elementMap.set(id, elem)
  }

  removeElement(id: string) {
    this._elementMap.delete(id)
  }

  getElementIdByYPosition(yPosition: number): string | undefined {
    let result: string | undefined = undefined
    let maxTop = Number.NEGATIVE_INFINITY
    
    for (const [id, element] of this._elementMap.entries()) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= yPosition) {
        const top = rect.top
        if (top > maxTop) {
          result = id
          maxTop = top
        }
      }
    }
    return result
  }
  
  scrollToElement(id: string) {
    const elem = this._elementMap.get(id)
    if (elem !== undefined) {
      elem.scrollIntoView()
    }
  }
}
