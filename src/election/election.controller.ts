import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Post, Put, Query } from '@nestjs/common';
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

		const { code, ...electionData } = election;

		return { code, data: electionData };
	}

	// /:electionCode([A-NP-Z1-9]{6})
	@Get('join')
	async join(@Query('code') electionCode?: string) {
		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		const election = await this.electionService.get(electionCode, { doNotJoin: false, includePhoto: true });

		if (!election) {
			throw new NotFoundException(`No election with code ${electionCode} found!`);
		}

		return election;
	}

	@Put('vote')
	async vote(@Body() voteCandidatesDto: VoteCandidatesDto, @Query('code') electionCode?: string) {
		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		const election = await this.electionService.vote(electionCode, voteCandidatesDto);

		if (!election) {
			throw new NotFoundException(`No election with code ${electionCode} found!`);
		}

		return { data: election };
	}

	@Get('seat')
	async takeSeat(@Query('code') electionCode?: string) {
		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		const election = await this.electionService.takeSeat(electionCode);

		if (!election) {
			throw new NotFoundException(`No election with code ${electionCode} found!`);
		}

		return { data: election };
	}

	@Put('skip')
	async skip(@Query('code') electionCode?: string) {
		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		// TODO : Implement
	}

	@Get('retrieve')
	async retrieve(@Query('code') electionCode?: string) {
		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		// TODO : Implement
	}

	@Put('update-candidate')
	async updateCandidateState(@Query('code') electionCode?: string) {
		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		// TODO : Implement
	}

	@Delete('delete')
	async delete(@Query('code') electionCode?: string) {
		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		// TODO : Implement
	}
}
