import { CreateElectionDto } from '$/election/dto/create-election.dto';
import { VoteCandidatesDto } from '$/election/dto/vote-candidates.dto';
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Patch,
	Post,
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

		const returnValue = await this.virtualElectionService.get(electionCode, isAdmin, { doNotJoin: false, includePhoto: true });

		if (!returnValue) {
			throw new NotFoundException(`No election with code ${electionCode} found!`);
		}

		return returnValue;
	}

	@Patch('vote')
	async vote(@Body() voteCandidatesDto: VoteCandidatesDto, @Query('code') electionCode?: string) {
		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		const election = await this.virtualElectionService.vote(electionCode, voteCandidatesDto);

		if (!election) {
			throw new NotFoundException(`No election with code ${electionCode} found!`);
		}

		return 'Thanks for voting! :)';
	}

	@Get('retrieve')
	async retrieve(@Query() query: Record<string, string | undefined>) {
		const { code: electionCode, groupImage: qGroupImage, ...otherQueries } = query;

		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		const doIncludePhoto = qGroupImage !== undefined;

		const electionRetrievedData = await this.virtualElectionService.retrieve(electionCode, doIncludePhoto, Object.keys(otherQueries));

		if (!electionRetrievedData) {
			throw new NotFoundException(`No election with code ${electionCode} found!`);
		}

		const { code, numberOfVoted, ...retrievedData } = electionRetrievedData;

		return { code, data: retrievedData, voterCount: numberOfVoted };
	}
}
