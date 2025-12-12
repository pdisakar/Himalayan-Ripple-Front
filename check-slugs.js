const http = require('http');

function checkUrl(path) {
    return new Promise((resolve) => {
        const req = http.get({ hostname: 'localhost', port: 3001, path }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                console.log(`\nChecking ${path}: Status ${res.statusCode}`);
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode === 200) {
                        if (json.place) {
                            console.log('Place Found:', { id: json.place.id, slug: json.place.slug, status: json.place.status, deletedAt: json.place.deletedAt });
                        } else {
                            console.log('Data found (raw):', json);
                        }
                    } else {
                         console.log('Error:', json.message);
                    }
                } catch(e) { console.log('Raw body:', data.substring(0, 100)); }
                resolve();
            });
        });
        req.on('error', e => { console.error(path, e.message); resolve(); });
    });
}

async function run() {
    console.log('Checking specific slug: manaslu-region');
    await checkUrl('/api/places/slug/manaslu-region');
    await checkUrl('/api/packages/manaslu-region');
    await checkUrl('/api/all-slugs'); 
}

run();
