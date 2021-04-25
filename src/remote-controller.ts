const miio = require('miio');

export interface LearnResult {
	key: string,
	code: string
}

export class RemoteController {
	private readonly frequency: number = 38400;
    private readonly device: any;
	private readIntervalId!: NodeJS.Timeout;

    constructor(private ipAddress: string, private token: string) {
        this.device = miio.createDevice({
            address: this.ipAddress,
            token: this.token,
            model: 'chuangmi.ir.v2'
        });
    }

	public unload(): void {
		if (this.readIntervalId) {
			clearInterval(this.readIntervalId);
		}
	}

    public async learn(key: string): Promise<LearnResult> {
		return new Promise(async (resolve, reject) => {
			const readTimeout = 10000;
			const payLoad: object = {
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
			catch(err) {
				reject(err);
			}

			setTimeout(() => {
				clearInterval(this.readIntervalId);
				reject();
			}, readTimeout);
		});
    }

	public async play(code: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.device.call('miIO.ir_play',
					{
						freq: this.frequency,
						code: code
					});
				resolve();

			}
			catch(err) {
				reject(err);
			}
		});
    }
}