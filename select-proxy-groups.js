async function main() {
    try {
        // 获取当前配置状态
        const configResponse = await $httpClient.get('http://localhost:9090/config');
        const configData = JSON.parse(configResponse.data);
        const isRunning = configData.running;

        // 更新 Tile
        $done({
            title: 'Stash Control',
            content: `Status: ${isRunning ? 'Running' : 'Stopped'}`,
            backgroundColor: '#663399',
            icon: 'network',
            actions: [
                { label: isRunning ? 'Stop' : 'Start', handler: isRunning ? 'stopStash' : 'startStash' }
            ]
        });
    } catch (error) {
        console.error(error);
        $done({
            title: 'Error',
            content: 'Failed to load data.',
            backgroundColor: '#FF0000',
            icon: 'exclamationmark.triangle.fill',
        });
    }
}

async function startStash() {
    try {
        await $httpClient.post('http://localhost:9090/config/start', {});
        main(); // Refresh the tile after starting
    } catch (error) {
        console.error(error);
    }
}

async function stopStash() {
    try {
        await $httpClient.post('http://localhost:9090/config/stop', {});
        main(); // Refresh the tile after stopping
    } catch (error) {
        console.error(error);
    }
}

main();