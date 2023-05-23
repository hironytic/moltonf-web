//
// NewWorkspaceScene.ts
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

import { type AppContext } from "../../../AppContext"
import { Scene } from "../../../Scene"
import { derived, type Readable, type Writable, writable } from "svelte/store"
import { WatchingScene } from "../watching/WatchingScene"
import type { Story } from "../../story/Story"
import { SelectWorkspaceScene } from "../select-workspace/SelectWorkspaceScene"
import { currentValueWritable } from "../../CurrentValueStore"
import type { Character, CharacterMap } from "../../story/CharacterMap"
import { createCharacterMap } from "../../story/CharacterMap"
import { type Role, Roles } from "../../story/Role"

export class NewWorkspaceScene extends Scene {
  constructor(appContext: AppContext) {
    super(appContext)
  }
  
  private readonly _step$ = writable<NewWorkspaceStep>(NewWorkspaceSteps.SELECT_STORY)
  get step$(): Readable<NewWorkspaceStep> { return this._step$ }

  private readonly _story$ = currentValueWritable<Story | undefined>(undefined)
  private readonly _characterMap$ = currentValueWritable<CharacterMap | undefined>(undefined)
  private readonly _team$ = currentValueWritable<TeamOption | undefined>(undefined)
  private readonly _villagerRoll$ = currentValueWritable<VillagerRoleOption | undefined>(undefined)
  private readonly _wolfRoll$ = currentValueWritable<WolfRoleOption | undefined>(undefined)
  private readonly _name$ = currentValueWritable<string>("")

  //#region Select Story

  backFromSelectStoryStep() {
    this.appContext.changeScene(new SelectWorkspaceScene(this.appContext))
  }

  get story$(): Readable<Story | undefined> { return this._story$ }
  
  setStory(story: Story) {
    if (this._story$.currentValue !== story) {
      this._story$.set(story)
      this._characterMap$.set(createCharacterMap(story))
    }
    this._step$.set(NewWorkspaceSteps.SELECT_TEAM)
  }

  forwardFromSelectStoryStep() {
    if (this._story$.currentValue !== undefined) {
      this._step$.set(NewWorkspaceSteps.SELECT_TEAM)
    }
  }
  
  //#endregion
  
  //#region Select Team
  
  backFromSelectTeamStep() {
    this._step$.set(NewWorkspaceSteps.SELECT_STORY)
  }
  
  readonly teamOptions$: Readable<TeamOption[]> = derived(this._characterMap$, characterMap => {
    if (characterMap === undefined) {
      return []
    }
    const characters = Array.from(characterMap.values())
    const options: TeamOption[] = [
      TeamOptions.VILLAGER,
      TeamOptions.WOLF,
    ]
    if (characters.find(it => it.role === Roles.HAMSTER) !== undefined) {
      options.push(TeamOptions.HAMSTER)
    }
    options.push(TeamOptions.ANYTHING)
    return options
  })
  
  get team$(): Writable<TeamOption | undefined> { return this._team$ }
  
  readonly canForwardFromSelectTeamStep$: Readable<boolean> = derived([this.teamOptions$, this._team$], ([options, value]) => {
    return value !== undefined && options.includes(value)
  })
  
  forwardFromSelectTeamStep() {
    switch (this._team$.currentValue) {
      case TeamOptions.VILLAGER:
        this._step$.set(NewWorkspaceSteps.SELECT_ROLE_OF_VILLAGER)
        break
      case TeamOptions.WOLF:
        this._step$.set(NewWorkspaceSteps.SELECT_ROLE_OF_WOLF)
        break
      case TeamOptions.ANYTHING:
      case TeamOptions.HAMSTER:
        this.moveToInputNameStep()
        break
    }
  }

  //#endregion
  
  //#region Select Role of Villager
  
  backFromSelectRoleOfVillagerStep() {
    this._step$.set(NewWorkspaceSteps.SELECT_TEAM)
  }
  
  readonly villagerRoleOptions$: Readable<VillagerRoleOption[]> = derived(this._characterMap$, characterMap => {
    if (characterMap === undefined) {
      return []
    }

    const characters = Array.from(characterMap.values())
    const options: VillagerRoleOption[] = []
    if (characters.find(it => it.role === Roles.INNOCENT) !== undefined) {
      options.push(VillagerRoleOptions.INNOCENT)
    }
    if (characters.find(it => it.role === Roles.SEER) !== undefined) {
      options.push(VillagerRoleOptions.SEER)
    }
    if (characters.find(it => it.role === Roles.SHAMAN) !== undefined) {
      options.push(VillagerRoleOptions.SHAMAN)
    }
    if (characters.find(it => it.role === Roles.HUNTER) !== undefined) {
      options.push(VillagerRoleOptions.HUNTER)
    }
    if (characters.find(it => it.role === Roles.FRATER) !== undefined) {
      options.push(VillagerRoleOptions.FRATER)
    }
    options.push(VillagerRoleOptions.LONGEST_SURVIVOR)
    options.push(VillagerRoleOptions.ANYTHING)
    return options
  })
  
