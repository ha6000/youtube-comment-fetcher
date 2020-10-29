const config = require('./config.json');

const fs = require('fs');
const Path = require('path');

const Youtube = require('youtube-api');

Youtube.authenticate({
	type: 'key',
	key: config.youtubeKey
});

function fetchComments(videoID, pageToken) {
	return Youtube.commentThreads.list({
		videoId: videoID,
		pageToken,
		part: 'snippet',
		order: 'time',
		maxResults: 100
	})
		.then(res => res.data);
}

async function fetchAllComments(videoID) {
	let allComments = [];
	let comments = [];
	let pageToken;

	do {
		let response = await fetchComments(videoID, pageToken);

		pageToken = response.nextPageToken;
		comments = response.items;

		allComments.push(...comments);
	}
	while (pageToken);

	return allComments;
};

function authorName(comment) {
	return comment.snippet.topLevelComment.snippet.authorDisplayName;
}

fetchAllComments(config.videoID).then(comments => {
	fs.writeFileSync(Path.join(__dirname, './comments.json'), JSON.stringify(comments, null, '	'));
});