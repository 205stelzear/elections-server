import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from './config.module';
import { ElectionModule } from './election/election.module';
import { TasksModule } from './tasks/tasks.module';
import { VirtualElectionModule } from './virtual-election/virtual-election.module';

@Module({
	imports: [ConfigModule, ElectionModule, VirtualElectionModule, ScheduleModule.forRoot(), TasksModule],
	providers: [],
})
export class AppModule {}
