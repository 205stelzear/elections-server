import { IsNumber } from 'class-validator';

export class VoteCandidatesDto {
	@IsNumber(undefined, { each: true })
	candidates!: number[];
}
