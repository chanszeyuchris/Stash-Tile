async function main() {
    try {
        // 获取当前配置状态
        $httpClient.get('http://localhost:9090/config', function(error, response, data) {
            if (error) {
                console.log(`Error: ${error}`);
                $done({
                    title: 'Error',
                    content: 'Failed to load data.',
                    backgroundColor: '#FF0000',
                    icon: 'exclamationmark.triangle.fill',
                });
                return;
            }

            const isRunning = data.includes('"running":true');

            // 获取当前IP地址
            $httpClient.get('https://api.my-ip.io/ip', function(error, response, ipData) {
                if (error) {
                    console.log(`Error: ${error}`);
                    $done({
                        title: 'Error',
                        content: 'Failed to load IP.',
                        backgroundColor: '#FF0000',
                        icon: 'exclamationmark.triangle.fill',
                    });
                    return;
                }

                // 更新 Tile
                $done({
                    title: 'Stash Control',
                    content: `Current IP: ${ipData.trim()}\nStatus: ${isRunning ? 'Running' : 'Stopped'}`,
                    backgroundColor: '#663399',
                    icon: 'network',
                    actions: [
                        { label: isRunning ? 'Stop' : 'Start', handler: isRunning ? 'stopStash' : 'startStash' }
                    ]
                });
            });
        });
    } catch (error) {
        console.log(`Error: ${error}`);
        $done({
            title: 'Error',
            content: 'Failed to load data.',
            backgroundColor: '#FF0000',
            icon: 'exclamationmark.triangle.fill',
        });
    }
}

function startStash() {
    $httpClient.post('http://localhost:9090/config/start', {}, function(error, response, data) {
        if (error) {
            console.log(`Error starting Stash: ${error}`);
            return;
        }
        main(); // Refresh the tile after starting
    });
}

function stopStash() {
    $httpClient.post('http://localhost:9090/config/stop', {}, function(error, response, data) {
        if (error) {
            console.log(`Error stopping Stash: ${error}`);
            return;
        }
        main(); // Refresh the tile after stopping
    });
}

main();