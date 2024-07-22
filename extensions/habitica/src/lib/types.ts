type UserTodo = {
    date: number;
    value: number;
}
type UserExp = UserTodo;

type UserInvitation = {
  id: string;
  name: string;
  inviter: string;
}

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
            facebook: {
              [key: string]: unknown;
            };
            google: {
              [key: string]: unknown;
            };
            apple: {
              [key: string]: unknown;
            };
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
                [quest: string]: 1;
            }
            challenges: unknown[];
            habiticaDays: number;
            completedTask: boolean;
            createdTask: boolean;
            hatchedPet: boolean;
            streak: number;
        }
        backer: Record<string, never> | {
          tier: number;
          npc: string;
          tokensApplied: boolean;
        }
        contributor: Record<string, never> | {
          level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
          admin: boolean;
          text: string;
          contributions: string;
          critical: string;
        }
        permissions: Record<string, never> | {
          full: boolean;
          news: boolean;
          user: boolean;
          challenge: boolean;
          moderator: boolean;
          coupons: boolean;
        }
        purchased: {
            plan: {
                consecutive: {
                    trinkets: number;
                    gemCapExtra: number;
                    offset: number;
                    count: number;
                },
                mysteryItems: unknown[];
                gemsBought: number;
                extraMonths: number;
                dateUpdated: string;
                perkMonthCount: number;
                quantity: number;
            }
            txnCount: number;
            background: {
              [background: string]: true;
            }
            shirt: {
              [shirt: string]: true;
            }
            hair: {
              [hair: string]: true;
            }
            skin: {
              [skin: string]: true;
            }
            ads: boolean;
        }
        flags: {
      tour: {
        equipment: number;
        hall: number;
        mounts: number;
        pets: number;
        market: number;
        challenges: number;
        guilds: number;
        party: number;
        tavern: number;
        stats: number;
        classes: number;
        intro: number;
        groupPlans: number;
      },
      tutorial: {
        common: {
          items: boolean;
          equipment: boolean;
          tavern: boolean;
          classes: boolean;
          skills: boolean;
          gems: boolean;
          pets: boolean;
          party: boolean;
          rewards: boolean;
          todos: boolean;
          dailies: boolean;
          habits: boolean;
          inbox: boolean;
          mounts: boolean;
          stats: boolean;
        },
        ios: {
          inviteParty: boolean;
          groupPets: boolean;
          filterTask: boolean;
          deleteTask: boolean;
          editTask: boolean;
          addTask: boolean;
          reorderTask: boolean;
        }
      },
        warnedLowHealth: boolean;
        cardReceived: boolean;
        armoireEmpty: boolean;
        armoireOpened: boolean;
        armoireEnabled: boolean;
        welcomed: boolean;
        cronCount: number;
        communityGuidelinesAccepted: boolean;
        lastWeeklyRecap: string;
        weeklyRecapEmailsPhase: number;
        recaptureEmailsPhase: number;
        levelDrops: Record<string, never> | unknown;
        rebirthEnabled: boolean;
        classSelected: boolean;
        rewrite: boolean;
        // newStuff: boolean;
        itemsEnabled: boolean;
        dropsEnabled: boolean;
        showTour: boolean;
        customizationsNotification: boolean;
        lastNewStuffRead: string;
        verifiedUsername: boolean;
        thirdPartyTools: string;
        }
        history: {
            todos: UserTodo[];
            exp: UserExp[];
        }
        items: {
            gear: {
        equipped: {
          shield: string;
          head: string;
          armor: string;
          weapon?: string;
          back?: string;
          headAccessory?: string;
          eyewear?: string;
          body?: string;
        },
        costume: {
          shield: string;
          head: string;
          armor: string;
          weapon?: string;
          back?: string;
          headAccessory?: string;
          eyewear?: string;
          body?: string;
        },
        owned: {
          [item: string]: boolean;
        }
      },
      special: {
        birthdayReceived: unknown[];
        birthday: number;
        thankyouReceived: unknown[];
        thankyou: number;
        greetingReceived: unknown[];
        greeting: number;
        nyeReceived: unknown[];
        nye: number;
        valentineReceived: unknown[];
        valentine: number;
        seafoam: number;
        shinySeed: number;
        spookySparkles: number;
        snowball: number;
        congratsReceived: unknown[];
        getwellReceived: unknown[];
        goodluckReceived: unknown[];
        congrats: number;
        getwell: number;
        goodluck: number;
      }
      lastDrop: {
        count: number;
        date: string;
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
      hatchingPotions: {
        [potion: string]: number;
      }
      eggs: {
        [egg: string]: number;
      }
    pets: {
        [pet: string]: number;
    }
    currentMount: string;
      currentPet: string;
        }
        invitations: {
      party: UserInvitation[];
      guilds: Array<UserInvitation & {
        publicGuild: boolean;
      }>;
      parties: Array<UserInvitation & {
        cancelledPlan: boolean;
      }>
    }
    party: {
      quest: {
        progress: {
          up: number;
          down: number;
          collectedItems: number;
          collect: Record<string, never> | unknown;
        },
        RSVPNeeded: boolean;
        completed: string;
      },
      order: string;
      orderAscending: string;
    }
    
  }
  export type UserNotification = {
    type: string;
      data: {
        icon?: string;
        title: string;
        text?: string;
        destination?: string;
      },
      seen: boolean;
      id: string;
  }

export type UserTask = {
  _id: string;
  text: string;
  notes: string;
  tags: unknown[];
  value: number;
  priority: number;
  attribute: string;
  reminders: Array<{
    startDate: string;
    time: string;
    id: string
  }>;
  userId: string;
  _legacyId: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  byHabitica: boolean;
  // "challenge": {},
  //     "group": {
  //       "completedBy": {},
  //       "assignedUsers": []
  //     },
} & (
  {
    type: "habit";
    history: Array<{
      date: number;
      value: number;
      scoredUp: number;
      scoredDown: number;
    }>;
    up: boolean;
    down: boolean;
    counterDown: number;
    counterUp: number;
    frequency: string;
  } | {
    type: "daily";
    repeat: {
      su: boolean;
      s: boolean;
      f: boolean;
      th: boolean;
      w: boolean;
      t: boolean;
      m: boolean;
    }
    completed: boolean;
    collapseChecklist: boolean;
    checklist: Array<{
      id: string;
      text: string;
      completed: boolean;
    }>;
    history: Array<{
      date: number;
      value: number;
      isDue?: boolean;
      complete?: boolean;
    }>;
    frequency: string;
    everyX: number;
    startDate: string;
    streak: number;
    yesterDaily: boolean;
      daysOfMonth: unknown[];
      isDue: boolean;
    nextDue: string[];
    weeksOfMonth: unknown[];
  }
)

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