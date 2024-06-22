async function main() {
    try {
        // 获取代理组列表
        $httpClient.get('http://localhost:9090/proxies', function(error, response, data) {
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

            const proxyGroups = JSON.parse(data);
            const autoSelectGroup = proxyGroups.proxies['自动选择'];

            if (!autoSelectGroup) {
                console.log(`Auto Select group not found`);
                $done({
                    title: 'Error',
                    content: 'Auto Select group not found.',
                    backgroundColor: '#FF0000',
                    icon: 'exclamationmark.triangle.fill',
                });
                return;
            }

            const currentNode = autoSelectGroup.now;
            const currentDelay = autoSelectGroup.history.find(item => item.name === currentNode)?.delay || 'N/A';

            // 更新 Tile
            $done({
                title: 'Auto Select Status',
                content: `Node: ${currentNode}\nDelay: ${currentDelay} ms`,
                backgroundColor: '#40E0D0', // 浅蓝绿色
                icon: 'globe',
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

main();