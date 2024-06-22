async function main() {
    try {
        // 获取代理组列表
        const response = await $httpClient.get('http://localhost:9090/proxies');
        const proxyGroups = JSON.parse(response.data);

        // 过滤出类型为 'select' 的代理组
        const selectGroups = proxyGroups.filter(group => group.type === 'select');

        // 生成 Tile 的内容
        const content = selectGroups.map(group => {
            return `${group.name}: ${group.now}`;
        }).join('\n');

        // 更新 Tile
        $done({
            title: 'Select Proxy Groups',
            content: content,
            backgroundColor: '#663399',
            icon: 'network',
        });
    } catch (error) {
        console.error(error);
        $done({
            title: 'Error',
            content: 'Failed to load proxy groups.',
            backgroundColor: '#FF0000',
            icon: 'exclamationmark.triangle.fill',
        });
    }
}

main();
