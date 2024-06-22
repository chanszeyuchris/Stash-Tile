async function main() {
    console.log('Starting main function');

    try {
        const response = await fetch('http://127.0.0.1:9090/proxies', { method: 'GET', timeout: 20000 });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Parsed proxy groups:', data);

        const autoSelectGroup = data.proxies['自动选择'];
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
    } catch (error) {
        console.log('HTTP request failed:', error);
        $done({
            title: 'Auto Select Status',
            content: `Failed to load data: ${error.message}`,
            backgroundColor: '#FF0000',
            icon: 'exclamationmark.triangle.fill',
        });
    }
}

main();
