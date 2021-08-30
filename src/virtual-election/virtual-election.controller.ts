import { CreateElectionDto } from '$/election/dto/create-election.dto';
import { BadRequestException, Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
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
	async join(@Query('code') electionCode?: string) {
		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		// TODO : Implement
	}

	@Put('vote')
	async vote(@Query('code') electionCode?: string) {
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
}
