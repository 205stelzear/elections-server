import { CreateElectionDto } from '$/election/dto/create-election.dto';
import { VoteCandidatesDto } from '$/election/dto/vote-candidates.dto';
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { VirtualElectionService } from './virtual-election.service';

@Controller('virtual')
export class VirtualElectionController {
	constructor(private virtualElectionService: VirtualElectionService) {}

	@Post('create')
	async create(@Body() createElectionDto: CreateElectionDto) {
		try {
			const { election } = await this.virtualElectionService.create(createElectionDto);

			const { code, ...electionData } = election;

			return { code, data: electionData };
		} catch (error) {
			throw new InternalServerErrorException('An error while creating the election happened, please try again.');
		}
	}

	@Get('join')
	async join(@Query('code') electionCode?: string, @Query('admin') qAdmin?: '') {
		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		const isAdmin = qAdmin !== undefined;

		const election = await this.virtualElectionService.get(electionCode, isAdmin, { doNotJoin: false, includePhoto: true });

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

		const election = await this.virtualElectionService.vote(electionCode, voteCandidatesDto);

		if (!election) {
			throw new NotFoundException(`No election with code ${electionCode} found!`);
		}

		return { data: election };
	}

	@Get('retrieve')
	async retrieve(@Query('code') electionCode?: string) {
		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		// TODO : Implement
	}
}
