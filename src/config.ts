/**
 * Application configuration interface definitions.
 */
export interface EnvironmentConfig {
	readonly discordToken: string;
	readonly discordAppId: string;
	readonly discordUserId: string;
	readonly rhythiaProfileId: string;
	readonly rhythiaClanId: string;
}

/**
 * Initializes and validates runtime environment configurations.
 * @throws {Error} If mandatory environment configurations are absent or malformed.
 */
export function loadAndValidateConfig(env: unknown): EnvironmentConfig {
	const {
		DISCORD_TOKEN,
		DISCORD_APP_ID,
		DISCORD_USER_ID,
		RHYTHIA_PROFILE_ID,
		RHYTHIA_CLAN_ID,
	} = env as Record<string, string | undefined>;

	if (
		!DISCORD_TOKEN ||
		!DISCORD_APP_ID ||
		!DISCORD_USER_ID ||
		!RHYTHIA_PROFILE_ID ||
		!RHYTHIA_CLAN_ID
	) {
		throw new Error(
			"ConfigurationInitializationException: Missing vital environment variables.",
		);
	}

	return {
		discordToken: DISCORD_TOKEN,
		discordAppId: DISCORD_APP_ID,
		discordUserId: DISCORD_USER_ID,
		rhythiaProfileId: RHYTHIA_PROFILE_ID,
		rhythiaClanId: RHYTHIA_CLAN_ID,
	};
}
