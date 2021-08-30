import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ShortCandidateData } from './election-data.dto';

export class UpdateCandidateDto {
	@ValidateNested()
	@Type(() => ShortCandidateData)
	data!: ShortCandidateData;
}
