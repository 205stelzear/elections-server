import { PrismaService } from '$/prisma.service';
import { Module } from '@nestjs/common';
import { ElectionController } from './election.controller';
import { ElectionService } from './election.service';

@Module({
	controllers: [ElectionController],
	providers: [ElectionService, PrismaService],
})
export class ElectionModule {}
