import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
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
		try {
			const { election } = await this.electionService.create(createElectionDto);

			const { code, ...electionData } = election;

			return { code, data: electionData };
		} catch (error) {
			throw new InternalServerErrorException('An error while creating the election happened, please try again.');
		}
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

		const election = await this.electionService.skip(electionCode);

		if (!election) {
			throw new NotFoundException(`No election with code ${electionCode} found!`);
		}

		return { data: election };
	}

	@Get('retrieve')
	async retrieve(@Query() query: Record<string, string | undefined>) {
		const { code: electionCode, groupImage: qGroupImage, ...otherQueries } = query;

		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		const doIncludePhoto = qGroupImage !== undefined;

		const electionRetrievedData = await this.electionService.retrieve(electionCode, doIncludePhoto, Object.keys(otherQueries));

		if (!electionRetrievedData) {
			throw new NotFoundException(`No election with code ${electionCode} found!`);
		}

		const { code, ...retrievedData } = electionRetrievedData;

		return { code, data: retrievedData };
	}

	@Post('update-candidate')
	async updateCandidateState(@Body() updateCandidateDto: UpdateCandidateDto, @Query('code') electionCode?: string) {
		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		const election = await this.electionService.updateCandidateState(electionCode, updateCandidateDto.data);

		if (typeof election == 'string') {
			// election variable is not an election, it is an error message
			throw new BadRequestException(election);
		}
		if (!election) {
			throw new NotFoundException(`No election with code ${electionCode} found!`);
		}

		return { data: election };
	}

	@Delete('delete')
	async delete(@Query('code') electionCode?: string) {
		if (!electionCode) {
			throw new BadRequestException('The "code" query parameter is required!');
		}

		const election = await this.electionService.delete(electionCode);

		if (!election) {
			throw new NotFoundException(`No election with code ${electionCode} found!`);
		}

		return { data: election };
	}
}
