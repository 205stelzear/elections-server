import { Prisma } from '.prisma/client';
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class ShortCandidateData {
	@IsString()
	name!: string;
	@IsIn(['selected', 'pre-selected', 'unselected'])
	selectedState!: 'selected' | 'pre-selected' | 'unselected';

	[key: string]: Prisma.JsonValue;
}

export class CandidateData extends ShortCandidateData {
	@IsNumber()
	voteCount!: number;
}

export class ElectionDataBaseDto {
	@IsString()
	dbName!: string;

	@IsOptional()
	@IsString()
	dbPsw?: string;

	@IsNumber()
	numberOfVoters!: number;

	@IsNumber()
	numberOfVotePerVoterMin!: number;

	@IsNumber()
	numberOfVotePerVoterMax!: number;

	@IsOptional()
	@IsBoolean()
	allowMultipleSameCandidate = false;

	@IsOptional()
	@IsNumber()
	numberOfVoted = 0;

	@IsOptional()
	@IsNumber()
	numberOfSeatsTaken = 0;

	@IsOptional()
	@IsBoolean()
	hasSkipped = false;

	@IsOptional()
	@IsBoolean()
	isDownloadDisabled = false;

	@IsOptional()
	@IsString()
	groupImage?: string;
}

export class ElectionDataDto extends ElectionDataBaseDto {
	candidates!: CandidateData[];
}
