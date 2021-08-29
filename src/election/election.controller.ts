import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { CreateElectionDto } from './dto/create-election.dto';
import { VoteCandidatesDto } from './dto/vote-candidates.dto';
import { ElectionService } from './election.service';

@Controller()
export class ElectionController {
	constructor(private electionService: ElectionService) {}

	@Get()
	status() {
		return 'This is the Scouts Elections API!';
	}

	@Post('create')
	async create(@Body() createElectionDto: CreateElectionDto) {
		const { election } = await this.electionService.create(createElectionDto);

		// Do not include groupImage in election's data to reduce json size
		delete createElectionDto.groupImage;

		return { code: election.code, data: createElectionDto as Omit<CreateElectionDto, 'groupImage'> };
	}

	// /:electionCode([A-NP-Z1-9]{6})
	@Get('join')
	async join(@Query('code') electionCode: string) {
		const election = await this.electionService.get(electionCode, { doNotJoin: false, includePhoto: true });

		if (!election) {
			throw `No election with code ${electionCode} found!`;
		}

		return election;
	}

	@Put('vote')
	async vote(@Body() voteCandidatesDto: VoteCandidatesDto, @Query('code') electionCode: string) {
		const election = await this.electionService.vote(electionCode, voteCandidatesDto);

		if (!election) {
			throw `No election with code ${electionCode} found!`;
		}
	}

	@Get('seat')
	async takeSeat(@Query('code') _electionCode: string) {
		// TODO : Implement
	}

	@Put('skip')
	async skip(@Query('code') _electionCode: string) {
		// TODO : Implement
	}

	@Get('retrieve')
	async retrieve(@Query('code') _electionCode: string) {
		// TODO : Implement
	}

	@Put('update-candidate')
	async updateCandidateState(@Query('code') _electionCode: string) {
		// TODO : Implement
	}

	@Delete('delete')
	async delete(@Query('code') _electionCode: string) {
		// TODO : Implement
	}
}
