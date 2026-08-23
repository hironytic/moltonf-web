//
// NewWorkspaceScene.svelte.ts
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

import { type AppContext } from "../../../AppContext.svelte"
import { Scene } from "../../../Scene"
import type { Story } from "../../story/Story"
import type { Character, CharacterMap } from "../../story/CharacterMap"
import { createCharacterMap } from "../../story/CharacterMap"
import { type Role, Roles } from "../../story/Role"
import { HistoryLocation } from "../../../History.svelte"

export class NewWorkspaceScene extends Scene {
  constructor(appContext: AppContext) {
    super(appContext)
  }
  
  private _step = $state<NewWorkspaceStep>(NewWorkspaceSteps.SELECT_STORY)
  get step(): NewWorkspaceStep { return this._step }

  private _story = $state.raw<Story | undefined>(undefined)
  private _characterMap = $state.raw<CharacterMap | undefined>(undefined)
  private _team = $state<TeamOption | undefined>(undefined)
  private _villagerRoll = $state<VillagerRoleOption | undefined>(undefined)
  private _wolfRoll = $state<WolfRoleOption | undefined>(undefined)
  private _name = $state<string>("")

  //#region Select Story

  backFromSelectStoryStep() {
    this.appContext.history.navigate(HistoryLocation.fromPath("/"), false)
  }

  get story(): Story | undefined { return this._story }
  
  setStory(story: Story) {
    if (this._story !== story) {
      this._story = story
      this._characterMap = createCharacterMap(story)
    }
    this._step = NewWorkspaceSteps.SELECT_TEAM
  }

  forwardFromSelectStoryStep() {
    if (this._story !== undefined) {
      this._step = NewWorkspaceSteps.SELECT_TEAM
    }
  }
  
  //#endregion
  
  //#region Select Team
  
  backFromSelectTeamStep() {
    this._step = NewWorkspaceSteps.SELECT_STORY
  }
  
  readonly teamOptions: TeamOption[] = $derived.by(() => {
    if (this._characterMap === undefined) {
      return []
    }
    const characters = Array.from(this._characterMap.values())
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
  
  get team(): TeamOption | undefined { return this._team }
  set team(newValue: TeamOption | undefined) { 
    this._team = newValue
  }
  
  readonly canForwardFromSelectTeamStep: boolean = $derived.by(() => {
    return this._team !== undefined && this.teamOptions.includes(this._team)
  })
  
  forwardFromSelectTeamStep() {
    switch (this._team) {
      case TeamOptions.VILLAGER:
        this._step = NewWorkspaceSteps.SELECT_ROLE_OF_VILLAGER
        break
      case TeamOptions.WOLF:
        this._step = NewWorkspaceSteps.SELECT_ROLE_OF_WOLF
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
    this._step = NewWorkspaceSteps.SELECT_TEAM
  }
  
  readonly villagerRoleOptions: VillagerRoleOption[] = $derived.by(() => {
    if (this._characterMap === undefined) {
      return []
    }

    const characters = Array.from(this._characterMap.values())
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
  
  get villagerRole(): VillagerRoleOption | undefined { return this._villagerRoll }
  set villagerRole(newValue: VillagerRoleOption | undefined) { this._villagerRoll = newValue }

  readonly canForwardFromSelectRoleOfVillagerStep: boolean = $derived.by(() => {
    return this._villagerRoll !== undefined && this.villagerRoleOptions.includes(this._villagerRoll)
    
  })

  forwardFromSelectRoleOfVillagerStep() {
    this.moveToInputNameStep()
  }
  
  //#endregion
  
  //#region Select Roll of Wolf
  
  backFromSelectRoleOfWolfStep() {
    this._step = NewWorkspaceSteps.SELECT_TEAM
  }

  readonly wolfRoleOptions: WolfRoleOption[] = $derived.by(() => {
    if (this._characterMap === undefined) {
      return []
    }

    const characters = Array.from(this._characterMap.values())
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
  
  get wolfRole(): WolfRoleOption | undefined { return this._wolfRoll }
  set wolfRole(newValue: WolfRoleOption | undefined) { this._wolfRoll = newValue }

  readonly canForwardFromSelectRoleOfWolfStep: boolean = $derived.by(() => {
    return this._wolfRoll !== undefined && this.wolfRoleOptions.includes(this._wolfRoll)
  })

  forwardFromSelectRoleOfWolfStep() {
    this.moveToInputNameStep()
  }
  
  //#endregion
  
  //#region Input Name
  
  moveToInputNameStep() {
    const role = this.roleNameOf(this._team, this._villagerRoll, this._wolfRoll)
    this._name = (this._story?.villageFullName ?? "") + ((role !== "") ? `（${role}）` : "")
    this._step = NewWorkspaceSteps.INPUT_NAME
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
    switch (this._team) {
      case TeamOptions.VILLAGER:
        this._step = NewWorkspaceSteps.SELECT_ROLE_OF_VILLAGER
        break
      case TeamOptions.WOLF:
        this._step = NewWorkspaceSteps.SELECT_ROLE_OF_WOLF
        break
      default:
        this._step = NewWorkspaceSteps.SELECT_TEAM
        break       
    }
  }

  get name(): string { return this._name }
  set name(newValue: string) { this._name = newValue }

  readonly canForwardFromInputNameStep: boolean = $derived(this._name.length > 0)
  
  forwardFromInputNameStep() {
    this._step = NewWorkspaceSteps.CONFIRM
  }

  //#endregion

  //#region Confirm

  backFromConfirmStep() {
    this._step = NewWorkspaceSteps.INPUT_NAME
  }
  
  async registerNewWorkspace(): Promise<void> {
    const story = this._story
    if (story === undefined) {
      console.error("Story is not set!")
      return
    }

    const name = this._name
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
      name,
      currentDay: 0,
      dayProgress: 0,
      playerCharacter: character.avatar.avatarId,
      lastModified: new Date(),
    }
    const workspace = await workspaceStore.add(story, workspaceData)
    this.appContext.history.navigate(HistoryLocation.fromComponents(["/", workspace.id]), true)
  }

  private pickCharacter(): Character | undefined {
    const villagerRoles: Role[] = [Roles.INNOCENT, Roles.SEER, Roles.SHAMAN, Roles.HUNTER, Roles.FRATER]
    const wolfRoles: Role[] = [Roles.WOLF, Roles.MADMAN]
    const characters = this.shuffleCharacters(this._characterMap ?? new Map())

    switch (this._team) {
      case TeamOptions.VILLAGER:
        switch (this._villagerRoll) {
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
        switch (this._wolfRoll) {
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
    const characters = Array.from(characterMap.values()).filter(it => it.avatar.avatarId !== "gerd")
    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const chi = characters[i]
      const chj = characters[j]
      if (chi !== undefined && chj !== undefined) {
        characters[i] = chj
        characters[j] = chi
      }
    }
    return characters
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
