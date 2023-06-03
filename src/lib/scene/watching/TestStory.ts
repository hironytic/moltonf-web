//
// TestStory.ts
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
import { PeriodTypes } from "../../story/PeriodType"
import { StoryElementTypes } from "../../story/StoryElement"
import { EventFamilies } from "../../story/EventFamily"
import { EventNames } from "../../story/StoryEventName"
import { TalkTypes } from "../../story/TalkType"
import { millisecondsFromTimePart } from "../../story/TimePart"
import { Roles } from "../../story/Role"

export function createTestStory(deadAvatarId?: string): Story {
  const story = {
    version: 1 as const,
    villageFullName: "F9999 確認の村",
    baseURI: "http://ninjin002.x0.com/wolff/",
    landId: "wolff",
    graveIconURI: "plugin_wolf/img/face99.jpg",
    avatarList: [
      { avatarId: "gerd", fullName: "楽天家 ゲルト", shortName: "ゲルト", faceIconURI: "plugin_wolf/img/face01.jpg" },
      { avatarId: "peter", fullName: "少年 ペーター", shortName: "ペーター", faceIconURI: "plugin_wolf/img/face08.jpg" },
      { avatarId: "walter", fullName: "村長 ヴァルター", shortName: "ヴァルター", faceIconURI: "plugin_wolf/img/face02.jpg", },
      { avatarId: "nicolas", fullName: "旅人 ニコラス", shortName: "ニコラス", faceIconURI: "plugin_wolf/img/face06.jpg", },
      { avatarId: "liesa", fullName: "少女 リーザ", shortName: "リーザ", faceIconURI: "plugin_wolf/img/face09.jpg", },
      { avatarId: "otto", fullName: "パン屋 オットー", shortName: "オットー", faceIconURI: "plugin_wolf/img/face12.jpg", },
      { avatarId: "katharina", fullName: "羊飼い カタリナ", shortName: "カタリナ", faceIconURI: "plugin_wolf/img/face11.jpg", },
      { avatarId: "moritz", fullName: "老人 モーリッツ", shortName: "モーリッツ", faceIconURI: "plugin_wolf/img/face03.jpg", },
      { avatarId: "joachim", fullName: "青年 ヨアヒム", shortName: "ヨアヒム", faceIconURI: "plugin_wolf/img/face13.jpg", },
      { avatarId: "simson", fullName: "神父 ジムゾン", shortName: "ジムゾン", faceIconURI: "plugin_wolf/img/face04.jpg", },
      { avatarId: "dieter", fullName: "ならず者 ディーター", shortName: "ディーター", faceIconURI: "plugin_wolf/img/face07.jpg", },
      { avatarId: "pamela", fullName: "村娘 パメラ", shortName: "パメラ", faceIconURI: "plugin_wolf/img/face14.jpg", },
      { avatarId: "jacob", fullName: "農夫 ヤコブ", shortName: "ヤコブ", faceIconURI: "plugin_wolf/img/face15.jpg", },
      { avatarId: "albin", fullName: "行商人 アルビン", shortName: "アルビン", faceIconURI: "plugin_wolf/img/face10.jpg", },
      { avatarId: "thomas", fullName: "木こり トーマス", shortName: "トーマス", faceIconURI: "plugin_wolf/img/face05.jpg", },
      { avatarId: "regina", fullName: "宿屋の女主人 レジーナ", shortName: "レジーナ", faceIconURI: "plugin_wolf/img/face16.jpg", },
    ],
    periods: [
      {
        type: PeriodTypes.PROLOGUE,
        day: 0,
        elements: [
          // StartEntry 
          {
            elementId: "F7A1FD8A-0832-45DD-8864-5093E81481C8",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.START_ENTRY,
            messageLines: [
              "昼間は人間のふりをして、夜に正体を現すという人狼。",
              "その人狼が、この村に紛れ込んでいるという噂が広がった。",
              "",
              "村人達は半信半疑ながらも、村はずれの宿に集められることになった。",
            ],
          },

          // OnStage
          {
            elementId: "3E8FBF83-20D3-4139-8112-E48B2A809C89",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.ON_STAGE,
            entryNo: 1,
            avatarId: "gerd",
            messageLines: [
              "1人目、楽天家 ゲルト。",
            ],
          },

          // Talk (public)
          {
            elementId: "824595DC-1CCC-4B74-99AF-AB842CCB7A8C",
            elementType: StoryElementTypes.TALK,
            talkType: TalkTypes.PUBLIC,
            avatarId: "gerd",
            xname: "mes1106239652",
            time: millisecondsFromTimePart({ hourPart: 1, minutePart: 47, secondPart: 0, millisecondPart: 0 }),
            talkNo: 1,
            messageLines: [
              "人狼なんているわけないじゃん。みんな大げさだなあ",
              "",
            ],
          },
        ],
      },
      {
        type: PeriodTypes.PROGRESS,
        day: 1,
        elements: [
          // StartMirror
          {
            elementId: "6863C770-DB67-404E-B8CD-4ECFC61550A8",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.START_MIRROR,
            messageLines: [
              "さあ、自らの姿を鏡に映してみよう。",
              "そこに映るのはただの村人か、それとも血に飢えた人狼か。",
              "",
              "例え人狼でも、多人数で立ち向かえば怖くはない。",
              "問題は、だれが人狼なのかという事だ。",
              "占い師の能力を持つ人間ならば、それを見破れるだろう。"
            ],
          },

          // OpenRole
          {
            elementId: "A96EE08C-6B17-454C-89B0-8C365EE62C23",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.OPEN_ROLE,
            roleHeads: {
              innocent: 7,
              wolf: 3,
              seer: 1,
              shaman: 1,
              madman: 1,
              hunter: 1,
              frater: 2,
            },
            messageLines: [
              "どうやらこの中には、村人が7名、人狼が3名、占い師が1名、霊能者が1名、狂人が1名、狩人が1名、共有者が2名いるようだ。",
            ],
          },

          // Talk (private)
          {
            elementId: "0355A0CF-8E2A-4D05-A509-0282533F959D",
            elementType: StoryElementTypes.TALK,
            talkType: TalkTypes.PRIVATE,
            avatarId: "regina",
            xname: "mes1106305267",
            time: millisecondsFromTimePart({ hourPart: 20, minutePart: 1, secondPart: 0, millisecondPart: 0 }),
            talkNo: undefined,
            messageLines: [
              "うわー、この役職かー。どうしようかなー",
            ],
          },

          // Talk (wolf)
          {
            elementId: "E2D8A295-7633-4781-B8CE-F811E9F2DE0D",
            elementType: StoryElementTypes.TALK,
            talkType: TalkTypes.WOLF,
            avatarId: "liesa",
            xname: "mes1106305425",
            time: millisecondsFromTimePart({ hourPart: 20, minutePart: 3, secondPart: 0, millisecondPart: 0 }),
            talkNo: undefined,
            messageLines: [
              "わおーん",
              "お仲間はいるかー？",
            ],
          },
        ]
      },
      {
        type: PeriodTypes.PROGRESS,
        day: 2,
        elements: [
          // Judge (the target is villager)
          {
            elementId: "4C8E1DA3-17A3-4DC8-A04F-C05F1D62677D",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.EXTRA,
            eventName: EventNames.JUDGE,
            byWhom: "otto",
            target: "moritz",
            messageLines: [
              "パン屋 オットー は、老人 モーリッツ を占った。",
            ],
          },

          // Murdered
          {
            "elementId": "3B5E9928-1EAF-4EEA-B143-F6AA7D76D536",
            "elementType": StoryElementTypes.STORY_EVENT,
            "eventFamily": EventFamilies.ANNOUNCE,
            eventName: EventNames.MURDERED,
            avatarIds: ["gerd"],
            messageLines: [
              "次の日の朝、楽天家 ゲルト が無残な姿で発見された。"
            ],
          },

          // StartAssault
          {
            elementId: "98B18CE8-7FD9-4212-A9C5-E365A2F775F6",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.START_ASSAULT,
            messageLines: [
              "ついに犠牲者が出た。人狼はこの村人達のなかにいる。",
              "しかし、それを見分ける手段はない。",
              "",
              "村人達は、疑わしい者を排除するため、投票を行う事にした。",
              "無実の犠牲者が出るのもやむをえない。村が全滅するよりは……。",
              "",
              "最後まで残るのは村人か、それとも人狼か。",
            ],
          },

          // Survivor
          {
            elementId: "77E537C5-776F-4A28-ACE7-B5111342CD76",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.SURVIVOR,
            avatarIds: [
              "peter", "walter", "nicolas", "liesa", "otto", "katharina", "moritz", "joachim",
              "simson", "dieter", "pamela", "jacob", "albin", "thomas", "regina",
            ],
            messageLines: [
              "現在の生存者は、少年 ペーター、村長 ヴァルター、旅人 ニコラス、少女 リーザ、パン屋 オットー、羊飼い カタリナ、老人 モーリッツ、青年 ヨアヒム、神父 ジムゾン、ならず者 ディーター、村娘 パメラ、農夫 ヤコブ、行商人 アルビン、木こり トーマス、宿屋の女主人 レジーナ の 15 名。",
            ],
          }
        ]
      },
      {
        type: PeriodTypes.PROGRESS,
        day: 3,
        elements: [
          // Counting (The victim is wolf)
          {
            elementId: "67772B89-1299-4DF6-99E0-A04179E120C3",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.COUNTING,
            victim: "simson",
            votes: {
              "peter": "simson",
              "walter": "simson",
              "nicolas": "simson",
              "liesa": "jacob",
              "otto": "jacob",
              "katharina": "simson",
              "moritz": "simson",
              "joachim": "jacob",
              "simson": "jacob",
              "dieter": "jacob",
              "pamela": "walter",
              "jacob": "simson",
              "albin": "simson",
              "thomas": "jacob",
              "regina": "jacob",
            },
            messageLines: [
              "少年 ペーター は 神父 ジムゾン に投票した。",
              "村長 ヴァルター は 神父 ジムゾン に投票した。",
              "旅人 ニコラス は 神父 ジムゾン に投票した。",
              "少女 リーザ は 農夫 ヤコブ に投票した。",
              "パン屋 オットー は 農夫 ヤコブ に投票した。",
              "羊飼い カタリナ は 神父 ジムゾン に投票した。",
              "老人 モーリッツ は 神父 ジムゾン に投票した。",
              "青年 ヨアヒム は 農夫 ヤコブ に投票した。",
              "神父 ジムゾン は 農夫 ヤコブ に投票した。",
              "ならず者 ディーター は 農夫 ヤコブ に投票した。",
              "村娘 パメラ は 村長 ヴァルター に投票した。",
              "農夫 ヤコブ は 神父 ジムゾン に投票した。",
              "行商人 アルビン は 神父 ジムゾン に投票した。",
              "木こり トーマス は 農夫 ヤコブ に投票した。",
              "宿屋の女主人 レジーナ は 農夫 ヤコブ に投票した。",
              "",
              "神父 ジムゾン は村人達の手により処刑された。",
            ],
          },

          // Judge (target is wolf)
          {
            elementId: "8AE1DEB4-93CE-45F5-9EF0-05103535728F",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.EXTRA,
            eventName: EventNames.JUDGE,
            byWhom: "otto",
            target: "dieter",
            messageLines: [
              "パン屋 オットー は、ならず者 ディーター を占った。",
            ],
          },

          // Assault
          {
            elementId: "43AA25F5-5135-4EC0-ADC4-C46A16587D16",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.EXTRA,
            eventName: EventNames.ASSAULT,
            byWhom: "dieter",
            target: "regina",
            time: millisecondsFromTimePart({ hourPart: 20, minutePart: 0, secondPart: 0, millisecondPart: 0 }),
            xname: "mes1106478002",
            messageLines: [
              "宿屋の女主人 レジーナ ！ 今日がお前の命日だ！",
            ],
          },

          // Guard (fail)
          {
            elementId: "BB770850-7822-498D-B528-32CE1949DA08",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.EXTRA,
            eventName: EventNames.GUARD,
            byWhom: "moritz",
            target: "walter",
            messageLines: [
              "老人 モーリッツ は、村長 ヴァルター を守っている。",
            ],
          },

          // Murdered
          {
            elementId: "5A7BEA37-B8C2-4076-BA39-0DF47F1E926B",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.MURDERED,
            avatarIds: ["regina"],
            messageLines: [
              "次の日の朝、宿屋の女主人 レジーナ が無残な姿で発見された。",
            ],
          },

          // Survivor
          {
            elementId: "84ED3554-AD3E-4C28-B0AE-1A518CB71A0A",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.SURVIVOR,
            avatarIds: [
              "peter", "walter", "nicolas", "liesa", "otto", "katharina", "moritz", "joachim",
              "dieter", "pamela", "jacob", "albin", "thomas",
            ],
            messageLines: [
              "現在の生存者は、少年 ペーター、村長 ヴァルター、旅人 ニコラス、少女 リーザ、パン屋 オットー、羊飼い カタリナ、老人 モーリッツ、青年 ヨアヒム、ならず者 ディーター、村娘 パメラ、農夫 ヤコブ、行商人 アルビン、木こり トーマス の 13 名。",
            ],
          },

          // Talk (wolf)
          {
            elementId: "F720D764-05CC-4CBD-8ECC-69185C59EAE8",
            elementType: StoryElementTypes.TALK,
            talkType: TalkTypes.WOLF,
            avatarId: "liesa",
            xname: "mes1106564465",
            time: millisecondsFromTimePart({ hourPart: 20, minutePart: 1, secondPart: 0, millisecondPart: 0 }),
            talkNo: undefined,
            messageLines: [
              "もぐもぐ",
            ],
          },

          // Talk (grave)
          {
            elementId: "924463B2-A292-4724-8B8C-74F32BC8B89F",
            elementType: StoryElementTypes.TALK,
            talkType: TalkTypes.GRAVE,
            avatarId: "simson",
            xname: "mes1106564466",
            time: millisecondsFromTimePart({ hourPart: 20, minutePart: 8, secondPart: 0, millisecondPart: 0 }),
            talkNo: undefined,
            messageLines: [
              "あぁ、神よ…。貴方は私にかような試練をお与えになるのですね…",
            ],
          },
        ],
      },
      {
        type: PeriodTypes.PROGRESS,
        day: 4,
        elements: [
          // SuddenDeath
          {
            elementId: "2CFE5749-E222-4A49-B45F-A2AF17161FFE",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.SUDDEN_DEATH,
            avatarId: "jacob",
            messageLines: [
              "農夫 ヤコブ は、突然死した。",
            ],
          },

          // Counting (The victim is villager)
          {
            elementId: "876FB844-FC38-4280-8A9E-7EBC598CB677",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.COUNTING,
            victim: "pamela",
            votes: {
              "peter": "pamela",
              "walter": "peter",
              "nicolas": "pamela",
              "liesa": "peter",
              "otto": "peter",
              "katharina": "dieter",
              "moritz": "nicolas",
              "joachim": "jacob",
              "dieter": "thomas",
              "pamela": "jacob",
              "albin": "pamela",
              "thomas": "pamela",
            },
            messageLines: [
              "少年 ペーター は 村娘 パメラ に投票した。",
              "村長 ヴァルター は 少年 ペーター に投票した。",
              "旅人 ニコラス は 村娘 パメラ に投票した。",
              "少女 リーザ は 少年 ペーター に投票した。",
              "パン屋 オットー は 少年 ペーター に投票した。",
              "羊飼い カタリナ は ならず者 ディーター に投票した。",
              "老人 モーリッツ は 旅人 ニコラス に投票した。",
              "青年 ヨアヒム は 農夫 ヤコブ に投票した。",
              "ならず者 ディーター は 木こり トーマス に投票した。",
              "村娘 パメラ は 農夫 ヤコブ に投票した。",
              "行商人 アルビン は 村娘 パメラ に投票した。",
              "木こり トーマス は 村娘 パメラ に投票した。",
              "",
              "村娘 パメラ は村人達の手により処刑された。",
            ],
          },

          // Assault
          {
            elementId: "999B3138-8A03-41C0-9E61-5005ADC91B11",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.EXTRA,
            eventName: EventNames.ASSAULT,
            byWhom: "liesa",
            target: "katharina",
            time: millisecondsFromTimePart({ hourPart: 20, minutePart: 0, secondPart: 0, millisecondPart: 0 }),
            xname: "mes1106564403",
            messageLines: [
              "羊飼い カタリナ ！ 今日がお前の命日だ！",
            ],
          },

          // Guard (GJ)
          {
            elementId: "12FBA65A-91A3-4E08-A748-974F3509A705",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.EXTRA,
            eventName: EventNames.GUARD,
            byWhom: "moritz",
            target: "katharina",
            messageLines: [
              "老人 モーリッツ は、羊飼い カタリナ を守っている。",
            ],
          },

          // NoMurder
          {
            elementId: "466C4739-1131-46CE-9F03-C298C7FD8E10",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.NO_MURDER,
            messageLines: [
              "今日は犠牲者がいないようだ。人狼は襲撃に失敗したのだろうか。",
            ]
          },

          // Survivor
          {
            elementId: "D73B7590-1623-4A5A-91CB-573947513537",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.SURVIVOR,
            avatarIds: [
              "peter", "walter", "nicolas", "liesa", "otto", "katharina", "moritz", "joachim",
              "dieter", "albin", "thomas",
            ],
            messageLines: [
              "現在の生存者は、少年 ペーター、村長 ヴァルター、旅人 ニコラス、少女 リーザ、パン屋 オットー、羊飼い カタリナ、老人 モーリッツ、青年 ヨアヒム、ならず者 ディーター、行商人 アルビン、木こり トーマス の 11 名。",
            ],
          },
        ],
      },
      {
        type: PeriodTypes.PROGRESS,
        day: 5,
        elements: [
          // Counting2
          {
            elementId: "53A31D5B-B687-4C36-895B-C5B24F98E53D",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.EXTRA,
            eventName: EventNames.COUNTING2,
            votes: {
              "peter": "moritz",
              "walter": "peter",
              "nicolas": "moritz",
              "liesa": "peter",
              "otto": "peter",
              "katharina": "dieter",
              "moritz": "nicolas",
              "joachim": "katharina",
              "dieter": "thomas",
              "albin": "moritz",
              "thomas": "peter",
            },
            messageLines: [
              "少年 ペーター は 老人 モーリッツ に投票した。",
              "村長 ヴァルター は 少年 ペーター に投票した。",
              "旅人 ニコラス は 老人 モーリッツ に投票した。",
              "少女 リーザ は 少年 ペーター に投票した。",
              "パン屋 オットー は 少年 ペーター に投票した。",
              "羊飼い カタリナ は ならず者 ディーター に投票した。",
              "老人 モーリッツ は 旅人 ニコラス に投票した。",
              "青年 ヨアヒム は 羊飼い カタリナ に投票した。",
              "ならず者 ディーター は 木こり トーマス に投票した。",
              "行商人 アルビン は 老人 モーリッツ に投票した。",
              "木こり トーマス は 少年 ペーター に投票した。",
            ],
          },

          // Execution
          {
            elementId: "83C058BD-856B-4686-A1D4-9CC076ECA988",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.EXECUTION,
            victim: "peter",
            nominated: {
              "dieter": 1,
              "nicolas": 1,
              "katharina": 1,
              "thomas": 1,
              "moritz": 3,
              "peter": 4,
            },
            messageLines: [
              "ならず者 ディーター、1票。",
              "旅人 ニコラス、1票。",
              "木こり トーマス、1票。",
              "羊飼い カタリナ、1票。",
              "老人 モーリッツ、3票。",
              "少年 ペーター、4票。",
              "",
              "少年 ペーター は村人達の手により処刑された。",
            ],
          },

          // Guard
          {
            elementId: "705B0711-D040-48A4-8960-FC29A5C228C7",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.EXTRA,
            eventName: EventNames.GUARD,
            byWhom: "moritz",
            target: "nicolas",
            messageLines: [
              "老人 モーリッツ は、旅人 ニコラス を守っている。",
            ],
          },

          // NoMurder
          {
            elementId: "B66475CF-CF34-4CCE-940E-683A50F92E21",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.NO_MURDER,
            messageLines: [
              "今日は犠牲者がいないようだ。人狼は襲撃に失敗したのだろうか。",
            ]
          },

          // Survivor
          {
            elementId: "6D83E42C-C8CB-4E6C-9544-B4F3C1E6E058",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.SURVIVOR,
            avatarIds: [
              "walter", "nicolas", "liesa", "otto", "katharina", "moritz", "joachim",
              "dieter", "albin", "thomas",
            ],
            messageLines: [
              "現在の生存者は、村長 ヴァルター、旅人 ニコラス、少女 リーザ、パン屋 オットー、羊飼い カタリナ、老人 モーリッツ、青年 ヨアヒム、ならず者 ディーター、行商人 アルビン、木こり トーマス の 10 名。",
            ],
          },
        ],
      },
      {
        type: PeriodTypes.EPILOGUE,
        day: 6,
        elements: [
          // WinVillage
          {
            elementId: "B8FD5984-D0BA-406C-ACB6-CEBC22663F94",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.WIN_VILLAGE,
            messageLines: [
              "全ての人狼を退治した……。人狼に怯える日々は去ったのだ！",
            ],
          },

          // WinWolf
          {
            elementId: "58A21314-3413-43EF-A401-1BEFDBF2CE0B",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.WIN_WOLF,
            messageLines: [
              "もう人狼に抵抗できるほど村人は残っていない……。",
              "人狼は残った村人を全て食らい、別の獲物を求めてこの村を去っていった。",
            ],
          },

          // WinHamster
          {
            elementId: "E73C0538-5280-4A33-953D-EA0EC99A5C09",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.WIN_HAMSTER,
            messageLines: [
              "全ては終わったかのように見えた。",
              "だが、奴が生き残っていた……。",
            ],
          },

          // PlayerList
          {
            elementId: "E15E7FBA-34D9-444C-AFD9-457415C1F834",
            elementType: StoryElementTypes.STORY_EVENT,
            eventFamily: EventFamilies.ANNOUNCE,
            eventName: EventNames.PLAYER_LIST,
            players: [
              { playerId: "master", avatarId: "gerd", survive: false, role: Roles.INNOCENT },
              { playerId: "p0", avatarId: "peter", survive: false, role: Roles.HAMSTER },
              { playerId: "p1", avatarId: "walter", survive: false, role: Roles.FRATER },
              { playerId: "p2", avatarId: "nicolas", survive: true, role: Roles.SHAMAN },
              { playerId: "p3", avatarId: "liesa", survive: false, role: Roles.WOLF },
              { playerId: "p4", avatarId: "otto", survive: false, role: Roles.SEER },
              { playerId: "p5", avatarId: "katharina", survive: false, role: Roles.INNOCENT },
              { playerId: "p6", avatarId: "moritz", survive: false, role: Roles.HUNTER },
              { playerId: "p7", avatarId: "joachim", survive: true, role: Roles.INNOCENT },
              { playerId: "p8", avatarId: "simson", survive: false, role: Roles.WOLF },
              { playerId: "p9", avatarId: "dieter", survive: false, role: Roles.WOLF },
              { playerId: "p10", avatarId: "pamela", survive: false, role: Roles.INNOCENT },
              { playerId: "p11", avatarId: "jacob", survive: false, role: Roles.INNOCENT },
              { playerId: "p12", avatarId: "albin", survive: true, role: Roles.MADMAN },
              { playerId: "p13", avatarId: "thomas", survive: true, role: Roles.INNOCENT },
              { playerId: "p14", avatarId: "regina", survive: false, role: Roles.FRATER },
            ],
            messageLines: [
              "楽天家 ゲルト （master）、死亡。村人だった。",
              "少年 ペーター （p0）、死亡。ハムスター人間だった。",
              "村長 ヴァルター （p1）、死亡。共有者だった。",
              "旅人 ニコラス （p2）、生存。霊能者だった。",
              "少女 リーザ （p3）、死亡。人狼だった。",
              "パン屋 オットー （p4）、死亡。占い師だった。",
              "羊飼い カタリナ （p5）、死亡。村人だった。",
              "老人 モーリッツ （p6）、死亡。狩人だった。",
              "青年 ヨアヒム （p7）、生存。村人だった。",
              "神父 ジムゾン （p8）、死亡。人狼だった。",
              "ならず者 ディーター （p9）、死亡。人狼だった。",
              "村娘 パメラ （p10）、死亡。村人だった。",
              "農夫 ヤコブ （p11）、死亡。村人だった。",
              "行商人 アルビン （p12）、生存。狂人だった。",
              "木こり トーマス （p13）、生存。村人だった。",
              "宿屋の女主人 レジーナ （p14）、死亡。共有者だった。",
            ],
          }
        ]
      },
    ],
  }

  // Force character to die with gerd
  if (deadAvatarId !== undefined) {
    for (const period of story.periods) {
      for (const element of period.elements) {
        if (element.elementType === StoryElementTypes.STORY_EVENT) {
          if (element.elementId === "3B5E9928-1EAF-4EEA-B143-F6AA7D76D536" && element.eventName === EventNames.MURDERED) {
            // When gerd is murdered, specified character is also murdered
            element.avatarIds.push(deadAvatarId)
          } else if (element.eventName === EventNames.SURVIVOR) {
            // Specified character never survives
            element.avatarIds = element.avatarIds.filter(it => it !== deadAvatarId)
          } else if (element.eventName === EventNames.PLAYER_LIST) {
            // Specified character is reported as dead
            for (const player of element.players) {
              if (player.avatarId === deadAvatarId) {
                player.survive = false
              }
            }
          }
        }
      }
    }
  }
  
  return story
}
