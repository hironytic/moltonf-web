//
// CurrentElements.test.ts
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

import { describe, expect, it } from "vitest"
import type { Story } from "../../story/Story"
import { createCharacterMap } from "../../story/CharacterMap"
import { currentElements } from "./CurrentElements"
import { createTestStory } from "./TestStory"

describe("CurrentElements", () => {
  const story: Story = createTestStory()
  
  describe("When player character is just a villager", () => {
    it("should contain a player character info following the start mirror", () => {
      const elements = currentElements(story, createCharacterMap(story), "joachim", 1, 1)
      const messageIndex = elements.findIndex(it => it.messageLines.includes("あなたは 青年 ヨアヒム、ただの村人です。しかしあなたの推理力や発言が、村人側の勝利の鍵となるかもしれません。"))
      expect(messageIndex).not.toBe(-1)
      expect(elements[messageIndex - 1]?.elementId).toBe("6863C770-DB67-404E-B8CD-4ECFC61550A8")
    })
    
    describe("When it is still in progress", () => {
      it("should hide a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "joachim", 3, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeUndefined()
      })
      
      it("should hide a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "joachim", 3, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeUndefined()
      })
      
      it("should hide a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "joachim", 3, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeUndefined()
      })
      
      it("should hide a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "joachim", 3, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeUndefined()
      })
      
      it("should hide a talk in graveyard unless player character dies", () => {
        const elements = currentElements(story, createCharacterMap(story), "joachim", 3, 3)
        expect(elements.find(it => it.elementId === "924463B2-A292-4724-8B8C-74F32BC8B89F")).toBeUndefined()
      })

      it("should show a talk in graveyard if player character is dead 1", () => {
        const elements = currentElements(story, createCharacterMap(story), "regina", 3, 3)
        expect(elements.find(it => it.elementId === "924463B2-A292-4724-8B8C-74F32BC8B89F")).toBeDefined()
      })

      it("should show a talk in graveyard if player character is dead 2", () => {
        const elements = currentElements(story, createCharacterMap(story), "pamela", 4, 3)
        expect(elements.find(it => it.elementId === "924463B2-A292-4724-8B8C-74F32BC8B89F")).toBeDefined()
      })
      
      it("should hide a private talk unless it is from the player character", () => {
        const elements = currentElements(story, createCharacterMap(story), "joachim", 1, 1)
        expect(elements.find(it => it.elementId === "0355A0CF-8E2A-4D05-A509-0282533F959D")).toBeUndefined()
      })

      it("should show a private talk if it is from the player character", () => {
        const elements = currentElements(story, createCharacterMap(story), "regina", 1, 1)
        expect(elements.find(it => it.elementId === "0355A0CF-8E2A-4D05-A509-0282533F959D")).toBeDefined()
      })
    })
    
    describe("When it reached the epilogue", () => {
      it("should show a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "joachim", undefined, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeDefined()
      })

      it("should show a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "joachim", undefined, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeDefined()
      })

      it("should show a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "joachim", undefined, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeDefined()
      })

      it("should show a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "joachim", undefined, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeDefined()
      })

      it("should show a talk in graveyard", () => {
        const elements = currentElements(story, createCharacterMap(story), "joachim", undefined, 3)
        expect(elements.find(it => it.elementId === "924463B2-A292-4724-8B8C-74F32BC8B89F")).toBeDefined()
      })

      it("should show a private talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "joachim", undefined, 1)
        expect(elements.find(it => it.elementId === "0355A0CF-8E2A-4D05-A509-0282533F959D")).toBeDefined()
      })
    })
  })
  
  describe("When player character is a seer", () => {
    it("should contain a player character info following the start mirror", () => {
      const elements = currentElements(story, createCharacterMap(story), "otto", 1, 1)
      const messageIndex = elements.findIndex(it => it.messageLines.includes("あなたは パン屋 オットー、占い師です。毎夜、誰かひとりを占うことができます。それにより、相手が人狼か人間かを知ることができます。"))
      expect(messageIndex).not.toBe(-1)
      expect(elements[messageIndex - 1]?.elementId).toBe("6863C770-DB67-404E-B8CD-4ECFC61550A8")
    })

    describe("Judgement result", () => {
      it("should contain a judgement result when target is a wolf", () => {
        const elements = currentElements(story, createCharacterMap(story), "otto", 3, 3)
        const messageIndex = elements.findIndex(it => it.messageLines.includes("ならず者 ディーター は人狼のようだ。"))
        expect(messageIndex).not.toBe(-1)
        expect(elements[messageIndex - 1]?.elementId).toBe("8AE1DEB4-93CE-45F5-9EF0-05103535728F")
      })
      
      it("should contain a judgement result when target is a villager", () => {
        const elements = currentElements(story, createCharacterMap(story), "otto", 2, 2)
        const messageIndex = elements.findIndex(it => it.messageLines.includes("老人 モーリッツ は人間のようだ。"))
        expect(messageIndex).not.toBe(-1)
        expect(elements[messageIndex - 1]?.elementId).toBe("4C8E1DA3-17A3-4DC8-A04F-C05F1D62677D")
      })

      it("should contain a judgement result when target is a villager, in country E", () => {
        const storyE = {
          ...story,
          landId: "wolfe",
        }
        const elements = currentElements(storyE, createCharacterMap(storyE), "otto", 2, 2)
        const messageIndex = elements.findIndex(it => it.messageLines.includes("老人 モーリッツ は人狼ではないようだ。"))
        expect(messageIndex).not.toBe(-1)
        expect(elements[messageIndex - 1]?.elementId).toBe("4C8E1DA3-17A3-4DC8-A04F-C05F1D62677D")
      })
      
      it("should not contain a judgement result when seer is dead", () => {
        const story = createTestStory("otto")
        const elements = currentElements(story, createCharacterMap(story), "otto", 3, 3)
        const messageIndex = elements.findIndex(it => it.messageLines.includes("ならず者 ディーター は人狼のようだ。"))
        expect(messageIndex).toBe(-1)
      })
    })

    describe("When it is still in progress", () => {
      it("should show a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "otto", 3, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeDefined()
      })

      it("should hide a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "otto", 3, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeUndefined()
      })

      it("should hide a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "otto", 3, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeUndefined()
      })

      it("should hide a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "otto", 3, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeUndefined()
      })
    })

    describe("When it reached the epilogue", () => {
      it("should show a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "otto", undefined, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeDefined()
      })

      it("should show a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "otto", undefined, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeDefined()
      })

      it("should show a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "otto", undefined, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeDefined()
      })

      it("should show a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "otto", undefined, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeDefined()
      })
    })
  })

  describe("When player character is a shaman", () => {
    it("should contain a player character info following the start mirror", () => {
      const elements = currentElements(story, createCharacterMap(story), "nicolas", 1, 1)
      const messageIndex = elements.findIndex(it => it.messageLines.includes("あなたは 旅人 ニコラス、霊能者です。処刑によって命を失ったものが、人間であったか人狼であったかを知ることができます。"))
      expect(messageIndex).not.toBe(-1)
      expect(elements[messageIndex - 1]?.elementId).toBe("6863C770-DB67-404E-B8CD-4ECFC61550A8")
    })

    describe("Informed result", () => {
      it("should contain an informed result when target is a wolf", () => {
        const elements = currentElements(story, createCharacterMap(story), "nicolas", 3, 3)
        const messageIndex = elements.findIndex(it => it.messageLines.includes("神父 ジムゾン は人狼だった。"))
        expect(messageIndex).not.toBe(-1)
        expect(elements[messageIndex - 1]?.elementId).toBe("67772B89-1299-4DF6-99E0-A04179E120C3")
      })

      it("should contain an informed result when target is a villager", () => {
        const elements = currentElements(story, createCharacterMap(story), "nicolas", 4, 4)
        const messageIndex = elements.findIndex(it => it.messageLines.includes("村娘 パメラ は人狼ではなかった。"))
        expect(messageIndex).not.toBe(-1)
        expect(elements[messageIndex - 1]?.elementId).toBe("876FB844-FC38-4280-8A9E-7EBC598CB677")
      })

      it("should contain an informed result of sudden death character", () => {
        const elements = currentElements(story, createCharacterMap(story), "nicolas", 4, 4)
        const messageIndex = elements.findIndex(it => it.messageLines.includes("農夫 ヤコブ は人狼ではなかった。"))
        expect(messageIndex).not.toBe(-1)
        expect(elements[messageIndex - 1]?.elementId).toBe("2CFE5749-E222-4A49-B45F-A2AF17161FFE")
      })

      it("should contain an informed result following the execution, in country G", () => {
        const storyG = { ...story, landId: "wolfg" }
        const elements = currentElements(storyG, createCharacterMap(storyG), "nicolas", 5, 5)
        const messageIndex = elements.findIndex(it => it.messageLines.includes("少年 ペーター は人狼ではなかった。"))
        expect(messageIndex).not.toBe(-1)
        expect(elements[messageIndex - 1]?.elementId).toBe("83C058BD-856B-4686-A1D4-9CC076ECA988")
      })
      
      it("should not contain an informed result when shaman is dead", () => {
        const story = createTestStory("nicolas")
        const elements = currentElements(story, createCharacterMap(story), "nicolas", 3, 3)
        const messageIndex = elements.findIndex(it => it.messageLines.includes("神父 ジムゾン は人狼だった。"))
        expect(messageIndex).toBe(-1)
      })
    })

    describe("When it is still in progress", () => {
      it("should hide a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "nicolas", 3, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeUndefined()
      })

      it("should hide a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "nicolas", 3, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeUndefined()
      })

      it("should hide a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "nicolas", 3, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeUndefined()
      })

      it("should hide a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "nicolas", 3, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeUndefined()
      })
    })

    describe("When it reached the epilogue", () => {
      it("should show a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "nicolas", undefined, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeDefined()
      })

      it("should show a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "nicolas", undefined, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeDefined()
      })

      it("should show a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "nicolas", undefined, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeDefined()
      })

      it("should show a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "nicolas", undefined, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeDefined()
      })
    })
  })

  describe("When player character is a hunter", () => {
    it("should contain a player character info following the start mirror", () => {
      const elements = currentElements(story, createCharacterMap(story), "moritz", 1, 1)
      const messageIndex = elements.findIndex(it => it.messageLines.includes("あなたは 老人 モーリッツ、狩人です。毎夜、ひとりだけを、人狼の襲撃から守ることができます。人狼の行動を読み、村人たちを人狼から守って下さい。"))
      expect(messageIndex).not.toBe(-1)
      expect(elements[messageIndex - 1]?.elementId).toBe("6863C770-DB67-404E-B8CD-4ECFC61550A8")
    })

    describe("Guard result", () => {
      it("should contain a guard result when succeeded", () => {
        const elements = currentElements(story, createCharacterMap(story), "moritz", 4, 4)
        const messageIndex = elements.findIndex(it => it.messageLines.includes("羊飼い カタリナ を人狼の襲撃から守った。"))
        expect(messageIndex).not.toBe(-1)
        expect(elements[messageIndex - 1]?.elementId).toBe("12FBA65A-91A3-4E08-A748-974F3509A705")
      })

      it("should not contain a guard result on country G", () => {
        const storyG = { ...story, landId: "wolfg" }
        const elements = currentElements(storyG, createCharacterMap(storyG), "moritz", 4, 4)
        const messageIndex = elements.findIndex(it => it.messageLines.includes("羊飼い カタリナ を人狼の襲撃から守った。"))
        expect(messageIndex).toBe(-1)
      })

      it("should not contain a guard result when failed", () => {
        const elements = currentElements(story, createCharacterMap(story), "moritz", 3, 3)
        const messageIndex = elements.findIndex(it => it.messageLines.includes("村長 ヴァルター を人狼の襲撃から守った。"))
        expect(messageIndex).toBe(-1)
      })

      it("should not contain a guard result if there are no wolf's attack", () => {
        const elements = currentElements(story, createCharacterMap(story), "moritz", 5, 5)
        const messageIndex = elements.findIndex(it => it.messageLines.includes("旅人 ニコラス を人狼の襲撃から守った。"))
        expect(messageIndex).toBe(-1)
      })
      
      it("should not contain a guard result when the hunter is dead", () => {
        const story = createTestStory("moritz")
        const elements = currentElements(story, createCharacterMap(story), "moritz", 4, 4)
        const messageIndex = elements.findIndex(it => it.messageLines.includes("羊飼い カタリナ を人狼の襲撃から守った。"))
        expect(messageIndex).toBe(-1)
      })
    })

    describe("When it is still in progress", () => {
      it("should hide a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "moritz", 3, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeUndefined()
      })

      it("should hide a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "moritz", 3, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeUndefined()
      })

      it("should show a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "moritz", 3, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeDefined()
      })

      it("should hide a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "moritz", 3, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeUndefined()
      })
    })

    describe("When it reached the epilogue", () => {
      it("should show a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "moritz", undefined, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeDefined()
      })

      it("should show a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "moritz", undefined, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeDefined()
      })

      it("should show a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "moritz", undefined, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeDefined()
      })

      it("should show a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "moritz", undefined, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeDefined()
      })
    })
  })

  describe("When player character is a frater", () => {
    it("should contain a player character info following the start mirror", () => {
      const elements = currentElements(story, createCharacterMap(story), "regina", 1, 1)
      const messageIndex = elements.findIndex(it => it.messageLines.includes("あなたは 宿屋の女主人 レジーナ、共有者です。もうひとりの共有者が誰であるかを知る事ができます。"))
      expect(messageIndex).not.toBe(-1)
      expect(elements[messageIndex - 1]?.elementId).toBe("6863C770-DB67-404E-B8CD-4ECFC61550A8")
      const element = elements[messageIndex]
      expect(element?.messageLines?.includes("もうひとりの共有者は、村長 ヴァルター です。")).toBeTruthy()
    })

    describe("When it is still in progress", () => {
      it("should hide a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "regina", 3, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeUndefined()
      })

      it("should hide a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "regina", 3, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeUndefined()
      })

      it("should hide a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "regina", 3, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeUndefined()
      })

      it("should hide a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "regina", 3, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeUndefined()
      })
    })

    describe("When it reached the epilogue", () => {
      it("should show a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "regina", undefined, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeDefined()
      })

      it("should show a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "regina", undefined, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeDefined()
      })

      it("should show a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "regina", undefined, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeDefined()
      })

      it("should show a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "regina", undefined, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeDefined()
      })
    })
  })

  describe("When player character is a madman", () => {
    it("should contain a player character info following the start mirror", () => {
      const elements = currentElements(story, createCharacterMap(story), "albin", 1, 1)
      const messageIndex = elements.findIndex(it => it.messageLines.includes("あなたは 行商人 アルビン、人狼の繁栄を望む狂人です。人狼の勝利があなたの勝利となります。"))
      expect(messageIndex).not.toBe(-1)
      expect(elements[messageIndex - 1]?.elementId).toBe("6863C770-DB67-404E-B8CD-4ECFC61550A8")
    })

    describe("When it is still in progress", () => {
      it("should hide a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "albin", 3, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeUndefined()
      })

      it("should hide a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "albin", 3, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeUndefined()
      })

      it("should hide a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "albin", 3, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeUndefined()
      })

      it("should hide a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "albin", 3, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeUndefined()
      })
      
      it("should show a wolf's talk on country C", () => {
        const storyC = { ...story, landId: "wolfc" }
        const elements = currentElements(storyC, createCharacterMap(storyC), "albin", 3, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeDefined()
      })
    })

    describe("When it reached the epilogue", () => {
      it("should show a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "albin", undefined, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeDefined()
      })

      it("should show a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "albin", undefined, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeDefined()
      })

      it("should show a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "albin", undefined, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeDefined()
      })

      it("should show a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "albin", undefined, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeDefined()
      })
    })
  })

  describe("When player character is a hamster", () => {
    it("should contain a player character info following the start mirror", () => {
      const elements = currentElements(story, createCharacterMap(story), "peter", 1, 1)
      const messageIndex = elements.findIndex(it => it.messageLines.includes("あなたは 少年 ペーター、ハムスター人間です。人狼に襲撃されても死亡しませんが、占い師に占われると死亡します。"))
      expect(messageIndex).not.toBe(-1)
      expect(elements[messageIndex - 1]?.elementId).toBe("6863C770-DB67-404E-B8CD-4ECFC61550A8")
    })

    describe("When it is still in progress", () => {
      it("should hide a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "peter", 3, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeUndefined()
      })

      it("should hide a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "peter", 3, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeUndefined()
      })

      it("should hide a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "peter", 3, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeUndefined()
      })

      it("should hide a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "peter", 3, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeUndefined()
      })
    })

    describe("When it reached the epilogue", () => {
      it("should show a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "peter", undefined, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeDefined()
      })

      it("should show a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "peter", undefined, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeDefined()
      })

      it("should show a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "peter", undefined, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeDefined()
      })

      it("should show a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "peter", undefined, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeDefined()
      })
    })
  })

  describe("When player character is a wolf", () => {
    it("should contain a player character info following the start mirror", () => {
      const elements = currentElements(story, createCharacterMap(story), "liesa", 1, 1)
      const messageIndex = elements.findIndex(it => it.messageLines.includes("あなたは 少女 リーザ、人狼です。村人を人狼と同数以下まで減らせば勝利です。村人に悟られないように、慎重に邪魔者を排除していきましょう。"))
      expect(messageIndex).not.toBe(-1)
      expect(elements[messageIndex - 1]?.elementId).toBe("6863C770-DB67-404E-B8CD-4ECFC61550A8")
    })

    describe("When it is still in progress", () => {
      it("should hide a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "liesa", 3, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeUndefined()
      })

      it("should show a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "liesa", 3, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeDefined()
      })

      it("should hide a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "liesa", 3, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeUndefined()
      })

      it("should show a wolf's talk if player character is alive", () => {
        const elements = currentElements(story, createCharacterMap(story), "liesa", 3, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeDefined()
      })

      it("should hide a wolf's talk if player character is dead", () => {
        const elements = currentElements(story, createCharacterMap(story), "simson", 3, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeUndefined()
      })
    })

    describe("When it reached the epilogue", () => {
      it("should show a judge", () => {
        const elements = currentElements(story, createCharacterMap(story), "liesa", undefined, 3)
        expect(elements.find(it => it.elementId === "8AE1DEB4-93CE-45F5-9EF0-05103535728F")).toBeDefined()
      })

      it("should show a assault", () => {
        const elements = currentElements(story, createCharacterMap(story), "liesa", undefined, 3)
        expect(elements.find(it => it.elementId === "43AA25F5-5135-4EC0-ADC4-C46A16587D16")).toBeDefined()
      })

      it("should show a guard", () => {
        const elements = currentElements(story, createCharacterMap(story), "liesa", undefined, 3)
        expect(elements.find(it => it.elementId === "BB770850-7822-498D-B528-32CE1949DA08")).toBeDefined()
      })

      it("should show a wolf's talk", () => {
        const elements = currentElements(story, createCharacterMap(story), "liesa", undefined, 3)
        expect(elements.find(it => it.elementId === "F720D764-05CC-4CBD-8ECC-69185C59EAE8")).toBeDefined()
      })
    })
  })
})
