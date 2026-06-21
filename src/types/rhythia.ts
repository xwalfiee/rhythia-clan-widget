export interface RhythiaClanUser {
	readonly id: number;
	readonly uid: string | null;
	readonly about_me: string | null;
	readonly username: string | null;
	readonly computedUsername: string | null;
	readonly badges: string[] | null;
	readonly flag: string | null;
	readonly verified: boolean | null;
	readonly created_at: number | null;
	readonly skill_points: number | null;
	readonly play_count: number | null;
	readonly squares_hit: number | null;
	readonly total_score: number | null;
	readonly avatar_url: string | null;
	readonly profile_image: string | null;
	readonly ban: string | null;
	readonly bannedAt: number | null;
	readonly mu_rank: number | null;
	readonly sigma_rank: number | null;
	readonly spin_skill_points: number | null;
	readonly clan: number | null;
}

export interface RhythiaClanStats {
	readonly totalMembers: number;
	readonly totalRp: number;
	readonly averageRpPerMember: number;
	readonly lastActivity: string;
	readonly memberLimit: number;
	readonly friendedBy: number;
	readonly rivaledBy: number;
	readonly trophyCount: number;
}

export interface RhythiaClanResponse {
	readonly error?: string;
	readonly id: number;
	readonly name: string;
	readonly acronym: string;
	readonly avatar_url: string;
	readonly description: string;
	readonly created_at: string;
	readonly owner: number;
	readonly memberPage: number;
	readonly memberTotal: number;
	readonly memberTotalPages: number;
	readonly pageSize: number;
	readonly stats: RhythiaClanStats;
	readonly users: RhythiaClanUser[];
}

export interface RhythiaClanLeaderboardEntry {
	readonly id: number;
	readonly name: string;
	readonly acronym: string | null;
	readonly avatar_url: string | null;
	readonly description: string | null;
	readonly member_count: number;
	readonly total_skill_points: number;
	readonly trophy_count: number;
	readonly total_pages: number;
}

export interface RhythiaClansResponse {
	readonly clanData: RhythiaClanLeaderboardEntry[];
	readonly totalPages: number;
	readonly viewPerPage: number;
	readonly error?: string;
}

export interface NormalizedClanStats {
	readonly user_username: string;
	readonly user_clan_rank: string;

	readonly clan_name: string;
	readonly clan_avatar_url: string;
	readonly clan_trophies: number;
	readonly clan_rank: string;
	readonly clan_member_count: string;
	readonly clan_rp: number;
	readonly clan_owner: string;
	readonly clan_top_member: string;
}
