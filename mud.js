"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var worker_threads_1 = require("worker_threads");
var readline_1 = require("readline");
var map_1 = require("./map");
var mobs_1 = require("./mobs");
var commands_1 = require("./commands");
var passiveRoomWorker = new worker_threads_1.Worker('./passive-room-worker.js');
passiveRoomWorker.on('message', function (message) {
    console.log(message);
});
passiveRoomWorker.removeAllListeners();
function parseInput(input) {
    return input.toLowerCase().trim().split(' ');
}
function findRoom(map, id) {
    var defaultRoom = {
        id: -1,
        name: 'Unknown Room',
        description: 'This room does not exist',
        exits: [],
        items: [],
        mobs: [],
    };
    return map.rooms.find(function (room) { return room.id === id; }) || defaultRoom;
}
function concatExitNames(exits) {
    return exits.map(function (exit) { return exit.direction; }).join(', ');
}
function printRoom(room) {
    var _a, _b;
    console.log("----".concat(room.name, "----\n").concat(room.description));
    (_a = room.mobs) === null || _a === void 0 ? void 0 : _a.forEach(function (mob) { return console.log("".concat(mob.name, " stands here.")); });
    (_b = room.items) === null || _b === void 0 ? void 0 : _b.forEach(function (item) { return console.log("A ".concat(item.name, " is here.")); });
    console.log("Exits: ".concat(concatExitNames(room.exits)));
}
function processInventory(inventory) {
    // Check if we have items
    if (!inventory || inventory.length === 0) {
        console.log('You are not carrying anything.');
        return;
    }
    console.log('Inventory:');
    inventory.forEach(function (item) { return console.log("- ".concat(item.name)); });
    return;
}
function convertIndexToWord(index) {
    var lastChar = index.toString().slice(-1);
    switch (lastChar) {
        case '1':
            return index.toString() + 'st';
        case '2':
            return index.toString() + 'nd';
        case '3':
            return index.toString() + 'rd';
        default:
            return index.toString() + 'th';
    }
}
function spliceItem(originItems, destinationItems, index, foundItems) {
    var foundIndex = originItems.findIndex(function (x) { return x === foundItems[index - 1]; });
    originItems = originItems.splice(foundIndex, 1);
    destinationItems.push(foundItems[index - 1]);
}
function equipItemFromInventory(player, index, foundItems) {
    if (!player.equipment) {
        player.equipment = {};
    }
    // Equip item
    if (foundItems[index - 1].wornLocation) {
        player.equipment[foundItems[index - 1].wornLocation || ''] = foundItems[index - 1];
    }
    // Remove from inventory
    spliceItem(player.inventory, [], index, foundItems);
}
function transferItem(originItems, destinationItems, searchTerm, index, all) {
    if (index === void 0) { index = 1; }
    if (all === void 0) { all = false; }
    var foundItems = originItems.filter(function (item) { var _a; return item.name.toLowerCase() === searchTerm || ((_a = item.keywords) === null || _a === void 0 ? void 0 : _a.includes(searchTerm)); });
    if (foundItems && foundItems.length > 0) {
        if (all) {
            for (var i = 1; i <= foundItems.length; i++) {
                spliceItem(originItems, destinationItems, i, foundItems);
            }
            return;
        }
        // Check if index is within bounds
        if (index > foundItems.length) {
            console.log("You do not see a ".concat(convertIndexToWord(index), " ").concat(searchTerm, " here."));
            return;
        }
        spliceItem(originItems, destinationItems, index, foundItems);
    }
    else {
        console.log("You do not see a ".concat(searchTerm, " here."));
    }
}
function processLook(parsedInput, room) {
    // LOOk ROOM
    if (parsedInput.length === 1) {
        printRoom(room);
        return;
    }
    // LOOK {TARGET}
    var target = parsedInput[1];
    // LOOK ITEM
    var item = room.items.find(function (item) { return item.name.toLowerCase() === target; });
    if (item) {
        console.log("".concat(item.description));
        return;
    }
    // LOOK MOB
    var mob = room.mobs.find(function (mob) { return mob.keywords.includes(target); });
    if (mob) {
        (0, mobs_1.printMob)(mob);
        return;
    }
    console.log("You do not see a ".concat(target, " here"));
}
function processTake(parsedInput, room, player) {
    if (parsedInput.length === 1) {
        console.log('Take what?');
        return;
    }
    var index = 1;
    var all = false;
    var target = parsedInput[1];
    // Handle taking index or all
    if (parsedInput[1].indexOf('.') > -1) {
        var split = parsedInput[1].split('.');
        target = split[1].toLowerCase();
        if (split[0] === 'all') {
            all = true;
        }
        else {
            // Try to parse index
            index = parseInt(split[0]);
            if (!isNaN(index)) {
                index = Math.max(1, index);
            }
            else {
                console.log("Take what?");
                return;
            }
        }
    }
    // Handle taking from container
    // TODO containers don't exist yet
    transferItem(room.items, player.inventory, target, index, all);
}
function normalizeDirection(direction) {
    if (direction === 'n') {
        return 'north';
    }
    if (direction === 's') {
        return 'south';
    }
    if (direction === 'e') {
        return 'east';
    }
    if (direction === 'w') {
        return 'west';
    }
    return direction;
}
function processMovement(parsedInput, room, player) {
    var direction = normalizeDirection(parsedInput[0]);
    var exit = room.exits.find(function (exit) { return exit.direction == direction; });
    if (direction in map_1.Direction && exit) {
        player.location = exit.room;
        var room_1 = findRoom(map_1.map, exit.room);
        printRoom(room_1);
        return;
    }
    else {
        console.log('You cannot go that way.');
        return;
    }
}
function processQuit(rl) {
    console.log('Goodbye!');
    rl.close();
    process.exit(0);
}
function processDrop(parsedInput, room, player) {
    if (parsedInput.length === 1) {
        console.log('Drop what?');
        return;
    }
    var index = 1;
    var all = false;
    var target = parsedInput[1];
    // Handle dropping index or all
    if (parsedInput[1].indexOf('.') > -1) {
        var split = parsedInput[1].split('.');
        target = split[1].toLowerCase();
        if (split[0] === 'all') {
            all = true;
        }
        else {
            // Try to parse index
            index = parseInt(split[0]);
            if (!isNaN(index)) {
                index = Math.max(1, index);
            }
            else {
                console.log("Drop what?");
                return;
            }
        }
    }
    transferItem(player.inventory, room.items, target, index, all);
}
function processEquip(player) {
    var equipment = 'Equipment:\n';
    if (player.equipment) {
        if (player.equipment.head)
            equipment += "Head: ".concat(player.equipment.head.name, "\n");
        if (player.equipment.body)
            equipment += "Body: ".concat(player.equipment.body.name, "\n");
        if (player.equipment.arms)
            equipment += "Arms: ".concat(player.equipment.arms.name, "\n");
        if (player.equipment.hands)
            equipment += "Hands: ".concat(player.equipment.hands.name, "\n");
        if (player.equipment.legs)
            equipment += "Legs: ".concat(player.equipment.legs.name, "\n");
        if (player.equipment.feet)
            equipment += "Feet: ".concat(player.equipment.feet.name, "\n");
        if (player.equipment.back)
            equipment += "Back: ".concat(player.equipment.back.name, "\n");
        if (player.equipment.waist)
            equipment += "Waist: ".concat(player.equipment.waist.name, "\n");
        if (player.equipment.neck)
            equipment += "Neck: ".concat(player.equipment.neck.name, "\n");
        if (player.equipment.finger1)
            equipment += "Finger: ".concat(player.equipment.finger1.name, "\n");
        if (player.equipment.finger2)
            equipment += "Finger: ".concat(player.equipment.finger2.name, "\n");
        // Trim last newline
        equipment = equipment.slice(0, equipment.length - 1);
        console.log("".concat(equipment));
    }
    else {
        console.log('You have nothing equipped.');
    }
}
function processWear(parsedInput, player) {
    if (parsedInput.length === 1) {
        console.log('Wear what?');
        return;
    }
    var index = 1;
    var all = false;
    var target = parsedInput[1];
    // Handle wearing index or all
    if (parsedInput[1].indexOf('.') > -1) {
        var split = parsedInput[1].split('.');
        target = split[1].toLowerCase();
        if (split[0] === 'all') {
            all = true;
        }
        else {
            // Try to parse index
            index = parseInt(split[0]);
            if (!isNaN(index)) {
                index = Math.max(1, index);
            }
            else {
                console.log("Wear what?");
                return;
            }
        }
    }
    var foundItems = player.inventory.filter(function (item) { var _a; return item.name.toLowerCase() === target || ((_a = item.keywords) === null || _a === void 0 ? void 0 : _a.includes(target)); });
    if (foundItems && foundItems.length > 0) {
        if (all) {
            for (var i = 1; i <= foundItems.length; i++) {
                equipItemFromInventory(player, i, foundItems);
            }
            return;
        }
        // Check if index is within bounds
        if (index > foundItems.length) {
            console.log("You do not have a ".concat(convertIndexToWord(index), " ").concat(target, "."));
            return;
        }
        equipItemFromInventory(player, index, foundItems);
    }
    else {
        console.log("You do not have a ".concat(target, "."));
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var rl, player, room, input, parsedInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rl = (0, readline_1.createInterface)({
                        input: process.stdin,
                        output: process.stdout
                    });
                    player = {
                        name: 'Wayne',
                        location: 1,
                        inventory: []
                    };
                    // Print initial room
                    printRoom(findRoom(map_1.map, player.location));
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    room = findRoom(map_1.map, player.location);
                    // This seems goofy but it works for now..
                    passiveRoomWorker.removeAllListeners();
                    passiveRoomWorker = new worker_threads_1.Worker('./passive-room-worker.js');
                    passiveRoomWorker.on('message', function (message) {
                        console.log(message);
                    });
                    passiveRoomWorker.postMessage({ room: room });
                    return [4 /*yield*/, new Promise(function (resolve) { return rl.question("\n>", resolve); })
                        // Parse and clean input
                    ];
                case 2:
                    input = _a.sent();
                    parsedInput = parseInput(input);
                    // Send to correct command processor
                    switch (parsedInput[0]) {
                        case commands_1.Commands.north:
                        case commands_1.Commands.n:
                        case commands_1.Commands.south:
                        case commands_1.Commands.s:
                        case commands_1.Commands.east:
                        case commands_1.Commands.e:
                        case commands_1.Commands.west:
                        case commands_1.Commands.w:
                            processMovement(parsedInput, room, player);
                            return [3 /*break*/, 1];
                        case commands_1.Commands.look:
                        case commands_1.Commands.l:
                            processLook(parsedInput, room);
                            return [3 /*break*/, 1];
                        case commands_1.Commands.inventory:
                        case commands_1.Commands.inv:
                        case commands_1.Commands.i:
                            processInventory(player.inventory);
                            return [3 /*break*/, 1];
                        case commands_1.Commands.quit:
                        case commands_1.Commands.q:
                            processQuit(rl);
                            break;
                        case commands_1.Commands.take:
                        case commands_1.Commands.t:
                            processTake(parsedInput, room, player);
                            return [3 /*break*/, 1];
                        case commands_1.Commands.drop:
                        case commands_1.Commands.d:
                            processDrop(parsedInput, room, player);
                            return [3 /*break*/, 1];
                        case commands_1.Commands.equip:
                        case commands_1.Commands.eq:
                            processEquip(player);
                            return [3 /*break*/, 1];
                        case commands_1.Commands.wear:
                            processWear(parsedInput, player);
                            return [3 /*break*/, 1];
                        default:
                            break;
                    }
                    // QUIT
                    // if (parsedInput[0] === Commands.quit || parsedInput[0] === Commands.q) {
                    //   break
                    // }
                    console.log('Invalid command');
                    return [3 /*break*/, 1];
                case 3:
                    rl.close();
                    return [2 /*return*/];
            }
        });
    });
}
main();
