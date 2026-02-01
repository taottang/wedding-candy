// =================================================================
// 区域数据加载器 - Region Loader
// 处理省市区三级联动数据
// =================================================================

const RegionLoader = {
    // 存储区域数据
    data: null,
    
    // 上次选择的记录（用于记住选择）
    lastSelection: {
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        district: '',
        districtCode: ''
    },
    
    // LocalStorage 键名
    STORAGE_KEY: 'wedding_last_region_selection',
    
    /**
     * 加载区域数据
     * @returns {Promise} 加载Promise
     */
    async load() {
        try {
            const response = await fetch('data/regions.json');
            if (!response.ok) {
                throw new Error('Failed to load region data');
            }
            this.data = await response.json();
            
            // 加载上次选择
            this.loadLastSelection();
            
            return this.data;
        } catch (error) {
            console.error('Load region data error:', error);
            throw error;
        }
    },
    
    /**
     * 获取所有省份
     * @returns {Array} 省份数组
     */
    getProvinces() {
        if (!this.data || !this.data['86'] || !this.data['86'].children) {
            return [];
        }
        
        const provinces = [];
        const chinaData = this.data['86'].children;
        
        for (const code in chinaData) {
            if (chinaData.hasOwnProperty(code)) {
                provinces.push({
                    code: code,
                    name: chinaData[code].name
                });
            }
        }
        
        // 按名称排序
        return provinces.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    },
    
    /**
     * 根据省份代码获取城市列表
     * @param {string} provinceCode - 省份代码
     * @returns {Array} 城市数组
     */
    getCities(provinceCode) {
        if (!this.data || !this.data['86'] || !this.data['86'].children) {
            return [];
        }
        
        const province = this.data['86'].children[provinceCode];
        if (!province || !province.children) {
            return [];
        }
        
        const cities = [];
        for (const code in province.children) {
            if (province.children.hasOwnProperty(code)) {
                cities.push({
                    code: code,
                    name: province.children[code].name
                });
            }
        }
        
        return cities;
    },
    
    /**
     * 根据省份和城市代码获取区县列表
     * @param {string} provinceCode - 省份代码
     * @param {string} cityCode - 城市代码
     * @returns {Array} 区县数组
     */
    getDistricts(provinceCode, cityCode) {
        if (!this.data || !this.data['86'] || !this.data['86'].children) {
            return [];
        }
        
        const province = this.data['86'].children[provinceCode];
        if (!province || !province.children) {
            return [];
        }
        
        const city = province.children[cityCode];
        if (!city || !city.children) {
            return [];
        }
        
        const districts = [];
        for (const code in city.children) {
            if (city.children.hasOwnProperty(code)) {
                districts.push({
                    code: code,
                    name: city.children[code].name
                });
            }
        }
        
        return districts;
    },
    
    /**
     * 根据名称查找省份代码
     * @param {string} provinceName - 省份名称
     * @returns {string|null} 省份代码
     */
    getProvinceCode(provinceName) {
        const provinces = this.getProvinces();
        const province = provinces.find(p => p.name === provinceName);
        return province ? province.code : null;
    },
    
    /**
     * 根据省份代码和城市名称查找城市代码
     * @param {string} provinceCode - 省份代码
     * @param {string} cityName - 城市名称
     * @returns {string|null} 城市代码
     */
    getCityCode(provinceCode, cityName) {
        const cities = this.getCities(provinceCode);
        const city = cities.find(c => c.name === cityName);
        return city ? city.code : null;
    },
    
    /**
     * 根据省份、城市代码和区县名称查找区县代码
     * @param {string} provinceCode - 省份代码
     * @param {string} cityCode - 城市代码
     * @param {string} districtName - 区县名称
     * @returns {string|null} 区县代码
     */
    getDistrictCode(provinceCode, cityCode, districtName) {
        const districts = this.getDistricts(provinceCode, cityCode);
        const district = districts.find(d => d.name === districtName);
        return district ? district.code : null;
    },
    
    /**
     * 填充省份下拉框
     * @param {HTMLSelectElement} selectElement - select元素
     * @param {string} selectedValue - 默认选中的值
     */
    populateProvinces(selectElement, selectedValue = '') {
        if (!selectElement) return;
        
        // 清空现有选项（保留第一个提示选项）
        selectElement.innerHTML = '<option value="">请选择省份</option>';
        
        const provinces = this.getProvinces();
        
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province.code;
            option.textContent = province.name;
            option.dataset.name = province.name;
            
            if (selectedValue && province.code === selectedValue) {
                option.selected = true;
            }
            
            selectElement.appendChild(option);
        });
    },
    
    /**
     * 填充城市下拉框
     * @param {HTMLSelectElement} selectElement - select元素
     * @param {string} provinceCode - 省份代码
     * @param {string} selectedValue - 默认选中的值
     */
    populateCities(selectElement, provinceCode, selectedValue = '') {
        if (!selectElement) return;
        
        // 清空现有选项
        selectElement.innerHTML = '<option value="">请选择城市</option>';
        
        if (!provinceCode) {
            selectElement.disabled = true;
            return;
        }
        
        const cities = this.getCities(provinceCode);
        
        if (cities.length === 0) {
            selectElement.disabled = true;
            return;
        }
        
        selectElement.disabled = false;
        
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.code;
            option.textContent = city.name;
            option.dataset.name = city.name;
            
            if (selectedValue && city.code === selectedValue) {
                option.selected = true;
            }
            
            selectElement.appendChild(option);
        });
    },
    
    /**
     * 填充区县下拉框
     * @param {HTMLSelectElement} selectElement - select元素
     * @param {string} provinceCode - 省份代码
     * @param {string} cityCode - 城市代码
     * @param {string} selectedValue - 默认选中的值
     */
    populateDistricts(selectElement, provinceCode, cityCode, selectedValue = '') {
        if (!selectElement) return;
        
        // 清空现有选项
        selectElement.innerHTML = '<option value="">请选择区县</option>';
        
        if (!provinceCode || !cityCode) {
            selectElement.disabled = true;
            return;
        }
        
        const districts = this.getDistricts(provinceCode, cityCode);
        
        if (districts.length === 0) {
            selectElement.disabled = true;
            return;
        }
        
        selectElement.disabled = false;
        
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district.code;
            option.textContent = district.name;
            option.dataset.name = district.name;
            
            if (selectedValue && district.code === selectedValue) {
                option.selected = true;
            }
            
            selectElement.appendChild(option);
        });
    },
    
    /**
     * 初始化三级联动
     * @param {Object} elements - 包含province, city, district的select元素对象
     */
    initCascade(elements) {
        const { province, city, district } = elements;
        
        if (!province || !city || !district) {
            console.error('Missing required select elements');
            return;
        }
        
        // 省份变化事件
        province.addEventListener('change', () => {
            const provinceCode = province.value;
            const provinceName = province.options[province.selectedIndex]?.dataset.name || '';
            
            // 重置城市和区县
            city.innerHTML = '<option value="">请选择城市</option>';
            district.innerHTML = '<option value="">请先选择城市</option>';
            district.disabled = true;
            
            if (provinceCode) {
                this.populateCities(city, provinceCode);
                
                // 保存选择
                this.lastSelection.province = provinceName;
                this.lastSelection.provinceCode = provinceCode;
                this.lastSelection.city = '';
                this.lastSelection.cityCode = '';
                this.lastSelection.district = '';
                this.lastSelection.districtCode = '';
                this.saveLastSelection();
            }
        });
        
        // 城市变化事件
        city.addEventListener('change', () => {
            const provinceCode = province.value;
            const cityCode = city.value;
            const cityName = city.options[city.selectedIndex]?.dataset.name || '';
            
            // 重置区县
            district.innerHTML = '<option value="">请选择区县</option>';
            
            if (provinceCode && cityCode) {
                this.populateDistricts(district, provinceCode, cityCode);
                
                // 保存选择
                this.lastSelection.city = cityName;
                this.lastSelection.cityCode = cityCode;
                this.lastSelection.district = '';
                this.lastSelection.districtCode = '';
                this.saveLastSelection();
            } else {
                district.disabled = true;
            }
        });
        
        // 区县变化事件
        district.addEventListener('change', () => {
            const districtCode = district.value;
            const districtName = district.options[district.selectedIndex]?.dataset.name || '';
            
            if (districtCode) {
                // 保存选择
                this.lastSelection.district = districtName;
                this.lastSelection.districtCode = districtCode;
                this.saveLastSelection();
            }
        });
    },
    
    /**
     * 保存上次选择到LocalStorage
     */
    saveLastSelection() {
        Utils.storage.set(this.STORAGE_KEY, this.lastSelection);
    },
    
    /**
     * 从LocalStorage加载上次选择
     */
    loadLastSelection() {
        const saved = Utils.storage.get(this.STORAGE_KEY);
        if (saved) {
            this.lastSelection = saved;
        }
    },
    
    /**
     * 恢复上次选择
     * @param {Object} elements - 包含province, city, district的select元素对象
     */
    restoreLastSelection(elements) {
        const { province, city, district } = elements;
        
        if (!this.lastSelection.provinceCode) {
            return;
        }
        
        // 恢复省份
        if (this.lastSelection.provinceCode) {
            province.value = this.lastSelection.provinceCode;
            
            // 触发变化以加载城市
            this.populateCities(city, this.lastSelection.provinceCode);
            
            // 恢复城市
            if (this.lastSelection.cityCode) {
                setTimeout(() => {
                    city.value = this.lastSelection.cityCode;
                    
                    // 触发变化以加载区县
                    this.populateDistricts(
                        district, 
                        this.lastSelection.provinceCode, 
                        this.lastSelection.cityCode
                    );
                    
                    // 恢复区县
                    if (this.lastSelection.districtCode) {
                        setTimeout(() => {
                            district.value = this.lastSelection.districtCode;
                        }, 100);
                    }
                }, 100);
            }
        }
    },
    
    /**
     * 清除上次选择
     */
    clearLastSelection() {
        this.lastSelection = {
            province: '',
            provinceCode: '',
            city: '',
            cityCode: '',
            district: '',
            districtCode: ''
        };
        Utils.storage.remove(this.STORAGE_KEY);
    },
    
    /**
     * 获取完整地址文本
     * @param {Object} elements - 包含province, city, district的select元素对象
     * @returns {string} 完整地址
     */
    getFullAddress(elements) {
        const { province, city, district } = elements;
        
        const provinceName = province.options[province.selectedIndex]?.dataset.name || '';
        const cityName = city.options[city.selectedIndex]?.dataset.name || '';
        const districtName = district.options[district.selectedIndex]?.dataset.name || '';
        
        return `${provinceName} ${cityName} ${districtName}`.trim();
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RegionLoader;
}

console.log('%c🗺️ Region Loader Ready', 'color: #2196F3; font-size: 12px;');
