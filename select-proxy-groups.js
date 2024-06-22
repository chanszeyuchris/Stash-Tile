async function main() {
    console.log('Starting main function');

    // 设置请求超时时间为 20 秒
    const timeout = 20000; // 20 seconds

    $httpClient.get({ url: 'http://127.0.0.1:9090/proxies', timeout: timeout }, function(error, response, data) {
        if (error) {
            console.log('HTTP request failed:', error);
            console.log('Error details:', JSON.stringify(error));
            $done({
                title: 'Auto Select Status',
                content: `Failed to load data: ${JSON.stringify(error)}`,
                backgroundColor: '#FF0000',
                icon: 'exclamationmark.triangle.fill'
            });
            return;
        }

        console.log('HTTP request succeeded');
        console.log('Raw data:', data);

        // 解析代理组数据
        try {
            const proxyGroups = JSON.parse(data);
            console.log('Parsed proxy groups:', proxyGroups);

            const autoSelectGroup = proxyGroups.proxies['自动选择'];
            if (autoSelectGroup) {
                const currentNode = autoSelectGroup.now;
                const currentDelay = autoSelectGroup.delay;

                console.log('Current node:', currentNode);
                console.log('Current delay:', currentDelay);

                // 更新 Tile
                $done({
                    title: 'Auto Select Status',
                    content: `Node: ${currentNode}\nDelay: ${currentDelay} ms`,
                    backgroundColor: '#40E0D0', // 浅蓝绿色
                    icon: 'globe',
                });
            } else {
                console.log('Auto Select group not found');
                $done({
                    title: 'Auto Select Status',
                    content: 'Auto Select group not found.',
                    backgroundColor: '#FF0000',
                    icon: 'exclamationmark.triangle.fill',
                });
            }
        } catch (e) {
            console.log('Failed to parse JSON:', e);
            $done({
                title: 'Auto Select Status',
                content: 'Failed to parse data.',
                backgroundColor: '#FF0000',
                icon: 'exclamationmark.triangle.fill',
            });
        }
    });
}

main();