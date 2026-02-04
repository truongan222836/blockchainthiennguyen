async function check() {
    try {
        const res = await fetch('http://localhost:5000/api/campaigns');
        const data = await res.json();
        data.data.forEach(c => {
            console.log(`ID: ${c.id}`);
            console.log(`Title: ${c.title}`);
            console.log(`Image: '${c.image}'`);
            console.log('---');
        });
    } catch (e) {
        console.error(e);
    }
}
check();
