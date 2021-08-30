import { CreateElectionDto } from '$/election/dto/create-election.dto';
import { CandidateData } from '$/election/dto/election-data.dto';
import { ElectionService, GetElectionOptions } from '$/election/election.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VirtualElectionService {
	constructor(private electionService: ElectionService) {}

	async create(createElectionDto: CreateElectionDto) {
		return this.electionService.create(createElectionDto, 'virtual');
	}

	async get(code: string, isAdmin: boolean, options?: Partial<GetElectionOptions>) {
		const election = await this.electionService.get(code, options);

		if (!election) {
			return null;
		}

		if (!isAdmin) {
			const candidatesData = election.candidatesData as CandidateData[];

			election.candidatesData = candidatesData.map((data) => ({
				name: data.name,
			}));
		}

		const isElectionFinished = election.numberOfVoted == election.numberOfVoters;

		const returnedData = !isElectionFinished || isAdmin ? election : null;

		return { code: election.code, isElectionFinished, data: returnedData };
	}
}
