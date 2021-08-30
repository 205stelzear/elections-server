import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export type CandidateData = {
	name: string;
	voteCount: number;
	selectedState: 'selected' | 'pre-selected' | 'unselected';
};

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
