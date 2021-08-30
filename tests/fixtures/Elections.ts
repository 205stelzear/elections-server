import { CandidateData } from '$/election/dto/election-data.dto';
import { Election, PrismaClient } from '@prisma/client';
import f from 'faker';
import { Fixture, LinkMethod, upsertRange } from 'prisma-fixtures';

export default class ElectionFixture extends Fixture<Election> {
	override dependencies = [];

	override async seed(prisma: PrismaClient, _link: LinkMethod<this>): Promise<Election[]> {
		f.seed(1234567890);

		const candidatesData: CandidateData[] = [
			{
				name: f.name.firstName(),
				selectedState: 'unselected',
				voteCount: 0,
			},
		];

		const elections = await upsertRange(prisma.election.upsert, 5, (index) => {
			return {
				create: {
					code: f.unique(f.random.alphaNumeric, [6]),
					dbName: f.random.words(3),
					numberOfVoters: f.datatype.number({ min: 10, max: 20 }),
					numberOfVotePerVoterMin: f.datatype.number({ min: 1, max: 4 }),
					numberOfVotePerVoterMax: 4,
					candidatesData: candidatesData,
				},
				update: {},
				where: {
					id: index,
				},
			};
		});

		return elections;
	}
}
