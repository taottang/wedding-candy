// =================================================================
// 测试工具 - Test Utilities
// 开发和测试辅助工具集
// =================================================================

const TestUtils = (() => {
    // 测试数据配置
    const TEST_CONFIG = {
        surnames: ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'],
        givenNames: ['明', '华', '强', '芳', '伟', '敏', '静', '丽', '军', '磊', '洋', '勇', '艳', '娟', '杰', '超', '鹏', '霞', '婷', '玲'],
        relationships: ['family', 'friend', 'colleague', 'relative', 'other'],
        deliveryTimes: ['anytime', 'workday', 'weekend', 'morning', 'afternoon'],
        blessings: [
            '祝新婚快乐，百年好合！',
            '愿你们永远幸福美满！',
            '白头偕老，早生贵子！',
            '恭喜恭喜，新婚大喜！',
            '执子之手，与子偕老！',
            '天作之合，佳偶天成！',
            '相濡以沫，幸福一生！',
            '祝你们永浴爱河！',
            '恭祝新婚愉快，甜甜蜜蜜！',
            '愿你们的爱情永远甜蜜！'
        ]
    };

    /**
     * 生成随机姓名
     */
    function generateName() {
        const surname = TEST_CONFIG.surnames[Math.floor(Math.random() * TEST_CONFIG.surnames.length)];
        const givenName1 = TEST_CONFIG.givenNames[Math.floor(Math.random() * TEST_CONFIG.givenNames.length)];
        const givenName2 = Math.random() > 0.5 ? TEST_CONFIG.givenNames[Math.floor(Math.random() * TEST_CONFIG.givenNames.length)] : '';
        return surname + givenName1 + givenName2;
    }

    /**
     * 生成随机手机号
     */
    function generatePhone() {
        const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
                         '150', '151', '152', '153', '155', '156', '157', '158', '159',
                         '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
        return prefix + suffix;
    }

    /**
     * 生成随机微信号
     */
    function generateWechat(name) {
        const pinyin = name.toLowerCase().replace(/\s+/g, '');
        const number = Math.floor(Math.random() * 10000);
        return pinyin + number;
    }

    /**
     * 生成随机地址
     */
    function generateAddress() {
        const provinces = ['北京市', '上海市', '广东省', '浙江省', '江苏省', '四川省', '湖北省', '湖南省'];
        const cities = {
            '北京市': ['北京市'],
            '上海市': ['上海市'],
            '广东省': ['广州市', '深圳市', '珠海市', '东莞市'],
            '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市'],
            '江苏省': ['南京市', '苏州市', '无锡市', '常州市'],
            '四川省': ['成都市', '绵阳市', '德阳市', '乐山市'],
            '湖北省': ['武汉市', '宜昌市', '襄阳市', '荆州市'],
            '湖南省': ['长沙市', '株洲市', '湘潭市', '衡阳市']
        };
        const districts = ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '通州区', '昌平区'];
        const streets = ['中山路', '解放路', '人民路', '建设路', '和平路', '胜利路', '文化路', '新华路'];
        
        const province = provinces[Math.floor(Math.random() * provinces.length)];
        const cityList = cities[province];
        const city = cityList[Math.floor(Math.random() * cityList.length)];
        const district = districts[Math.floor(Math.random() * districts.length)];
        const street = streets[Math.floor(Math.random() * streets.length)];
        const number = Math.floor(Math.random() * 500) + 1;
        const building = Math.floor(Math.random() * 20) + 1;
        const unit = Math.floor(Math.random() * 10) + 1;
        const room = Math.floor(Math.random() * 30) + 101;
        
        return {
            province,
            city,
            district,
            detail: `${street}${number}号${building}栋${unit}单元${room}室`,
            zipcode: Math.floor(Math.random() * 900000 + 100000).toString()
        };
    }

    /**
     * 生成单条测试数据
     */
    function generateTestRecord() {
        const name = generateName();
        const phone = generatePhone();
        const address = generateAddress();
        const relationship = TEST_CONFIG.relationships[Math.floor(Math.random() * TEST_CONFIG.relationships.length)];
        const deliveryTime = TEST_CONFIG.deliveryTimes[Math.floor(Math.random() * TEST_CONFIG.deliveryTimes.length)];
        const blessing = Math.random() > 0.3 ? TEST_CONFIG.blessings[Math.floor(Math.random() * TEST_CONFIG.blessings.length)] : '';
        
        return {
            name,
            phone,
            wechat: generateWechat(name),
            relationship,
            province: address.province,
            city: address.city,
            district: address.district,
            address: address.detail,
            zipcode: address.zipcode,
            deliveryTime,
            message: blessing
        };
    }

    /**
     * 生成多条测试数据
     */
    function generateTestData(count = 100) {
        console.log(`%c🔧 开始生成 ${count} 条测试数据...`, 'color: #2196F3; font-weight: bold;');
        const startTime = performance.now();
        
        const testData = [];
        for (let i = 0; i < count; i++) {
            testData.push(generateTestRecord());
        }
        
        const endTime = performance.now();
        console.log(`%c✅ 生成完成！耗时: ${(endTime - startTime).toFixed(2)}ms`, 'color: #4CAF50; font-weight: bold;');
        
        return testData;
    }

    /**
     * 导入测试数据到系统
     */
    function importTestData(count = 100) {
        if (typeof DataManager === 'undefined') {
            console.error('❌ DataManager 未加载');
            return { success: false, message: 'DataManager 未加载' };
        }

        const testData = generateTestData(count);
        let successCount = 0;
        let failCount = 0;

        testData.forEach(data => {
            const result = DataManager.saveRecipient(data);
            if (result.success) {
                successCount++;
            } else {
                failCount++;
            }
        });

        console.log(`%c📊 导入结果: 成功 ${successCount} 条, 失败 ${failCount} 条`, 'color: #FF9800; font-weight: bold;');
        
        return {
            success: true,
            message: `成功导入 ${successCount} 条数据`,
            successCount,
            failCount
        };
    }

    /**
     * 表单自动填充
     */
    function autoFillForm(formId = 'recipientForm') {
        const testRecord = generateTestRecord();
        
        // 填充基本信息
        const nameInput = document.getElementById('name') || document.querySelector('input[name="name"]');
        if (nameInput) nameInput.value = testRecord.name;
        
        const relationshipSelect = document.getElementById('relationship') || document.querySelector('select[name="relationship"]');
        if (relationshipSelect) relationshipSelect.value = testRecord.relationship;
        
        // 填充联系方式
        const phoneInput = document.getElementById('phone') || document.querySelector('input[name="phone"]');
        if (phoneInput) phoneInput.value = testRecord.phone;
        
        const wechatInput = document.getElementById('wechat') || document.querySelector('input[name="wechat"]');
        if (wechatInput) wechatInput.value = testRecord.wechat;
        
        // 填充地址信息
        const provinceSelect = document.getElementById('province') || document.querySelector('select[name="province"]');
        if (provinceSelect) {
            provinceSelect.value = testRecord.province;
            // 触发change事件以加载城市
            provinceSelect.dispatchEvent(new Event('change'));
            
            setTimeout(() => {
                const citySelect = document.getElementById('city') || document.querySelector('select[name="city"]');
                if (citySelect) {
                    citySelect.value = testRecord.city;
                    citySelect.dispatchEvent(new Event('change'));
                    
                    setTimeout(() => {
                        const districtSelect = document.getElementById('district') || document.querySelector('select[name="district"]');
                        if (districtSelect) districtSelect.value = testRecord.district;
                    }, 100);
                }
            }, 100);
        }
        
        const addressInput = document.getElementById('address') || document.querySelector('input[name="address"]');
        if (addressInput) addressInput.value = testRecord.address;
        
        const zipcodeInput = document.getElementById('zipcode') || document.querySelector('input[name="zipcode"]');
        if (zipcodeInput) zipcodeInput.value = testRecord.zipcode;
        
        const deliveryTimeSelect = document.getElementById('deliveryTime') || document.querySelector('select[name="deliveryTime"]');
        if (deliveryTimeSelect) deliveryTimeSelect.value = testRecord.deliveryTime;
        
        // 填充留言
        const messageInput = document.getElementById('message') || document.querySelector('textarea[name="message"]');
        if (messageInput) messageInput.value = testRecord.message;
        
        console.log('%c✅ 表单已自动填充', 'color: #4CAF50; font-weight: bold;');
        console.log('测试数据:', testRecord);
    }

    /**
     * 清理 LocalStorage
     */
    function clearStorage(confirm = true) {
        if (confirm && !window.confirm('确定要清空所有 LocalStorage 数据吗？此操作不可恢复！')) {
            return { success: false, message: '操作已取消' };
        }

        const keys = Object.keys(localStorage);
        const count = keys.length;
        
        localStorage.clear();
        
        console.log(`%c🗑️ 已清空 ${count} 个 LocalStorage 项`, 'color: #F44336; font-weight: bold;');
        
        return {
            success: true,
            message: `已清空 ${count} 个存储项`,
            count
        };
    }

    /**
     * 显示 LocalStorage 信息
     */
    function showStorageInfo() {
        const keys = Object.keys(localStorage);
        const totalSize = new Blob(Object.values(localStorage)).size;
        
        console.log('%c📦 LocalStorage 信息', 'color: #9C27B0; font-size: 14px; font-weight: bold;');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`项数: ${keys.length}`);
        console.log(`总大小: ${(totalSize / 1024).toFixed(2)} KB`);
        console.log(`使用率: ${((totalSize / (5 * 1024 * 1024)) * 100).toFixed(2)}%`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        keys.forEach(key => {
            const value = localStorage.getItem(key);
            const size = new Blob([value]).size;
            console.log(`${key}: ${(size / 1024).toFixed(2)} KB`);
        });
        
        return {
            keys: keys.length,
            totalSize,
            items: keys.map(key => ({
                key,
                size: new Blob([localStorage.getItem(key)]).size
            }))
        };
    }

    /**
     * 性能监控
     */
    function startPerformanceMonitor() {
        console.log('%c⚡ 性能监控已启动', 'color: #FF9800; font-weight: bold;');
        
        // 监控页面加载性能
        if (performance.timing) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
            const firstPaintTime = timing.responseStart - timing.navigationStart;
            
            console.log('%c📊 页面加载性能', 'color: #2196F3; font-weight: bold;');
            console.log(`页面完全加载: ${loadTime}ms`);
            console.log(`DOM 解析完成: ${domReadyTime}ms`);
            console.log(`首次渲染: ${firstPaintTime}ms`);
        }

        // 监控内存使用（Chrome）
        if (performance.memory) {
            setInterval(() => {
                const memory = performance.memory;
                console.log('%c💾 内存使用', 'color: #9C27B0;');
                console.log(`已用: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`);
                console.log(`总量: ${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`);
                console.log(`限制: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
            }, 10000); // 每10秒输出一次
        }
    }

    /**
     * 浏览器兼容性检测
     */
    function checkBrowserCompatibility() {
        console.log('%c🌐 浏览器兼容性检测', 'color: #00BCD4; font-size: 14px; font-weight: bold;');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const features = {
            'LocalStorage': typeof(Storage) !== 'undefined',
            'Fetch API': typeof(fetch) !== 'undefined',
            'Promise': typeof(Promise) !== 'undefined',
            'Arrow Functions': (() => {
                try {
                    eval('() => {}');
                    return true;
                } catch (e) {
                    return false;
                }
            })(),
            'Template Literals': (() => {
                try {
                    eval('`test`');
                    return true;
                } catch (e) {
                    return false;
                }
            })(),
            'ES6 Classes': typeof(class {}) === 'function',
            'IntersectionObserver': typeof(IntersectionObserver) !== 'undefined',
            'Web Share API': typeof(navigator.share) !== 'undefined',
            'Vibration API': typeof(navigator.vibrate) !== 'undefined',
            'Service Worker': 'serviceWorker' in navigator
        };

        let compatible = true;
        Object.entries(features).forEach(([feature, supported]) => {
            const status = supported ? '✅' : '❌';
            console.log(`${status} ${feature}: ${supported ? '支持' : '不支持'}`);
            if (!supported && ['LocalStorage', 'Fetch API', 'Promise'].includes(feature)) {
                compatible = false;
            }
        });

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        if (!compatible) {
            console.warn('⚠️ 浏览器版本过低，部分功能可能无法正常使用');
            console.warn('建议升级到以下浏览器的最新版本：');
            console.warn('- Chrome 90+');
            console.warn('- Firefox 88+');
            console.warn('- Safari 14+');
            console.warn('- Edge 90+');
        } else {
            console.log('✅ 浏览器完全兼容');
        }

        return { compatible, features };
    }

    /**
     * 显示浏览器兼容性提示
     */
    function showCompatibilityAlert() {
        const result = checkBrowserCompatibility();
        
        if (!result.compatible) {
            const message = '您的浏览器版本较低，可能无法正常使用本系统的所有功能。\n\n建议升级到最新版本的 Chrome、Firefox、Safari 或 Edge 浏览器。';
            
            if (typeof Utils !== 'undefined' && Utils.alert) {
                Utils.alert('浏览器兼容性提示', message);
            } else {
                alert(message);
            }
        }
    }

    /**
     * 运行所有测试
     */
    function runAllTests() {
        console.clear();
        console.log('%c🧪 开始运行系统测试...', 'color: #E91E63; font-size: 16px; font-weight: bold;');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // 1. 浏览器兼容性
        checkBrowserCompatibility();
        console.log('\n');
        
        // 2. LocalStorage 信息
        showStorageInfo();
        console.log('\n');
        
        // 3. 数据统计
        if (typeof DataManager !== 'undefined') {
            const stats = DataManager.getStatistics();
            console.log('%c📊 数据统计', 'color: #4CAF50; font-weight: bold;');
            console.log(`总记录数: ${stats.total}`);
            console.log(`今日新增: ${stats.today}`);
            console.log(`待发货: ${stats.pending}`);
            console.log(`已发货: ${stats.shipped}`);
            console.log(`已签收: ${stats.received}`);
        }
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('%c✅ 测试完成', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
    }

    /**
     * 导出数据样本
     */
    function exportSampleData() {
        const sample = generateTestData(10);
        const json = JSON.stringify(sample, null, 2);
        
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ 样本数据已导出');
    }

    // 返回公共 API
    return {
        // 数据生成
        generateTestData,
        generateTestRecord,
        importTestData,
        exportSampleData,
        
        // 表单工具
        autoFillForm,
        
        // 存储管理
        clearStorage,
        showStorageInfo,
        
        // 性能监控
        startPerformanceMonitor,
        
        // 兼容性检测
        checkBrowserCompatibility,
        showCompatibilityAlert,
        
        // 综合测试
        runAllTests
    };
})();

// 导出到全局
if (typeof window !== 'undefined') {
    window.TestUtils = TestUtils;
}

// CommonJS 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestUtils;
}

// 自动启动
if (typeof window !== 'undefined') {
    // 页面加载后自动检测兼容性
    window.addEventListener('load', () => {
        // 延迟检测，避免影响页面加载
        setTimeout(() => {
            TestUtils.checkBrowserCompatibility();
        }, 1000);
    });
}

console.log('%c🧪 Test Utils Loaded', 'color: #E91E63; font-size: 12px;');
console.log('%c使用 TestUtils 查看所有测试工具', 'color: #9E9E9E; font-size: 10px;');
