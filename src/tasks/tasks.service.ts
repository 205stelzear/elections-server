import { PrismaService } from '$/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
	private readonly logger = new Logger(TasksService.name);

	constructor(private prisma: PrismaService) {}

	@Cron('0 */30 * * * *')
	async cleanDatabase() {
		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		const msToYesterday = 24 * 60 * 60 * 1000;

		const yesterdayDate = new Date(new Date().getTime() - msToYesterday);

		try {
			const results = await this.prisma.election.deleteMany({
				where: {
					lastUsed: {
						lt: yesterdayDate,
					},
				},
			});

			return results;
		} catch (error) {
			this.logger.error(error);
		}
	}
}
