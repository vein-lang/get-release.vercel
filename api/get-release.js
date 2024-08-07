const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

module.exports = async (req, res) => {
    const options = {
        hostname: 'api.github.com',
        path: `/repos/vein-lang/vein/releases/latest`,
        method: 'GET',
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            'User-Agent': 'Vercel-Function',
            Accept: 'application/vnd.github.v3+json'
        }
    };

    const request = https.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            if (response.statusCode === 200) {
                try {
                    const releaseInfo = JSON.parse(data);
                    res.status(200).json(releaseInfo);
                } catch (error) {
                    res.status(500).json({ error: 'Failed to parse response from GitHub API' });
                }
            } else {
                res.status(response.statusCode).json({ error: `GitHub API error: ${response.statusCode} - ${data}` });
            }
        });
    });

    request.on('error', (error) => {
        res.status(500).json({ error: error.message || 'Something went wrong' });
    });
    request.end();
};