  get villagerRole$(): Writable<VillagerRoleOption | undefined> { return this._villagerRoll$ }

  readonly canForwardFromSelectRoleOfVillagerStep$: Readable<boolean> = derived([this.villagerRoleOptions$, this._villagerRoll$], ([options, value]) => {
    return value !== undefined && options.includes(value)
  })

  forwardFromSelectRoleOfVillagerStep() {
    this.moveToInputNameStep()
  }
  
  //#endregion
  
  //#region Select Roll of Wolf
  
  backFromSelectRoleOfWolfStep() {
    this._step$.set(NewWorkspaceSteps.SELECT_TEAM)
  }

  readonly wolfRoleOptions$: Readable<WolfRoleOption[]> = derived(this._characterMap$, characterMap => {
    if (characterMap === undefined) {
      return []
    }

    const characters = Array.from(characterMap.values())
    const options: WolfRoleOption[] = []
    if (characters.find(it => it.role === Roles.WOLF) !== undefined) {
      options.push(WolfRoleOptions.WOLF)
    }
    if (characters.find(it => it.role === Roles.MADMAN) !== undefined) {
      options.push(WolfRoleOptions.MADMAN)
    }
    options.push(WolfRoleOptions.LONGEST_SURVIVOR)
    options.push(WolfRoleOptions.ANYTHING)
    return options
  })
  
  get wolfRole$(): Writable<WolfRoleOption | undefined> { return this._wolfRoll$ }

  readonly canForwardFromSelectRoleOfWolfStep$: Readable<boolean> = derived([this.wolfRoleOptions$, this._wolfRoll$], ([options, value]) => {
    return value !== undefined && options.includes(value)
  })

  forwardFromSelectRoleOfWolfStep() {
    this.moveToInputNameStep()
  }
  
  //#endregion
  
  //#region Input Name
  
  moveToInputNameStep() {
    const role = this.roleNameOf(this._team$.currentValue, this._villagerRoll$.currentValue, this._wolfRoll$.currentValue)
    const name = (this._story$.currentValue?.villageFullName ?? "") + ((role !== "") ? `（${role}）` : "")
    this._name$.set(name)
    this._step$.set(NewWorkspaceSteps.INPUT_NAME)
  }

  private roleNameOf(team: TeamOption | undefined, villagerRoleOption: VillagerRoleOption | undefined, wolfRoleOption: WolfRoleOption | undefined): string {
    switch (team) {
      case TeamOptions.VILLAGER:
        switch (villagerRoleOption) {
          case VillagerRoleOptions.INNOCENT:
            return "ただの村人"
          case VillagerRoleOptions.SEER:
            return "占い師"
          case VillagerRoleOptions.SHAMAN:
            return "霊能者"
          case VillagerRoleOptions.HUNTER:
            return "狩人"
          case VillagerRoleOptions.FRATER:
            return "共有者"
          default:
            return "村人側"
        }
        
      case TeamOptions.WOLF:
        switch (wolfRoleOption) {
          case WolfRoleOptions.WOLF:
            return "人狼"
          case WolfRoleOptions.MADMAN:
            return "狂人"
          default:
            return "人狼側"
        }
        
      case TeamOptions.HAMSTER:
        return "ハムスター人間"
      
      default:
        return ""
    }
  }
  
  backFromInputNameStep() {
    switch (this._team$.currentValue) {
      case TeamOptions.VILLAGER:
        this._step$.set(NewWorkspaceSteps.SELECT_ROLE_OF_VILLAGER)
        break
      case TeamOptions.WOLF:
        this._step$.set(NewWorkspaceSteps.SELECT_ROLE_OF_WOLF)
        break
      default:
        this._step$.set(NewWorkspaceSteps.SELECT_TEAM)
        break       
    }
  }

  get name$(): Writable<string> { return this._name$ }

  readonly canForwardFromInputNameStep$: Readable<boolean> = derived(this._name$, name => name.length > 0)
  
  forwardFromInputNameStep() {
    this._step$.set(NewWorkspaceSteps.CONFIRM)
  }

  //#endregion

  //#region Confirm

  backFromConfirmStep() {
    this._step$.set(NewWorkspaceSteps.INPUT_NAME)
  }
  
