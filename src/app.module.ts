import { Module } from '@nestjs/common';
import { ConfigModule } from './config.module';
import { ElectionModule } from './election/election.module';
import { VirtualElectionModule } from './virtual-election/virtual-election.module';

@Module({
	imports: [ConfigModule, ElectionModule, VirtualElectionModule],
	providers: [],
})
export class AppModule {}
