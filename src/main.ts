import { RemoteController, LearnResult } from './remote-controller'
import * as utils from '@iobroker/adapter-core';

class XiaomiRemote extends utils.Adapter {
	private remoteController: RemoteController = <RemoteController>{};
	
	public constructor(options: Partial<utils.AdapterOptions> = {}) {

		super({
			...options,
			name: 'xiaomi-remote',
		});
		this.on('ready', this.onReady.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		// this.on('objectChange', this.onObjectChange.bind(this));
		this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		this.remoteController = new RemoteController('192.168.1.81', '07d2065c8ed662c8ed9ac36cbb6d0a6b');
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			this.remoteController?.unload();
			callback();
		} catch (e) {
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
	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	private async onMessage(obj: ioBroker.Message): Promise<void> {
		if (typeof obj === 'object' && obj.message) {
			switch(obj.command) {
				case 'learn':
					const key: any = (obj.message as Record<string, any>).key;
					this.log.info(`command: learn. data: key=${key}`);
					const result: LearnResult = await this.remoteController.learn(key);
					this.sendTo(obj.from, obj.command, result, obj.callback);
					break;
				case 'play':
					const code: any = (obj.message as Record<string, any>).code;
					this.log.info(`command: play. data: code=${code}`);
					await this.remoteController.play(code);
					break;
				case 'createObjects':
					break;
				case 'log':
					this.log.info(obj.message as string);
					break;
			}
		}
	}

	private async createObjects(transceivers: ioBroker.RemoteTransceiver[]) {
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new XiaomiRemote(options);
} else {
	// otherwise start the instance directly
	(() => new XiaomiRemote())();
}