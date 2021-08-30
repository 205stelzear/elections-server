import { PrismaService } from '$/prisma.service';
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Module({
	providers: [TasksService, PrismaService],
})
export class TasksModule {}
