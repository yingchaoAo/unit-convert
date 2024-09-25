document.getElementById('convertBtn').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // 清除之前的结果

    const parsedData = parseText(inputText);
    if (parsedData.length === 0) {
        resultsDiv.innerHTML = '<p>未找到数量和单位。</p>';
        return;
    }

    parsedData.forEach(item => {
        const conversionResult = convertUnit(item.quantity, item.unit);
        if (conversionResult) {
            const resultText = `${item.quantity} ${item.unit} = ${conversionResult.convertedQuantity} ${conversionResult.convertedUnit}`;
            const p = document.createElement('p');
            p.textContent = resultText;
            resultsDiv.appendChild(p);
        } else {
            const p = document.createElement('p');
            p.textContent = `无法转换 ${item.quantity} ${item.unit}。`;
            resultsDiv.appendChild(p);
        }
    });
});

function parseText(text) {
    const results = [];
    // 正则表达式匹配数量和单位（例如："5 km"，"20 Celsius"）
    const regex = /(\d+(\.\d+)?)\s*([a-zA-Z]+(?:\s*[a-zA-Z]+)*)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const quantity = parseFloat(match[1]);
        const unit = match[3].toLowerCase();
        results.push({ quantity, unit });
    }

    return results;
}

function convertUnit(quantity, unit) {
    // 定义单位映射
    const unitMappings = {
        'celsius': ['celsius', 'c', '摄氏度'],
        'fahrenheit': ['fahrenheit', 'f', '华氏度'],
        'kilogram': ['kilogram', 'kilograms', 'kg', '千克', '公斤'],
        'pound': ['pound', 'pounds', 'lb', 'lbs', '磅'],
        'kilometer': ['kilometer', 'kilometers', 'km', '公里'],
        'mile': ['mile', 'miles', 'mi', '英里'],
        // 添加更多需要的单位和别名
    };

    function findStandardUnit(inputUnit) {
        for (const [standardUnit, aliases] of Object.entries(unitMappings)) {
            if (aliases.includes(inputUnit)) {
                return standardUnit;
            }
        }
        return null;
    }

    const standardUnit = findStandardUnit(unit);
    if (!standardUnit) return null;

    // 定义转换规则
    const conversions = {
        // 温度
        'celsius': { toUnit: '华氏度', formula: (q) => (q * 9/5) + 32 },
        'fahrenheit': { toUnit: '摄氏度', formula: (q) => (q -32) * 5/9 },
        // 长度
        'kilometer': { toUnit: '英里', formula: (q) => q * 0.621371 },
        'mile': { toUnit: '公里', formula: (q) => q * 1.60934 },
        // 重量
        'kilogram': { toUnit: '磅', formula: (q) => q * 2.20462 },
        'pound': { toUnit: '千克', formula: (q) => q * 0.453592 },
        // 添加更多需要的转换规则
    };

    if (conversions[standardUnit]) {
        const convertedQuantity = conversions[standardUnit].formula(quantity);
        return {
            convertedQuantity: convertedQuantity.toFixed(2),
            convertedUnit: conversions[standardUnit].toUnit
        };
    }

    return null;
}