export type DiscordDynamicValue = string | number | { url: string };

export interface DiscordDynamicField {
	readonly type: number;
	readonly name: string;
	readonly value: DiscordDynamicValue;
}

export interface DiscordWidgetPayload {
	readonly username: string;
	readonly data: {
		readonly dynamic: DiscordDynamicField[];
	};
}
