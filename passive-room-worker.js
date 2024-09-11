"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var worker_threads_1 = require("worker_threads");
worker_threads_1.parentPort.on('message', function (message) {
    var _a;
    var room = message.room;
    // Collect passive actions of all room inhabitants
    var actions = (_a = room === null || room === void 0 ? void 0 : room.mobs) === null || _a === void 0 ? void 0 : _a.map(function (mob) { return mob.passiveActions || []; }).flat();
    setInterval(function () {
        // Randomly decide if we should send a passive action to the parent thread
        if (Math.random() > 0.5) {
            // Randomly select a passive action
            var action = actions[Math.floor(Math.random() * actions.length)];
            worker_threads_1.parentPort.postMessage(action);
        }
    }, 5000);
});
