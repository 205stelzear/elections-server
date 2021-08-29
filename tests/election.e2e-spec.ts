import { ElectionModule } from '$/election/election.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { prepareTestDb } from '../prisma/functions';

beforeAll(async () => {
	await prepareTestDb();
});

describe('ElectionController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [ElectionModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it('/ (GET)', () => {
		return supertest(app.getHttpServer()).get('/').expect(200).expect('This is the Scouts Elections API!');
	});
});
