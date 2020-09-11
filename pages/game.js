export const gameLevels = [
  // FIRST SCREEN - HOME
  {
    id: 1,
    name: 'BEDROOM',
    story:
      'You are in your bedroom. There is a computer on the desk and a pile of books on your bedside table. There is a door out onto the hallyway to the EAST.',
    east: 10001,
    collectors: [],
    inspections: [
      {
        item: 'COMPUTER',
        story:
          "The computer is on but it's currently installing updates so you can't use it.",
        result: {}
      },

      {
        item: 'BOOKS',
        story:
          'A varied selection: Ready Player One by Ernest Cline, Lord of the Flies by William Golding and a text book on Linguistics. A KEY falls out of the text book.',
        result: { collectors: ['KEY'] }
      }
    ],
    actions: []
  },

  /* HOUSE */
  // Hallway
  {
    id: 10001,
    name: 'UPSTAIRS HALLWAY',
    story:
      'You are in the hallway, outside your bedroom which is to your WEST. The decor is a bit old, you should probably consider painting sometime. To your NORTH are the stairs down. SOUTH is the spare room.',
    north: 10000,
    south: 10002,
    west: 1,
    collectors: []
  },
  // Spare Room
  {
    id: 10002,
    name: 'SPARE ROOM',
    story:
      'You are in the spare room. There is not much in here except for piles of washing and an old single bed - just incase of guests. You can return NORTH back to the hallway. To the WEST is the loft hatch.',
    west:
      "You try the loft hatch but it is locked. You don't remember where the key is.",
    north: 10001,
    collectors: [],
    actions: [
      {
        item: 'KEY',
        story:
          'You use the key and the loft hatch opens. Your path WEST has opened.',
        result: {
          west: 10003
        }
      }
    ]
  },
  // Loft
  {
    id: 10003,
    name: 'LOFT',
    story:
      'You climb up into the loft. It is very dusty and dark. There is a pile of old boxes in the corner and a really ancient looking television to the side. You can go EAST back down the loft ladder.',
    east: 10002,
    inspections: [
      {
        item: 'BOXES',
        story:
          'These boxes look to be filled with old papers and newspapers. You notice there is a TORCH at the bottom of one.',
        result: { collectors: ['TORCH'] }
      },
      {
        item: 'TELEVISION',
        story:
          "The television looks to be a really old black and white set from the early 1990s. You don't recall where this came from but it probably doesn't work anymore",
        result: {}
      }
    ],
    collectors: [],
    actions: []
  }
]
