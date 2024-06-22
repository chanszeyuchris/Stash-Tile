async function main() {
    // 获取代理组列表
    $httpClient.get('http://localhost:9090/proxies', function(error, response, data) {
        // 尝试解码返回的数据
        const decodedData = decodeURIComponent(escape(data));

        // 解析代理组数据
        const proxyGroups = JSON.parse(decodedData);
        const autoSelectGroup = proxyGroups.proxies['自动选择'];

        if (autoSelectGroup) {
            const currentNode = autoSelectGroup.now;
            const historyEntry = autoSelectGroup.history.find(item => item.name === currentNode);
            const currentDelay = historyEntry ? historyEntry.delay : 'N/A';

            // 更新 Tile
            $done({
                title: 'Auto Select Status',
                content: `Node: ${currentNode}\nDelay: ${currentDelay} ms`,
                backgroundColor: '#40E0D0', // 浅蓝绿色
                icon: 'globe',
            });
        } else {
            $done({
                title: 'Auto Select Status',
                content: 'Auto Select group not found.',
                backgroundColor: '#FF0000',
                icon: 'exclamationmark.triangle.fill',
            });
        }
    });
}

main();