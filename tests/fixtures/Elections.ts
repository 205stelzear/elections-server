import { Election, PrismaClient } from '@prisma/client';
import f from 'faker';
import { Fixture, LinkMethod, upsertRange } from 'prisma-fixtures';

export default class ElectionFixture extends Fixture<Election> {
	override dependencies = [];

	override async seed(prisma: PrismaClient, _link: LinkMethod<this>): Promise<Election[]> {
		f.seed(1234567890);

		const elections = await upsertRange(prisma.election.upsert, 5, (index) => {
			return {
				create: {
					code: f.unique(f.random.alphaNumeric, [6]),
					data: '',
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
