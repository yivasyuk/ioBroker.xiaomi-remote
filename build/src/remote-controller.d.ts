export interface LearnResult {
    key: string;
    code: string;
}
export declare class RemoteController {
    private ipAddress;
    private token;
    private readonly frequency;
    private readonly device;
    private readIntervalId;
    constructor(ipAddress: string, token: string);
    unload(): void;
    learn(key: string): Promise<LearnResult>;
    play(code: string): Promise<void>;
}
