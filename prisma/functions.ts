import { exec as execNoPromise } from 'child_process';
import path from 'path';
import { ImportFixtureOptions, importFixtures } from 'prisma-fixtures';
import util from 'util';

const exec = util.promisify(execNoPromise);

// Prisma Utils

const prismaBinary = path.join(__dirname, '..', 'node_modules', '.bin', 'prisma');

export async function generate() {
	return exec(`${prismaBinary} generate`);
}

export async function seedDb() {
	return exec(`${prismaBinary} db seed`);
}

export type PushDbOptions = {
	skipGenerators: boolean;
	acceptDataLoss: boolean;
	forceReset: boolean;
};

export async function pushDb(options?: Partial<PushDbOptions>) {
	const mapping: Record<keyof PushDbOptions, string> = {
		skipGenerators: '--skip-generate',
		acceptDataLoss: '--accept-data-loss',
		forceReset: '--force-reset',
	};

	const entries = Object.entries(mapping) as Array<[keyof PushDbOptions, string]>;

	const optionsString = entries.reduce((acc, [key, option]) => {
		if (options?.[key]) {
			return `${acc} ${option}`;
		}

		return acc;
	}, '');

	return exec(`${prismaBinary} db push${optionsString}`);
}

export async function prepareTestDb(options?: Partial<ImportFixtureOptions>) {
	// Run the migrations to ensure our schema has the required structure
	await pushDb({ skipGenerators: true, acceptDataLoss: true, forceReset: true });

	const testArgs: Partial<ImportFixtureOptions> = {
		...{
			fixturesPath: './tests/fixtures',
		},
		...options,
	};

	return seed(testArgs);
}

export async function seed(options?: Partial<ImportFixtureOptions>) {
	const importOptions: Partial<ImportFixtureOptions> = {
		...{
			prisma: options?.prisma ?? (await getPrismaClient()),
		},
		...options,
	};

	return importFixtures(importOptions);
}

export async function getPrismaClient() {
	try {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const { PrismaClient } = await import('../../src/_generated/prisma/client/index');

		return new PrismaClient();
	} catch (error) {
		throw new Error(`An error happened while getting the Prisma Client. Did you run a generate command?`);
	}
}
