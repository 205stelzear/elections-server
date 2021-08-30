import { PrismaService } from '$/prisma.service';
import { Election, ElectionType, Photo, Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateElectionDto } from './dto/create-election.dto';
import { ElectionDataDto } from './dto/election-data.dto';
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
		const photoData = createElectionDto.groupImage;

		const { candidates, ...restElectionData } = createElectionDto;

		// Do not include groupImage in election's data to reduce json size
		delete restElectionData.groupImage;

		const electionData: ElectionDataDto = {
			...restElectionData,
			candidates: candidates.map((c) => ({
				name: c,
				voteCount: 0,
				selectedState: 'selected',
			})),
		};

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
							data: electionData as unknown as Prisma.JsonObject,
							type: electionType,
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
				numbeOfJoined: {
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

		const electionData = election.data as unknown as ElectionDataDto;

		voteCandidatesDto.candidates.forEach((candidate) => electionData.candidates[candidate].voteCount++);

		const properElectionData = await this.prisma.election.update({
			data: {
				data: electionData as unknown as Prisma.JsonObject,
			},
			where: {
				code: election.code,
			},
		});

		return properElectionData;
	}
}
