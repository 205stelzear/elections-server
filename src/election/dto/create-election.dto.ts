export class CreateElectionDto {
	dbName!: string;

	dbPsw?: string;

	numberOfVoters!: number;

	numberOfVotePerVoterMin!: number;

	numberOfVotePerVoterMax!: number;

	allowMultipleSameCandidate = false;

	numberOfVoted = 0;

	numberOfSeatsTaken = 0;

	hasSkipped = false;

	isDownloadDisabled = false;

	candidates!: string[];

	groupImage?: string;

	sharedElectionCode?: string;
}
