import test from 'ava';
import m from '../';
import utils from './fixtures/utils';

const opts = {
	cwd: 'fixtures/xo',
	inherit: false
};

const inherit = utils.assign(opts);

test('no XO dependency', async t => {
	t.deepEqual(await m('no-dependency', opts), [
		{
			name: 'xo',
			severity: 'error',
			message: 'XO is not installed as devDependency.'
		}
	]);
});

test('wrong version', async t => {
	t.deepEqual(await m('.', inherit({rules: {xo: ['error', '0.15.2']}})), [
		{
			name: 'xo',
			severity: 'error',
			message: 'Expected version \'0.15.2\' but found \'0.15.1\'.'
		}
	]);

	t.deepEqual(await m('.', inherit({rules: {xo: ['error', '0.16.0']}})), [
		{
			name: 'xo',
			severity: 'error',
			message: 'Expected version \'0.16.0\' but found \'0.15.1\'.'
		}
	]);
});

test('unicorn version', async t => {
	t.is((await m('unicorn', inherit({rules: {xo: ['error', '*']}}))).length, 0);

	t.deepEqual(await m('.', inherit({rules: {xo: ['error', '*']}})), [
		{
			name: 'xo',
			severity: 'error',
			message: 'Expected unicorn version \'*\' but found \'0.15.1\'.'
		}
	]);
});

test('test script', async t => {
	t.deepEqual(await m('no-script', opts), [
		{
			name: 'xo',
			severity: 'error',
			message: 'XO is not used in the test script.'
		}
	]);
});

test('cli config', async t => {
	t.deepEqual(await m('cli-config', opts), [
		{
			name: 'xo',
			severity: 'error',
			message: 'Specify XO config in `package.json` instead of passing it through via the CLI.'
		}
	]);
});