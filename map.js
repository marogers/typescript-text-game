"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = exports.Direction = void 0;
var items_1 = require("./items");
var mobs_1 = require("./mobs");
var Direction;
(function (Direction) {
    Direction["north"] = "north";
    Direction["south"] = "south";
    Direction["east"] = "east";
    Direction["west"] = "west";
})(Direction || (exports.Direction = Direction = {}));
exports.map = {
    rooms: [
        {
            id: 1,
            name: 'The Tavern',
            description: 'A warm and inviting tavern with a roaring fire in the hearth. The barkeep is busy cleaning glasses behind the bar.',
            exits: [
                {
                    direction: Direction.north,
                    room: 2
                }
            ],
            items: [items_1.item_Mug, items_1.item_Hat, items_1.item_Hat, items_1.item_Gloves],
            mobs: [mobs_1.Barkeep]
        },
        {
            id: 2,
            name: 'Town Square',
            description: 'The town square is bustling with activity. Merchants hawk their wares and children play in the fountain.',
            exits: [
                {
                    direction: Direction.west,
                    room: 3
                },
                {
                    direction: Direction.south,
                    room: 1
                }
            ],
            items: [items_1.item_Apple],
            mobs: [mobs_1.Merchant]
        },
        {
            id: 3,
            name: 'The Blacksmith',
            description: 'The blacksmith\'s forge is roaring and the air is thick with the smell of hot metal.',
            exits: [
                {
                    direction: Direction.east,
                    room: 2
                }
            ],
            items: [],
            mobs: [mobs_1.Blacksmith]
        }
    ]
};
