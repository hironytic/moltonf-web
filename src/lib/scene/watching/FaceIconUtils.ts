//
// FaceIconUtils.ts
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

export const graveIcon = Symbol()

export function createFaceIconUrlMap(story: Story): Map<string | symbol, string> {
  const result = new Map<string | symbol, string>()
  for (const avatar of story.avatarList) {
    if (avatar.faceIconURI !== undefined) {
      result.set(avatar.avatarId, createFaceIconUrl(story.baseURI, avatar.faceIconURI))
    }
  }
  result.set(graveIcon, createFaceIconUrl(story.baseURI, story.graveIconURI))
  return result
}

function createFaceIconUrl(baseURI: string, iconURI: string): string {
  function relocateBaseURI(baseURI: string): string {
    switch (baseURI) {
      case "http://www.wolfg.x0.com/":
        return "http://ninjinix.x0.com/wolfg/"
      case "http://ninjin002.x0.com/wolff/":
        return "http://ninjinix.x0.com/wolff/"
      default:
        return baseURI
    }
  }
  
  const url = new URL(iconURI, relocateBaseURI(baseURI))
  return url.href
}
