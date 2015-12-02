'use strict';
module.exports = repository => {
	if (repository._tree.indexOf('LICENSE') === -1 && repository._tree.indexOf('license') === -1) {
		return Promise.reject({
			name: 'license',
			severity: 'warn',
			message: 'Make sure to add a `license` to your project'
		});
	}
};
