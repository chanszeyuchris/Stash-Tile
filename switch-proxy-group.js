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
            const currentNode = selectProxyGroup.now;
            const currentDelay = selectProxyGroup.delay || 'Timeout';

            console.log('Current node for switch-proxy-group:', currentNode);
            console.log('Current delay for switch-proxy-group:', currentDelay);

            // 获取下一个节点
            const nextNodeIndex = (selectProxyGroup.all.indexOf(currentNode) + 1) % selectProxyGroup.all.length;
            const nextNode = selectProxyGroup.all[nextNodeIndex];

            console.log('Next node for switch-proxy-group:', nextNode);

            // 更新 Tile
            $done({
                title: 'Select Proxy Status',
                content: `Node: ${currentNode}\nDelay: ${currentDelay} ms`,
                backgroundColor: '#8A2BE2', // 偏蓝的浅紫色
                icon: 'key',
                actions: [
                    {
                        label: `Switch to ${nextNode}`,
                        action: `switchProxy('${nextNode}')`
                    }
                ]
            });
        } else {
            console.log('Select Proxy group not found');
            $done({
                title: 'Select Proxy Status',
                content: 'Select Proxy group not found.',
                backgroundColor: '#FF0000',
                icon: 'exclamationmark.triangle.fill',
            });
        }
    } catch (error) {
        console.log('HTTP request failed for switch-proxy-group:', error);
        $done({
            title: 'Select Proxy Status',
            content: `Failed to load data: ${error.message}`,
            backgroundColor: '#FF0000',
            icon: 'exclamationmark.triangle.fill',
        });
    }
}

function switchProxy(proxyName) {
    console.log(`Switching to ${proxyName}`);
    // 测试函数内容
}

window.switchProxy = switchProxy;

main();
