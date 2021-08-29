import { PrismaService } from '$/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ElectionService } from './election.service';

describe('ElectionService', () => {
	let service: ElectionService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ElectionService, PrismaService],
		}).compile();

		service = module.get<ElectionService>(ElectionService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
