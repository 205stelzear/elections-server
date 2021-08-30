import { CreateElectionDto } from '$/election/dto/create-election.dto';
import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { VirtualElectionService } from './virtual-election.service';

@Controller('virtual')
export class VirtualElectionController {
	constructor(private virtualElectionService: VirtualElectionService) {}

	@Post('create')
	async create(@Body() createElectionDto: CreateElectionDto) {
		const { election } = await this.virtualElectionService.create(createElectionDto);

		// Do not include groupImage in election's data to reduce json size
		delete createElectionDto.groupImage;

		return { code: election.code, data: createElectionDto as Omit<CreateElectionDto, 'groupImage'> };
	}

	@Get('join')
	async join(@Query('code') _electionCode?: string) {
		// TODO : Implement
	}

	@Put('vote')
	async vote(@Query('code') _electionCode?: string) {
		// TODO : Implement
	}

	@Get('retrieve')
	async retrieve(@Query('code') _electionCode?: string) {
		// TODO : Implement
	}
}
