async function main() {
    // 获取代理组列表
    $httpClient.get('http://localhost:9090/proxies', function(error, response, data) {
        const proxyGroups = JSON.parse(data);
        const autoSelectGroup = proxyGroups.proxies['自动选择'];

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
}

main();