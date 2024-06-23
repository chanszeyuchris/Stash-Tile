async function main() {
    console.log('Starting main function for switch-proxy-group');

    try {
        const response = await fetch('http://127.0.0.1:9090/proxies', { method: 'GET', timeout: 20000 });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Parsed proxy groups for switch-proxy-group:', data);

        const selectProxyGroup = data.proxies['选择代理'];
        if (selectProxyGroup) {
            let currentNode = selectProxyGroup.now;
            let currentDelay = 'Timeout';
            let parentProxy = '选择代理';
            let innerProxy = currentNode;

            function getNodeDetails(node) {
                console.log('Checking node:', node);
                if (data.proxies[node]) {
                    console.log('Node data:', data.proxies[node]);
                    if (data.proxies[node].history && data.proxies[node].history.length > 0) {
                        const nodeHistory = data.proxies[node].history;
                        currentDelay = nodeHistory[nodeHistory.length - 1].delay;
                        console.log('Found delay for node:', currentDelay);
                    } else {
                        console.log('No history for node:', node);
                    }
                    if (data.proxies[node].type === 'Selector' || data.proxies[node].type === 'URLTest') {
                        parentProxy = node;
                        currentNode = data.proxies[node].now;
                        innerProxy = currentNode;
                        console.log('Node is a Selector/URLTest, moving to inner node:', currentNode);
                        getNodeDetails(currentNode);
                    }
                } else {
                    console.log('Node not found in proxies:', node);
                    // Try to find the node in the proxies of the parentProxy
                    const parentGroup = data.proxies[parentProxy];
                    if (parentGroup && parentGroup.all.includes(node)) {
                        console.log('Node found in parent group proxies:', parentGroup);
                        currentNode = node;
                        if (parentGroup.history && parentGroup.history.length > 0) {
                            const nodeHistory = parentGroup.history;
                            currentDelay = nodeHistory[nodeHistory.length - 1].delay;
                            console.log('Found delay for node in parent group:', currentDelay);
                        }
                    }
                }
            }

            getNodeDetails(currentNode);

            console.log('Final node for switch-proxy-group:', currentNode);
            console.log('Final delay for switch-proxy-group:', currentDelay);

            // 尝试获取最终节点的历史记录
            if (data.proxies[currentNode] && data.proxies[currentNode].history && data.proxies[currentNode].history.length > 0) {
                const nodeHistory = data.proxies[currentNode].history;
                currentDelay = nodeHistory[nodeHistory.length - 1].delay;
                console.log('Found delay for final node:', currentDelay);
            }

            const displayContent = `${selectProxyGroup.now}\n${parentProxy} 下的 ${innerProxy}\n(${currentDelay !== 'Timeout' ? currentDelay : 'Timeout'} ms)`;

            console.log('Display content for switch-proxy-group:', displayContent);

            // 更新 Tile
            $done({
                title: '当前代理组',
                content: displayContent,
                backgroundColor: '#8A2BE2', // 偏蓝的浅紫色
                icon: 'key'
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
