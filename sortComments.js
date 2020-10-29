const comments = require('./comments.json');

const sorted = comments.map(c => c.snippet.topLevelComment.snippet.authorDisplayName).sort((a, b) => {
	if (a < b) {
		return -1;
	}
	if (a > b) {
		return 1;
	}
	return 0;
});

const fs = require('fs');

fs.writeFileSync('./sorted.json', JSON.stringify(sorted, null, '	'));