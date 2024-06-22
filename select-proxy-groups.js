async function main() {
    try {
        // 获取当前配置状态
        const configResponse = await $httpClient.get('http://localhost:9090/config');
        const configData = JSON.parse(configResponse.data);
        const currentConfig = configData.current;

        // 获取代理组列表
        const proxyResponse = await $httpClient.get('http://localhost:9090/proxies');
        const proxyGroups = JSON.parse(proxyResponse.data);

        // 找到"自动选择"代理组
        const autoSelectGroup = proxyGroups.proxies['自动选择'];
        const currentNode = autoSelectGroup.now;
        const currentDelay = autoSelectGroup.history.find(item => item.name === currentNode).delay;

        let content = `Current Config: ${currentConfig}\n\nAuto Select: ${currentNode} (${currentDelay} ms)`;

        // 增加切换模式选项
        const modes = ['rule', 'global', 'direct'];
        modes.forEach(mode => {
            content += `\nSwitch to ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
        });

        // 更新 Tile
        $done({
            title: 'Stash Control',
            content: content,
            backgroundColor: '#663399',
            icon: 'network',
            buttons: [
                { label: 'Start', action: 'startStash()' },
                { label: 'Stop', action: 'stopStash()' },
                ...modes.map(mode => ({ label: mode.charAt(0).toUpperCase() + mode.slice(1), action: `switchMode('${mode}')` }))
            ]
        });
    } catch (error) {
        console.error(error);
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
            console.error(error);
        } else {
            main();
        }
    });
}

function stopStash() {
    $httpClient.post('http://localhost:9090/config/stop', {}, function(error, response, data) {
        if (error) {
            console.error(error);
        } else {
            main();
        }
    });
}

function switchMode(mode) {
    $httpClient.post('http://localhost:9090/config/mode', { mode: mode }, function(error, response, data) {
        if (error) {
            console.error(error);
        } else {
            main();
        }
    });
}

main();
