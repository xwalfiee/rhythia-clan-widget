import axios from "axios";
import type { EnvironmentConfig } from "../config";
import type {
	NormalizedClanStats,
	RhythiaClanResponse,
	RhythiaClansResponse,
	RhythiaClanUser,
} from "../types/rhythia";

const RHYTHIA_API_BASE_URL = "https://production.rhythia.com";
const LEADERBOARD_ITEMS_PER_PAGE = 25;

async function fetchClanPage(
	clanId: number,
	memberPage: number,
): Promise<RhythiaClanResponse> {
	const res = await axios.post<RhythiaClanResponse>(
		`${RHYTHIA_API_BASE_URL}/api/getClan`,
		{ id: clanId, session: "", memberPage, scorePage: 1 },
	);

	if (res.data.error) {
		throw new Error(res.data.error);
	}

	return res.data;
}

async function fetchAllClanMembers(
	clanId: number,
): Promise<{ clan: RhythiaClanResponse; users: RhythiaClanUser[] }> {
	const firstPage = await fetchClanPage(clanId, 1);
	const users = [...firstPage.users];

	for (let page = 2; page <= firstPage.memberTotalPages; page += 1) {
		const next = await fetchClanPage(clanId, page);
		users.push(...next.users);
	}

	return { clan: firstPage, users };
}

async function fetchClanLeaderboardRank(clanId: number): Promise<number> {
	let page = 1;
	let totalPages = 1;

	do {
		const res = await axios.post<RhythiaClansResponse>(
			`${RHYTHIA_API_BASE_URL}/api/getClans`,
			{ page },
		);

		if (res.data.error) {
			throw new Error(res.data.error);
		}

		totalPages = res.data.totalPages;

		const index = res.data.clanData.findIndex((clan) => clan.id === clanId);
		if (index !== -1) {
			return (page - 1) * LEADERBOARD_ITEMS_PER_PAGE + index + 1;
		}

		page += 1;
	} while (page <= totalPages);

	throw new Error(
		"RhythiaDataRetrievalException: Clan not found in leaderboard.",
	);
}

export async function fetchClanStatistics(
	config: EnvironmentConfig,
): Promise<NormalizedClanStats> {
	try {
		const clanId = Number(config.rhythiaClanId);
		const profileId = Number(config.rhythiaProfileId);

		if (!Number.isInteger(clanId) || clanId < 0) {
			throw new Error("Invalid Rhythia clan id.");
		}
		if (!Number.isInteger(profileId) || profileId < 0) {
			throw new Error("Invalid Rhythia profile id.");
		}

		const [{ clan, users }, rank] = await Promise.all([
			fetchAllClanMembers(clanId),
			fetchClanLeaderboardRank(clanId),
		]);

		const sortedByRp = [...users].sort(
			(a, b) => (b.skill_points ?? 0) - (a.skill_points ?? 0),
		);

		const userIndex = sortedByRp.findIndex((user) => user.id === profileId);
		if (userIndex === -1) {
			throw new Error("User not found in clan.");
		}

		const owner = users.find((user) => user.id === clan.owner);
		if (!owner) {
			throw new Error("Clan owner not found among members.");
		}

		const topMember = sortedByRp[0];

		return {
			user_username:
				sortedByRp[userIndex].username ?? `user${sortedByRp[userIndex].id}`,
			user_clan_rank: `#${userIndex + 1}`,

			clan_name: `[${clan.acronym}] ${clan.name}`,
			clan_avatar_url: clan.avatar_url,
			clan_trophies: clan.stats.trophyCount,
			clan_rank: `#${rank}`,
			clan_member_count: `${clan.memberTotal}/${clan.stats.memberLimit}`,
			clan_rp: clan.stats.totalRp,
			clan_owner: owner.username ?? `user${owner.id}`,
			clan_top_member: topMember.username ?? `user${topMember.id}`,
		};
	} catch (error) {
		const details =
			axios.isAxiosError(error) && error.response?.data
				? JSON.stringify(error.response.data)
				: error instanceof Error
					? error.message
					: String(error);

		throw new Error(`RhythiaDataRetrievalException: ${details}`);
	}
}
