/**
 * 省市区数据拆分工具
 * 将大的 regions.json 拆分为按需加载的小文件
 * 
 * 拆分策略：
 * 1. provinces.json - 所有省份列表（小文件，首次加载）
 * 2. cities/[省份代码].json - 各省的城市数据（按需加载）
 * 3. districts/[城市代码].json - 各市的区县数据（按需加载）
 */

const fs = require('fs');
const path = require('path');

// 读取原始数据
function loadRegionsData() {
  const dataPath = path.join(__dirname, '..', 'data', 'regions.json');
  const content = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(content);
}

// 创建目录
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 拆分数据
function splitRegionsData() {
  console.log('🚀 开始拆分省市区数据...\n');
  
  const regionsData = loadRegionsData();
  const chinaData = regionsData['86'];
  
  if (!chinaData || !chinaData.children) {
    console.error('❌ 数据格式错误');
    return;
  }
  
  const outputDir = path.join(__dirname, '..', 'data', 'regions');
  ensureDir(outputDir);
  
  // 创建子目录
  const citiesDir = path.join(outputDir, 'cities');
  const districtsDir = path.join(outputDir, 'districts');
  ensureDir(citiesDir);
  ensureDir(districtsDir);
  
  // 1. 提取省份列表
  const provinces = {};
  Object.entries(chinaData.children).forEach(([provinceCode, provinceData]) => {
    provinces[provinceCode] = {
      code: provinceData.code,
      name: provinceData.name
    };
  });
  
  // 保存省份列表
  const provincesPath = path.join(outputDir, 'provinces.json');
  fs.writeFileSync(provincesPath, JSON.stringify(provinces, null, 2), 'utf8');
  console.log(`✅ 省份列表: ${provincesPath}`);
  console.log(`   包含 ${Object.keys(provinces).length} 个省份`);
  console.log(`   文件大小: ${(fs.statSync(provincesPath).size / 1024).toFixed(2)} KB\n`);
  
  // 2. 拆分城市数据
  let cityFilesCount = 0;
  let cityTotalSize = 0;
  
  Object.entries(chinaData.children).forEach(([provinceCode, provinceData]) => {
    const cities = {};
    
    if (provinceData.children) {
      // 提取城市列表（不包含区县）
      Object.entries(provinceData.children).forEach(([cityCode, cityData]) => {
        cities[cityCode] = {
          code: cityData.code,
          name: cityData.name
        };
      });
      
      // 保存城市文件
      const cityFilePath = path.join(citiesDir, `${provinceCode}.json`);
      fs.writeFileSync(cityFilePath, JSON.stringify(cities, null, 2), 'utf8');
      
      cityFilesCount++;
      cityTotalSize += fs.statSync(cityFilePath).size;
    }
  });
  
  console.log(`✅ 城市数据: ${citiesDir}/`);
  console.log(`   生成 ${cityFilesCount} 个文件`);
  console.log(`   总大小: ${(cityTotalSize / 1024).toFixed(2)} KB`);
  console.log(`   平均大小: ${(cityTotalSize / cityFilesCount / 1024).toFixed(2)} KB\n`);
  
  // 3. 拆分区县数据
  let districtFilesCount = 0;
  let districtTotalSize = 0;
  
  Object.entries(chinaData.children).forEach(([provinceCode, provinceData]) => {
    if (provinceData.children) {
      Object.entries(provinceData.children).forEach(([cityCode, cityData]) => {
        if (cityData.children) {
          const districts = {};
          
          // 提取区县列表
          Object.entries(cityData.children).forEach(([districtCode, districtData]) => {
            districts[districtCode] = {
              code: districtData.code,
              name: districtData.name
            };
          });
          
          // 保存区县文件
          const districtFilePath = path.join(districtsDir, `${cityCode}.json`);
          fs.writeFileSync(districtFilePath, JSON.stringify(districts, null, 2), 'utf8');
          
          districtFilesCount++;
          districtTotalSize += fs.statSync(districtFilePath).size;
        }
      });
    }
  });
  
  console.log(`✅ 区县数据: ${districtsDir}/`);
  console.log(`   生成 ${districtFilesCount} 个文件`);
  console.log(`   总大小: ${(districtTotalSize / 1024).toFixed(2)} KB`);
  console.log(`   平均大小: ${(districtTotalSize / districtFilesCount / 1024).toFixed(2)} KB\n`);
  
  // 总结
  const originalSize = fs.statSync(path.join(__dirname, '..', 'data', 'regions.json')).size;
  const totalSize = fs.statSync(provincesPath).size + cityTotalSize + districtTotalSize;
  const totalFiles = 1 + cityFilesCount + districtFilesCount;
  
  console.log('='.repeat(60));
  console.log('📊 拆分完成统计：');
  console.log(`   原始文件: ${(originalSize / 1024).toFixed(2)} KB (1个文件)`);
  console.log(`   拆分后: ${(totalSize / 1024).toFixed(2)} KB (${totalFiles}个文件)`);
  console.log(`   首次加载: ~${(fs.statSync(provincesPath).size / 1024).toFixed(2)} KB (仅省份列表)`);
  console.log(`   按需加载: 平均 ~${((cityTotalSize + districtTotalSize) / (cityFilesCount + districtFilesCount) / 1024).toFixed(2)} KB/次`);
  console.log('='.repeat(60));
  
  // 生成新的 region-loader.js
  generateNewRegionLoader();
}

