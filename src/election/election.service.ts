import { PrismaService } from '$/prisma.service';
import { Election, ElectionType, Photo } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateElectionDto } from './dto/create-election.dto';
import { CandidateData } from './dto/election-data.dto';
import { VoteCandidatesDto } from './dto/vote-candidates.dto';

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
				selectedState: 'selected',
			}),
		);

		const [election, photo] = await this.prisma.$transaction(async (prisma) => {
			let success = false;

			let election: Election;
			let photo: Photo | undefined = undefined;

			do {
				const code = this.createCode(ElectionService.CODE_LENGTH);

				try {
					election = await prisma.election.create({
						data: {
							code: code,
							type: electionType,
							candidatesData: electionCandidates,
							...restElectionData,
						},
					});

					success = true;
				} catch (error) {
					// an election already exist with created code, trying again
				}
			} while (!success);

			if (photoData) {
				photo = await prisma.photo.create({
					data: {
						data: photoData,
						election: {
							connect: {
								id: election!.id,
							},
						},
					},
				});
			}

			return [election!, photo];
		});

		return { election, photo };
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
}
