import { IsString } from 'class-validator';
import { ElectionDataBaseDto } from './election-data.dto';

export class CreateElectionDto extends ElectionDataBaseDto {
	@IsString({ each: true })
	candidates!: string[];
}
