async function main() {
    console.log('Starting main function for switch-proxy-group');

    try {
        const response = await fetch('http://127.0.0.1:9090/proxies', { method: 'GET', timeout: 20000, headers: {
        'Authorization': 'Bearer NhT7wv98',}});
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Parsed proxy groups for switch-proxy-group:', data);

        const selectProxyGroup = data.proxies['选择代理'];
        if (selectProxyGroup) {
            const currentNode = selectProxyGroup.now;

            function resolveInnerNode(node) {
                console.log(`Resolving node: ${node}`);
                if (data.proxies[node] && (data.proxies[node].type === 'Selector' || data.proxies[node].type === 'URLTest')) {
                    const innerNode = data.proxies[node].now;
                    console.log(`Inner node for ${node}: ${innerNode}`);
                    return resolveInnerNode(innerNode);
                }
                return node;
            }

            let innerProxy = resolveInnerNode(currentNode);
            console.log(`Final inner proxy: ${innerProxy}`);

            let currentDelay = 'Timeout';
            if (data.proxies[innerProxy] && data.proxies[innerProxy].delay !== undefined) {
                currentDelay = data.proxies[innerProxy].delay;
            } else if (data.proxies[selectProxyGroup.now] && data.proxies[selectProxyGroup.now].delay !== undefined) {
                currentDelay = data.proxies[selectProxyGroup.now].delay;
            }
            console.log(`Final delay: ${currentDelay}`);

            // 更新 Tile
            $done({
                title: '当前代理组',
                content: `${selectProxyGroup.now}\n${innerProxy}\n(${currentDelay !== 'Timeout' ? currentDelay : 'Timeout'} ms)`,
                backgroundColor: '#40E0D0', 
                icon: 'globe'
            });
        } else {
            console.log('Select Proxy group not found');
            $done({
                title: '当前代理组',
                content: 'Select Proxy group not found.',
                backgroundColor: '#FF0000',
                icon: 'exclamationmark.triangle.fill',
            });
        }
    } catch (error) {
        console.log('HTTP request failed for switch-proxy-group:', error);
        $done({
            title: '当前代理组',
            content: `Failed to load data: ${error.message}`,
            backgroundColor: '#FF0000',
            icon: 'exclamationmark.triangle.fill',
        });
    }
}

main();
