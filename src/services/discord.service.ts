import axios from "axios";
import type { EnvironmentConfig } from "../config";
import type { DiscordWidgetPayload } from "../types/discord";
import type { NormalizedClanStats } from "../types/rhythia";

export async function syncUserDiscordWidget(
  discordId: string,
  stats: NormalizedClanStats,
  config: EnvironmentConfig,
): Promise<void> {
  const dynamicData: DiscordWidgetPayload["data"]["dynamic"] = [
    { type: 1, name: "clan_name", value: stats.clan_name },
    { type: 2, name: "clan_trophies", value: stats.clan_trophies },
    { type: 1, name: "clan_rank", value: stats.clan_rank },
    { type: 3, name: "clan_avatar_url", value: { url: stats.clan_avatar_url } },
    { type: 1, name: "user_username", value: `@${stats.user_username}` },
    { type: 1, name: "clan_member_count", value: stats.clan_member_count },
    { type: 2, name: "clan_rp", value: stats.clan_rp },
    { type: 1, name: "user_clan_rank", value: stats.user_clan_rank },
    { type: 1, name: "clan_owner", value: `@${stats.clan_owner}` },
    { type: 1, name: "clan_top_member", value: `@${stats.clan_top_member}` },
  ];

  const payload: DiscordWidgetPayload = {
    username: stats.user_username,
    data: {
      dynamic: dynamicData,
    },
  };

  console.log(
    `[INFO] [${new Date().toISOString()}] Updating Discord widget for ${discordId}`,
  );

  console.log(`[DATA] Clan Stats: ${JSON.stringify(stats, null, 2)}`);

  const url = `https://discord.com/api/v9/applications/${config.discordAppId}/users/${discordId}/identities/0/profile`;

  try {
    const response = await axios.patch(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${config.discordToken}`,
        "User-Agent":
          "DiscordBot (https://github.com/discord/discord-api-docs, 1.0.0)",
      },
    });

    if (![200, 201, 204].includes(response.status)) {
      throw new Error(JSON.stringify(response.data));
    }

    console.log(
      `[INFO] [${new Date().toISOString()}] Discord widget updated successfully for ${discordId}`,
    );
  } catch (error) {
    const details = axios.isAxiosError(error)
      ? JSON.stringify(error.response?.data)
      : String(error);

    throw new Error(`DiscordWidgetMutationException: ${details}`);
  }
}
