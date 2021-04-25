// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface RemoteTransceiver {
			id: string;
			ipAddress: string;
			token: string;
			remotes: Remote[];
		}
		interface Remote {
			id: string;
			name: string;
			buttons: RemoteButton[];
		}
		interface RemoteButton {
			id: string;
			name: string;
			code: string;
		}
		interface AdapterConfig {
			transceivers: RemoteTransceiver[];
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};