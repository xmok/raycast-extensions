type UserTodo = {
    date: number;
    value: number;
}
type UserExp = UserTodo;
export type User = {
        auth: {
            local: {
                username: string;
                lowerCaseUsername: string;
                email: string;
                has_password: boolean;
            }
            timestamps: {
                loggedin: string;
                created: string;
                updated: string;
            }
            // facebook: {},
            // google: {},
            // apple: {}
        }
        achievements: {
            ultimateGearSets: {
                warrior: boolean;
                rogue: boolean;
                wizard: boolean;
                healer: boolean;
            },
            habitBirthdays: number;
            perfect: number;
            quests: {
                bewilder: number;
                dysheartener: number;
            }
            // "challenges": [],
            habiticaDays: number;
            completedTask: boolean;
            createdTask: boolean;
            hatchedPet: boolean;
            streak: number;
        }
        // backer: {},
        // contributor: {},
        // permissions: {},
        purchased: {
            plan: {
                consecutive: {
                    trinkets: number;
                    gemCapExtra: number;
                    offset: number;
                    count: number;
                },
                // mysteryItems: [],
                gemsBought: number;
                extraMonths: number;
                dateUpdated: string;
                perkMonthCount: number;
                quantity: number;
            }
            txnCount: number;
            background: {
                violet: boolean;
                blue: boolean;
                green: boolean;
                purple: boolean;
                red: boolean;
                yellow: boolean;
            }
            // "shirt": {},
            // "hair": {},
            // "skin": {},
            ads: boolean;
        }
        "flags": {
      "tour": {
        "equipment": number;
        "hall": number;
        "mounts": number;
        "pets": number;
        "market": number;
        "challenges": number;
        "guilds": number;
        "party": number;
        "tavern": number;
        "stats": number;
        "classes": number;
        "intro": number;
        "groupPlans": number;
      },
      "tutorial": {
        "common": {
          "items": boolean;
          "equipment": boolean;
          "tavern": boolean;
          "classes": boolean;
          "skills": boolean;
          "gems": boolean;
          "pets": boolean;
          "party": boolean;
          "rewards": boolean;
          "todos": boolean;
          "dailies": boolean;
          "habits": boolean;
          "inbox": boolean;
          "mounts": boolean;
          "stats": boolean;
        },
        "ios": {
          "inviteParty": boolean;
          "groupPets": boolean;
          "filterTask": boolean;
          "deleteTask": boolean;
          "editTask": boolean;
          "addTask": boolean;
          "reorderTask": boolean;
        }
      },
        "warnedLowHealth": boolean;
        "cardReceived": boolean;
        "armoireEmpty": boolean;
        "armoireOpened": boolean;
        "armoireEnabled": boolean;
        "welcomed": boolean;
        "cronCount": number;
        "communityGuidelinesAccepted": boolean;
        "lastWeeklyRecap": string;
        "weeklyRecapEmailsPhase": number;
        "recaptureEmailsPhase": number;
        // "levelDrops": {},
        "rebirthEnabled": boolean;
        "classSelected": boolean;
        "rewrite": boolean;
        "newStuff": boolean;
        "itemsEnabled": boolean;
        "dropsEnabled": boolean;
        "showTour": boolean;
        "customizationsNotification": boolean;
        "lastNewStuffRead": string;
        "verifiedUsername": boolean;
        "thirdPartyTools": string;
        }
        history: {
            todos: UserTodo[];
            exp: UserExp[];
        }
        items: {
            "gear": {
        "equipped": {
          "shield": "shield_base_0",
          "head": "head_base_0",
          "armor": "armor_base_0"
        },
        "costume": {
          "shield": "shield_base_0",
          "head": "head_base_0",
          "armor": "armor_base_0"
        },
        "owned": {
          "head_special_nye": false,
          "armor_special_birthday": false,
          "eyewear_special_yellowTopFrame": true,
          "eyewear_special_whiteTopFrame": true,
          "eyewear_special_redTopFrame": true,
          "eyewear_special_pinkTopFrame": true,
          "eyewear_special_greenTopFrame": true,
          "eyewear_special_blueTopFrame": true,
          "eyewear_special_blackTopFrame": true,
          "head_special_nye2014": false,
          "armor_special_birthday2015": false,
          "head_special_nye2015": false,
          "armor_special_birthday2016": false,
          "armor_special_bardRobes": true,
          "head_special_namingDay2017": false,
          "head_special_nye2016": false,
          "armor_special_birthday2017": false,
          "head_special_piDay": false,
          "shield_special_piDay": false,
          "eyewear_special_blackHalfMoon": true,
          "eyewear_special_blueHalfMoon": true,
          "eyewear_special_greenHalfMoon": true,
          "eyewear_special_pinkHalfMoon": true,
          "eyewear_special_redHalfMoon": true,
          "eyewear_special_whiteHalfMoon": true,
          "eyewear_special_yellowHalfMoon": true,
          "body_special_namingDay2018": false,
          "head_special_nye2017": false,
          "armor_special_birthday2018": false,
          "back_special_namingDay2020": false,
          "armor_special_turkeyArmorBase": false,
          "back_special_turkeyTailBase": false,
          "head_special_turkeyHelmBase": false,
          "head_special_nye2018": false,
          "armor_special_birthday2019": false,
          "armor_special_turkeyArmorGilded": false,
          "back_special_turkeyTailGilded": false,
          "head_special_turkeyHelmGilded": false,
          "head_special_nye2019": false,
          "armor_special_birthday2020": false,
          "head_special_nye2020": false
        }
      },
      "special": {
        "birthdayReceived": [],
        "birthday": 0,
        "thankyouReceived": [],
        "thankyou": 0,
        "greetingReceived": [],
        "greeting": 0,
        "nyeReceived": [],
        "nye": 0,
        "valentineReceived": [],
        "valentine": 0,
        "seafoam": 0,
        "shinySeed": 0,
        "spookySparkles": 0,
        "snowball": 0,
        "congratsReceived": [],
        "getwellReceived": [],
        "goodluckReceived": [],
        "congrats": 0,
        "getwell": 0,
        "goodluck": 0
      },
      "lastDrop": {
        "count": 0,
        "date": "2015-12-21T17:58:28.164Z"
      }
      quests: {
        [key: string]: 1;
      }
      mounts: {
        [key: string]: true;
      }
      food: {
        [key: string]: number;
      }
    //   "hatchingPotions": {},
    //   "eggs": {},
    pets: {
        [key: string]: number;
    }
    "currentMount": string;
      "currentPet": string;
        }
        "invitations": {
      "party": {},
      "guilds": [],
      "parties": []
    }
    "party": {
      "quest": {
        "progress": {
          "up": 0,
          "down": 0,
          "collectedItems": 0,
          "collect": {}
        },
        "RSVPNeeded": false,
        "completed": ""
      },
      "order": "level",
      "orderAscending": "ascending"
    }
    
  }
  export type UserNotification = {
    type: string;
      data: {
        icon: string;
        title: string;
        text: string;
        destination: string;
      },
      seen: boolean;
      id: string;
  }
  // userV: number;

type Event = {
  event: string;
  npcImageSuffix: string;
  season: string;
  gear: boolean;
  start: string;
  end: string;
}
export type WorldState = {
  npcImageSuffix: string;
  currentEvent: Event;
  // "worldBoss": {},
  currentEventList: Event[];
}

export type ErrorResponse = {
    success: false;
    error: string;
    message: string;
}
export type SuccessResponse<T> = {
  success: true;
  appVersion: string;
  data: T;
}
// export type SuccessResponse<T, U=undefined> = U extends undefined ?
// {
//     success: true;
//     appVersion: string;
//     data: T;
// } :
// {
//     success: true;
//     appVersion: string;
//     data: T;
// }
//  & U;