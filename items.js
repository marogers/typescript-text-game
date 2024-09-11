"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.item_Mug = exports.item_Apple = exports.item_Gloves = exports.item_Hat = exports.WornLocation = void 0;
var WornLocation;
(function (WornLocation) {
    WornLocation["head"] = "head";
    WornLocation["body"] = "body";
    WornLocation["arms"] = "arms";
    WornLocation["hands"] = "hands";
    WornLocation["legs"] = "legs";
    WornLocation["feet"] = "feet";
    WornLocation["back"] = "back";
    WornLocation["waist"] = "waist";
    WornLocation["neck"] = "neck";
    WornLocation["finger1"] = "finger1";
    WornLocation["finger2"] = "finger2";
})(WornLocation || (exports.WornLocation = WornLocation = {}));
exports.item_Hat = {
    name: 'Hat',
    description: 'A simple hat to keep the sun off your face.',
    keywords: ['hat'],
    weight: 0.5,
    value: 1,
    wornLocation: WornLocation.head
};
exports.item_Gloves = {
    name: 'Gloves',
    description: 'A pair of brown leather gloves.',
    keywords: ['gloves', 'leather'],
    weight: 0.5,
    value: 1,
    wornLocation: WornLocation.hands
};
exports.item_Apple = {
    name: 'Apple',
    description: 'A juicy red apple.',
    keywords: ['apple', 'fruit'],
    weight: 0.5,
    value: 1
};
exports.item_Mug = {
    name: 'Mug',
    description: 'A sturdy wooden mug, half-full of ale.',
    keywords: ['mug', 'cup'],
    weight: 1,
    value: 1
};
