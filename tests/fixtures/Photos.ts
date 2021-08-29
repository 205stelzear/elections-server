import { Photo, PrismaClient } from '@prisma/client';
import f from 'faker';
import { Fixture, LinkMethod, upsertMany } from 'prisma-fixtures';
import ElectionFixture from './Elections';

export default class PhotoFixture extends Fixture<Photo> {
	override dependencies = [ElectionFixture];

	override async seed(prisma: PrismaClient, link: LinkMethod<this>): Promise<Photo[]> {
		f.seed(1234567890);

		const photos = await upsertMany(prisma.photo.upsert, {
			create: {
				data: f.image.dataUri(),
				election: {
					connect: {
						id: link(ElectionFixture, 0).id,
					},
				},
			},
			update: {},
			where: {
				id: 1,
			},
		});

		return photos;
	}
}
