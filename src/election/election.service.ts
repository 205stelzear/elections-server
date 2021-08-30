import { PrismaService } from '$/prisma.service';
import { ElectionType } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateElectionDto } from './dto/create-election.dto';
import { CandidateData, ShortCandidateData } from './dto/election-data.dto';
import { VoteCandidatesDto } from './dto/vote-candidates.dto';

function keyIsInObject<T>(key: string | number | symbol, object: T): key is keyof T {
	return key in object;
}

export type GetElectionOptions = {
	/** Prevents incrementing the number_of_joined number. */
	doNotJoin: boolean;
	/** Adds the photo to the request. */
	includePhoto: boolean;
};

@Injectable()
export class ElectionService {
	static readonly CODE_LENGTH = 6;

	constructor(private readonly prisma: PrismaService) {}

	createCode(length: number) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
		const charactersLength = characters.length;

		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;
	}

	async create(createElectionDto: CreateElectionDto, electionType?: ElectionType) {
		const { candidates, groupImage: photoData, ...restElectionData } = createElectionDto;

		const electionCandidates = candidates.map(
			(candidate): CandidateData => ({
				name: candidate,
				voteCount: 0,
				selectedState: 'unselected',
			}),
		);

		let failedMaxAttempt = 3;

		for (let attempt = 0; attempt < failedMaxAttempt; attempt++) {
			const code = this.createCode(ElectionService.CODE_LENGTH);

			try {
				const election = await this.prisma.election.create({
					data: {
						code: code,
						type: electionType,
						candidatesData: electionCandidates,
						photo: !photoData
							? undefined
							: {
									create: {
										data: photoData,
									},
									// eslint-disable-next-line no-mixed-spaces-and-tabs
							  },
						...restElectionData,
					},
					include: {
						photo: {},
					},
				});

				const { photo, ...electionData } = election;

				return { election: electionData, photo };
			} catch (error) {
				// an election already exist with created code, trying again (not db error)
				failedMaxAttempt += 1;
			}
		}

		throw 'Could not create election!';
	}

	async incrementJoinCount(code: string) {
		return this.prisma.election.update({
			where: {
				code,
			},
			data: {
				numberOfJoined: {
					increment: 1,
				},
			},
		});
	}

	async get(code: string, options?: Partial<GetElectionOptions>) {
		const election = await this.prisma.election.findUnique({
			where: {
				code,
			},
			include: {
				photo: options?.includePhoto,
			},
		});

		if (election && options?.doNotJoin) {
			await this.incrementJoinCount(election.code);
		}

		return election;
	}

	async vote(code: string, voteCandidatesDto: VoteCandidatesDto) {
		const election = await this.prisma.election.findUnique({
			where: {
				code,
			},
		});

		if (!election) {
			return null;
		}

		const candidatesData = election.candidatesData as CandidateData[];

		voteCandidatesDto.candidates.forEach((candidate) => candidatesData[candidate].voteCount++);

		const properElectionData = await this.prisma.election.update({
			data: {
				candidatesData: candidatesData,
			},
			where: {
				code: election.code,
			},
		});

		return properElectionData;
	}

	async takeSeat(code: string) {
		const election = await this.prisma.election.findUnique({
			where: {
				code,
			},
		});

		if (!election) {
			return null;
		}

		return await this.prisma.election.update({
			data: {
				numberOfSeatsTaken: {
					increment: 1,
				},
			},
			where: {
				code,
			},
		});
	}

	async skip(code: string) {
		const election = await this.prisma.election.findUnique({
			where: {
				code,
			},
		});

		if (!election) {
			return null;
		}

		return await this.prisma.election.update({
			data: {
				hasSkipped: true,
			},
			where: {
				code,
			},
		});
	}

	async retrieve(code: string, doIncludePhoto: boolean, specifyers?: string[]) {
		const election = await this.prisma.election.findUnique({
			where: {
				code,
			},
			include: {
				photo: doIncludePhoto,
			},
		});

		if (!election) {
			return null;
		}

		if (specifyers?.length) {
			const specifiedData: Record<string, unknown> = {};

			specifyers.forEach((specifier) => {
				if (keyIsInObject(specifier, election)) {
					specifiedData[specifier] = election[specifier];
				}
			});

			if (doIncludePhoto) {
				specifiedData.photo = election.photo;
			}

			specifiedData.code = election.code;

			return specifiedData as {
				code: string;
				[key: string]: unknown;
			};
		}

		return election;
	}

	async updateCandidateState(code: string, candidateData: ShortCandidateData) {
		const election = await this.prisma.election.findUnique({
			where: {
				code,
			},
		});

		if (!election) {
			return null;
		}

		const candidatesData = election.candidatesData as CandidateData[];

		const candidate = candidatesData.find((candidate) => candidate.name == candidateData.name);

		if (!candidate) {
			return `Candidate ${candidateData.name} does not exist in election with code ${election.code}.`;
		}

		candidate.selectedState = candidateData.selectedState;

		const properElectionData = await this.prisma.election.update({
			data: {
				candidatesData: candidatesData,
			},
			where: {
				code: election.code,
			},
		});

		return properElectionData;
	}

	async delete(code: string) {
		try {
			const election = await this.prisma.election.delete({
				where: {
					code,
				},
			});

			return election;
		} catch (error) {
			return null;
		}
	}
}
