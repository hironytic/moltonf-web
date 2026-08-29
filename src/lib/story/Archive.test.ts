//
// Archive.test.ts
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

// @vitest-environment happy-dom

import { describe, expect, it } from "vitest"
import { loadStoryFromArchiveFile } from "./Archive"

const ARCHIVE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<village fullName="テスト村" xml:base="https://example.com/" landId="test" graveIconURI="https://example.com/grave.png">
  <avatarList>
    <avatar avatarId="1" fullName="ヨアヒム" shortName="ヨアヒム"/>
  </avatarList>
  <period type="progress" day="1">
    <talk type="public" avatarId="1" xname="1" time="00:00:00">
      <li>これは<rawdata encoding="Shift_JIS" hexBin="874a">〜</rawdata>です</li>
    </talk>
  </period>
</village>
`

describe("Archive", () => {
  describe("li element containing rawdata", () => {
    it("should use the rawdata element's text content instead of literal \"null\"", async () => {
      const file = new File([ARCHIVE_XML], "archive.xml", { type: "text/xml" })
      const story = await loadStoryFromArchiveFile(file)
      const talk = story.periods[0]?.elements[0]
      expect(talk?.messageLines).toEqual(["これは〜です"])
    })
  })

  describe("time attribute with fractional seconds", () => {
    const baseMilliseconds = 20 * 3600000 + 1 * 60000

    it.each([
      ["20:01:00.5", 500],
      ["20:01:00.05", 50],
      ["20:01:00.500", 500],
      ["20:01:00.5000", 500],
    ])("should scale the fractional part of time=\"%s\" to %i milliseconds", async (time, expectedMilliseconds) => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<village fullName="テスト村" xml:base="https://example.com/" landId="test" graveIconURI="https://example.com/grave.png">
  <avatarList>
    <avatar avatarId="1" fullName="ヨアヒム" shortName="ヨアヒム"/>
  </avatarList>
  <period type="progress" day="1">
    <talk type="public" avatarId="1" xname="1" time="${time}">
      <li>これはテストです</li>
    </talk>
  </period>
</village>
`
      const file = new File([xml], "archive.xml", { type: "text/xml" })
      const story = await loadStoryFromArchiveFile(file)
      const talk = story.periods[0]?.elements[0] as { time: number }
      expect(talk.time - baseMilliseconds).toBe(expectedMilliseconds)
    })
  })
})