  async registerNewWorkspace(): Promise<void> {
    const story = this._story$.currentValue
    if (story === undefined) {
      console.error("Story is not set!")
      return
    }

    const name = this._name$.currentValue
    if (name === undefined) {
      console.error("Name is not set!")
      return
    }
    
    const character = this.pickCharacter()
    if (character === undefined) {
      console.error("Character could not be picked! Something is wrong!")
      return
    }

    const workspaceStore = await this.appContext.getWorkspaceStore()
    const workspaceData = {
      name: this._name$.currentValue,
      currentDay: 0,
      dayProgress: 0,
      playerCharacter: character.avatar.avatarId,
      lastModified: new Date(),
    }
    const workspace = await workspaceStore.add(story, workspaceData)

    this.appContext.changeScene(new WatchingScene(this.appContext, workspace))
  }

  private pickCharacter(): Character | undefined {
    const villagerRoles: Role[] = [Roles.INNOCENT, Roles.SEER, Roles.SHAMAN, Roles.HUNTER, Roles.FRATER]
    const wolfRoles: Role[] = [Roles.WOLF, Roles.MADMAN]
    const characters = this.shuffleCharacters(this._characterMap$.currentValue ?? new Map())

    switch (this._team$.currentValue) {
      case TeamOptions.VILLAGER:
        switch (this._villagerRoll$.currentValue) {
          case VillagerRoleOptions.INNOCENT:
            return characters.find(it => it.role === Roles.INNOCENT)
          case VillagerRoleOptions.SEER:
            return characters.find(it => it.role === Roles.SEER)
          case VillagerRoleOptions.SHAMAN:
            return characters.find(it => it.role === Roles.SHAMAN)
          case VillagerRoleOptions.HUNTER:
            return characters.find(it => it.role === Roles.HUNTER)
          case VillagerRoleOptions.FRATER:
            return characters.find(it => it.role === Roles.FRATER)
          case VillagerRoleOptions.LONGEST_SURVIVOR:
            return characters
              .filter(it => villagerRoles.includes(it.role))
              .sort((a, b) => b.aliveUntil - a.aliveUntil)[0]
          case VillagerRoleOptions.ANYTHING:
            return characters.find(it => villagerRoles.includes(it.role))
          default:
            return undefined
        }
        
      case TeamOptions.WOLF:
        switch (this._wolfRoll$.currentValue) {
          case WolfRoleOptions.WOLF:
            return characters.find(it => it.role === Roles.WOLF)
          case WolfRoleOptions.MADMAN:
            return characters.find(it => it.role === Roles.MADMAN)
          case WolfRoleOptions.LONGEST_SURVIVOR:
            return characters
              .filter(it => wolfRoles.includes(it.role))
              .sort((a, b) => b.aliveUntil - a.aliveUntil)[0]
          case WolfRoleOptions.ANYTHING:
            return characters.find(it => wolfRoles.includes(it.role))
          default:
            return undefined
        }
        
      case TeamOptions.HAMSTER:
        return characters.find(it => it.role === Roles.HAMSTER)
      
      case TeamOptions.ANYTHING:
        return characters[0]
    }
  }
  
  private shuffleCharacters(characterMap: CharacterMap): Character[] {
    const characters = Array.from(characterMap.values())
    const shuffledCharacters: Character[] = []
    while (characters.length > 0) {
      const index = Math.floor(Math.random() * characters.length)
      shuffledCharacters.push(characters[index] as Character)
      characters.splice(index, 1)
    }
    return shuffledCharacters
  }
  
  //#endregion
}

export const NewWorkspaceSteps = {
  SELECT_STORY: "selectStory",
  SELECT_TEAM: "selectTeam",
  SELECT_ROLE_OF_VILLAGER: "selectRoleOfVillager",
  SELECT_ROLE_OF_WOLF: "selectRoleOfWolf",
  INPUT_NAME: "inputName",
  CONFIRM: "confirm",
} as const
export type NewWorkspaceStep = typeof NewWorkspaceSteps[keyof typeof NewWorkspaceSteps]

export const TeamOptions = {
  VILLAGER: "villager",
  WOLF: "wolf",
  HAMSTER: "hamster",
  ANYTHING: "anything",
} as const
export type TeamOption = typeof TeamOptions[keyof typeof TeamOptions]

export const VillagerRoleOptions = {
  INNOCENT: "innocent",
  SEER: "seer",
  SHAMAN: "shaman",
  HUNTER: "hunter",
  FRATER: "frater",
  LONGEST_SURVIVOR: "longestSurvivor",
  ANYTHING: "anything",
} as const
export type VillagerRoleOption = typeof VillagerRoleOptions[keyof typeof VillagerRoleOptions]

export const WolfRoleOptions = {
  WOLF: "wolf",
  MADMAN: "madman",
  LONGEST_SURVIVOR: "longestSurvivor",
  ANYTHING: "anything",
} as const
export type WolfRoleOption = typeof WolfRoleOptions[keyof typeof WolfRoleOptions]
