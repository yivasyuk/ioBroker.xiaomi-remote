"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteController = void 0;
const miio = require('miio');
class RemoteController {
    constructor(ipAddress, token) {
        this.ipAddress = ipAddress;
        this.token = token;
        this.frequency = 38400;
        this.device = miio.createDevice({
            address: this.ipAddress,
            token: this.token,
            model: 'chuangmi.ir.v2'
        });
    }
    unload() {
        if (this.readIntervalId) {
            clearInterval(this.readIntervalId);
        }
    }
    async learn(key) {
        return new Promise(async (resolve, reject) => {
            const readTimeout = 10000;
            const payLoad = {
                freq: this.frequency,
                key: key
            };
            try {
                await this.device.call('miIO.ir_learn', payLoad);
                this.readIntervalId = setInterval(async () => {
                    const result = await this.device.call('miIO.ir_read', payLoad);
                    if (result.code) {
                        resolve({
                            key: key,
                            code: result.code
                        });
                        clearInterval(this.readIntervalId);
                    }
                }, 100);
            }
            catch (err) {
                reject(err);
            }
            setTimeout(() => {
                clearInterval(this.readIntervalId);
                reject();
            }, readTimeout);
        });
    }
    async play(code) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.device.call('miIO.ir_play', {
                    freq: this.frequency,
                    code: code
                });
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
exports.RemoteController = RemoteController;
