import { CreateElectionDto } from '$/election/dto/create-election.dto';
import { ElectionService } from '$/election/election.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VirtualElectionService {
	constructor(private electionService: ElectionService) {}

	async create(createElectionDto: CreateElectionDto) {
		return this.electionService.create(createElectionDto, 'virtual');
	}
}
