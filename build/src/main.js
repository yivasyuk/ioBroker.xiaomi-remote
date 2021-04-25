"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const remote_controller_1 = require("./remote-controller");
const utils = __importStar(require("@iobroker/adapter-core"));
class XiaomiRemote extends utils.Adapter {
    constructor(options = {}) {
        super({
            ...options,
            name: 'xiaomi-remote',
        });
        this.remoteController = {};
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        // this.on('objectChange', this.onObjectChange.bind(this));
        this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        this.remoteController = new remote_controller_1.RemoteController('192.168.1.81', '07d2065c8ed662c8ed9ac36cbb6d0a6b');
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    onUnload(callback) {
        var _a;
        try {
            (_a = this.remoteController) === null || _a === void 0 ? void 0 : _a.unload();
            callback();
        }
        catch (e) {
            callback();
        }
    }
    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  */
    // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
    // 	if (obj) {
    // 		// The object was changed
    // 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    // 	} else {
    // 		// The object was deleted
    // 		this.log.info(`object ${id} deleted`);
    // 	}
    // }
    /**
     * Is called if a subscribed state changes
     */
    onStateChange(id, state) {
        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        }
        else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }
    async onMessage(obj) {
        if (typeof obj === 'object' && obj.message) {
            switch (obj.command) {
                case 'learn':
                    const key = obj.message.key;
                    this.log.info(`command: learn. data: key=${key}`);
                    const result = await this.remoteController.learn(key);
                    this.sendTo(obj.from, obj.command, result, obj.callback);
                    break;
                case 'play':
                    const code = obj.message.code;
                    this.log.info(`command: play. data: code=${code}`);
                    await this.remoteController.play(code);
                    break;
                case 'createObjects':
                    break;
                case 'log':
                    this.log.info(obj.message);
                    break;
            }
        }
    }
    async createObjects(transceivers) {
    }
}
if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options) => new XiaomiRemote(options);
}
else {
    // otherwise start the instance directly
    (() => new XiaomiRemote())();
}
