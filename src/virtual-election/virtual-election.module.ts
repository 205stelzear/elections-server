import { ElectionService } from '$/election/election.service';
import { Module } from '@nestjs/common';
import { VirtualElectionController } from './virtual-election.controller';
import { VirtualElectionService } from './virtual-election.service';

@Module({
	providers: [VirtualElectionService, ElectionService],
	controllers: [VirtualElectionController],
})
export class VirtualElectionModule {}
