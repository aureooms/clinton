import path from 'path';
import test from 'ava';
import clintonRuleTester from './fixtures/rule-tester';

const opts = {
	cwd: 'test/fixtures/travis',
	rules: {
		'use-travis': 'error',
		travis: 'error'
	}
};

const ruleTester = clintonRuleTester(opts);

test('use travis', async t => {
	await ruleTester(t, 'use-travis',
		[
			{
				ruleId: 'use-travis',
				message: 'Use travis to automatically run your tests.',
				severity: 'error'
			}
		]
	);
});

test('no engine specified', async t => {
	await ruleTester(t, 'no-engine', []);
});

test('unsupported version', async t => {
	const file = path.resolve(opts.cwd, 'unsupported-version/.travis.yml');

	await ruleTester(t, 'unsupported-version',
		[
			{
				message: 'Unsupported version `0.12` is being tested.',
				ruleId: 'travis',
				severity: 'error',
				file
			},
			{
				message: 'Unsupported version `0.10` is being tested.',
				ruleId: 'travis',
				severity: 'error',
				file
			}
		],
		[
			{
				language: 'node_js',
				node_js: [				// eslint-disable-line camelcase
					'6',
					'4',
					'0.10'
				]
			},
			{
				language: 'node_js',
				node_js: [				// eslint-disable-line camelcase
					'6',
					'4',
					'0.12'
				]
			}
		]
	);
});

test('untested versions', async t => {
	const file = path.resolve(opts.cwd, 'untested/.travis.yml');

	await ruleTester(t, 'untested',
		[
			{
				message: 'Supported version `0.10` not being tested.',
				ruleId: 'travis',
				severity: 'error',
				file
			},
			{
				message: 'Supported version `0.12` not being tested.',
				ruleId: 'travis',
				severity: 'error',
				file
			}
		],
		[
			{
				language: 'node_js',
				node_js: [				// eslint-disable-line camelcase
					'6',
					'4',
					'0.10'
				]
			},
			{
				language: 'node_js',
				node_js: [				// eslint-disable-line camelcase
					'6',
					'4',
					'0.12'
				]
			}
		]
	);
});

test('aliases', async t => {
	await ruleTester(t, 'aliases', []);
});

test('deprecated versions', async t => {
	const file = path.resolve(opts.cwd, 'deprecated/.travis.yml');

	await ruleTester(t, 'deprecated',
		[
			{
				message: 'Version `stable` is deprecated.',
				file,
				ruleId: 'travis',
				severity: 'error'
			},
			{
				message: 'Version `unstable` is deprecated.',
				file,
				ruleId: 'travis',
				severity: 'error'
			},
			{
				message: 'Version `iojs` is deprecated.',
				file,
				ruleId: 'travis',
				severity: 'error'
			}
		]
	);
});

test('language not set to `node_js`', async t => {
	await ruleTester(t, 'php',
		[
			{
				message: 'Language is not set to `node_js`.',
				file: path.resolve(opts.cwd, 'php/.travis.yml'),
				ruleId: 'travis',
				severity: 'error'
			}
		]
	);
});

test('no versions specified', async t => {
	await ruleTester(t, 'no-versions',
		[
			{
				message: 'No Node.js versions specified.',
				file: path.resolve(opts.cwd, 'no-versions/.travis.yml'),
				ruleId: 'travis',
				severity: 'error'
			}
		]
	);
});

test('testing matrix', async t => {
	const file = path.resolve(opts.cwd, 'matrix-include/.travis.yml');

	await ruleTester(t, 'matrix-include',
		[
			{
				message: 'Supported version `0.12` not being tested.',
				ruleId: 'travis',
				severity: 'error',
				file
			}
		],
		[
			{
				language: 'node_js',
				node_js: [				// eslint-disable-line camelcase
					'6',
					'0.12'
				],
				matrix: {
					include: [
						{
							node_js: '4'	// eslint-disable-line camelcase
						}
					]
				}
			}
		]
	);
});
