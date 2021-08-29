import { ElectionService } from '$/election/election.service';
import { PrismaService } from '$/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { VirtualElectionService } from './virtual-election.service';

describe('VirtualElectionService', () => {
	let service: VirtualElectionService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [VirtualElectionService, ElectionService, PrismaService],
		}).compile();

		service = module.get<VirtualElectionService>(VirtualElectionService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
