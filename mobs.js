"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blacksmith = exports.Merchant = exports.Barkeep = void 0;
exports.printMob = printMob;
var items_1 = require("./items");
function printMob(mob) {
    var equipment = '\n';
    if (mob.equipment) {
        if (mob.equipment.head)
            equipment += "Head: ".concat(mob.equipment.head.name, "\n");
        if (mob.equipment.body)
            equipment += "Body: ".concat(mob.equipment.body.name, "\n");
        if (mob.equipment.arms)
            equipment += "Arms: ".concat(mob.equipment.arms.name, "\n");
        if (mob.equipment.hands)
            equipment += "Hands: ".concat(mob.equipment.hands.name, "\n");
        if (mob.equipment.legs)
            equipment += "Legs: ".concat(mob.equipment.legs.name, "\n");
        if (mob.equipment.feet)
            equipment += "Feet: ".concat(mob.equipment.feet.name, "\n");
        if (mob.equipment.back)
            equipment += "Back: ".concat(mob.equipment.back.name, "\n");
        if (mob.equipment.waist)
            equipment += "Waist: ".concat(mob.equipment.waist.name, "\n");
        if (mob.equipment.neck)
            equipment += "Neck: ".concat(mob.equipment.neck.name, "\n");
        if (mob.equipment.finger1)
            equipment += "Finger: ".concat(mob.equipment.finger1.name, "\n");
        if (mob.equipment.finger2)
            equipment += "Finger: ".concat(mob.equipment.finger2.name, "\n");
        // Trim last newline
        equipment = equipment.slice(0, equipment.length - 1);
    }
    console.log("".concat(mob.name, "\n").concat(mob.description).concat(equipment));
}
exports.Barkeep = {
    name: 'Barkeep',
    description: 'A burly man with a bushy beard, wiping down the bar.',
    keywords: ['barkeep', 'man', 'burly'],
    inventory: [],
    equipment: {},
    passiveActions: ['The barkeep polishes a glass.'],
    sentinel: true,
};
exports.Merchant = {
    name: 'Merchant',
    description: 'A merchant with a cart full of goods, hawking his wares.',
    keywords: ['merchant', 'man'],
    inventory: [],
    equipment: { head: items_1.item_Hat },
    passiveActions: ['The merchant carefully takes inventory of his products.'],
    sentinel: true,
};
exports.Blacksmith = {
    name: 'Blacksmith',
    description: 'Rugged and muscular, the blacksmith is hard at work at the forge.',
    keywords: ['blacksmith', 'man', 'smith'],
    inventory: [],
    equipment: {},
    passiveActions: [
        'The blacksmith hammers away at a piece of metal.',
        'The blacksmith wipes sweat from his brow.',
        'The blacksmith fans the flames of the forge.'
    ],
    sentinel: true,
};
