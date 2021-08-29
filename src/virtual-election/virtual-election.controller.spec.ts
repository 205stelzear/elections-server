import { ElectionService } from '$/election/election.service';
import { PrismaService } from '$/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { VirtualElectionController } from './virtual-election.controller';
import { VirtualElectionService } from './virtual-election.service';

describe('VirtualElectionController', () => {
	let controller: VirtualElectionController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [VirtualElectionController],
			providers: [VirtualElectionService, PrismaService, ElectionService],
		}).compile();

		controller = module.get<VirtualElectionController>(VirtualElectionController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