// 生成新的 region-loader.js（支持按需加载）
function generateNewRegionLoader() {
  const loaderCode = `// =================================================================
// 省市区数据加载器（按需加载版本）
// 优化：将大文件拆分为小文件，按需加载，提升性能
// =================================================================

const RegionLoader = (() => {
  // 缓存
  let provincesCache = null;
  const citiesCache = {};
  const districtsCache = {};
  
  const BASE_URL = 'data/regions/';
  
  /**
   * 加载省份列表
   */
  async function loadProvinces() {
    if (provincesCache) {
      return provincesCache;
    }
    
    try {
      const response = await fetch(BASE_URL + 'provinces.json');
      provincesCache = await response.json();
      return provincesCache;
    } catch (error) {
      console.error('加载省份数据失败:', error);
      return {};
    }
  }
  
  /**
   * 加载城市列表（按省份代码）
   */
  async function loadCities(provinceCode) {
    if (citiesCache[provinceCode]) {
      return citiesCache[provinceCode];
    }
    
    try {
      const response = await fetch(\`\${BASE_URL}cities/\${provinceCode}.json\`);
      const cities = await response.json();
      citiesCache[provinceCode] = cities;
      return cities;
    } catch (error) {
      console.error(\`加载城市数据失败: \${provinceCode}\`, error);
      return {};
    }
  }
  
  /**
   * 加载区县列表（按城市代码）
   */
  async function loadDistricts(cityCode) {
    if (districtsCache[cityCode]) {
      return districtsCache[cityCode];
    }
    
    try {
      const response = await fetch(\`\${BASE_URL}districts/\${cityCode}.json\`);
      const districts = await response.json();
      districtsCache[cityCode] = districts;
      return districts;
    } catch (error) {
      console.error(\`加载区县数据失败: \${cityCode}\`, error);
      return {};
    }
  }
  
  /**
   * 填充省份下拉框
   */
  async function populateProvinces(selectElement) {
    const provinces = await loadProvinces();
    
    selectElement.innerHTML = '<option value="">请选择省份</option>';
    
    Object.entries(provinces).forEach(([code, data]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = data.name;
      option.dataset.name = data.name;
      selectElement.appendChild(option);
    });
  }
  
  /**
   * 填充城市下拉框
   */
  async function populateCities(selectElement, provinceCode) {
    if (!provinceCode) {
      selectElement.innerHTML = '<option value="">请先选择省份</option>';
      selectElement.disabled = true;
      return;
    }
    
    const cities = await loadCities(provinceCode);
    
    selectElement.innerHTML = '<option value="">请选择城市</option>';
    selectElement.disabled = false;
    
    Object.entries(cities).forEach(([code, data]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = data.name;
      option.dataset.name = data.name;
      selectElement.appendChild(option);
    });
  }
  
  /**
   * 填充区县下拉框
   */
  async function populateDistricts(selectElement, cityCode) {
    if (!cityCode) {
      selectElement.innerHTML = '<option value="">请先选择城市</option>';
      selectElement.disabled = true;
      return;
    }
    
    const districts = await loadDistricts(cityCode);
    
    selectElement.innerHTML = '<option value="">请选择区县</option>';
    selectElement.disabled = false;
    
    Object.entries(districts).forEach(([code, data]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = data.name;
      option.dataset.name = data.name;
      selectElement.appendChild(option);
    });
  }
  
  /**
   * 初始化三级联动
   */
  function initCascade({ province, city, district }) {
    // 省份改变时
    province.addEventListener('change', async function() {
      const provinceCode = this.value;
      
      // 重置城市和区县
      city.innerHTML = '<option value="">请选择城市</option>';
      city.disabled = true;
      district.innerHTML = '<option value="">请选择区县</option>';
      district.disabled = true;
      
      if (provinceCode) {
        await populateCities(city, provinceCode);
      }
    });
    
    // 城市改变时
    city.addEventListener('change', async function() {
      const cityCode = this.value;
      
      // 重置区县
      district.innerHTML = '<option value="">请选择区县</option>';
      district.disabled = true;
      
      if (cityCode) {
        await populateDistricts(district, cityCode);
      }
    });
  }
  
  // 公共 API
  return {
    loadProvinces,
    loadCities,
    loadDistricts,
    populateProvinces,
    populateCities,
    populateDistricts,
    initCascade
  };
})();

// CommonJS 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RegionLoader;
}

console.log('%c🗺️ Region Loader (Lazy Loading) Loaded', 'color: #4CAF50; font-size: 12px;');
`;
  
  const loaderPath = path.join(__dirname, '..', 'js', 'region-loader-lazy.js');
  fs.writeFileSync(loaderPath, loaderCode, 'utf8');
  console.log(`\n✅ 新的加载器已生成: js/region-loader-lazy.js`);
  console.log('   支持按需加载，显著提升首次加载速度\n');
}

// 执行主函数
if (require.main === module) {
  splitRegionsData();
}

module.exports = { splitRegionsData };
