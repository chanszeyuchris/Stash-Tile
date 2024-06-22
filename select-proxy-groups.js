async function main() {
    // 获取代理组列表
    $httpClient.get('http://localhost:9090/proxies', function(error, response, data) {
        const autoSelectGroupMatch = data.match(/"自动选择"\s*:\s*{[^}]+}/);
        const autoSelectGroupData = autoSelectGroupMatch ? autoSelectGroupMatch[0] : '';
        const currentNodeMatch = autoSelectGroupData.match(/"now"\s*:\s*"([^"]+)"/);
        const currentDelayMatch = autoSelectGroupData.match(/"delay"\s*:\s*([0-9]+)/);

        const currentNode = currentNodeMatch ? currentNodeMatch[1] : 'N/A';
        const currentDelay = currentDelayMatch ? currentDelayMatch[1] : 'N/A';

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