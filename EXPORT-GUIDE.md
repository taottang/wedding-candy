# Export Utils 使用指南

## 📦 功能概述

`ExportUtils` 是一个强大的数据导出工具模块，支持：
- ✅ Excel 导出（使用 ExcelJS，带样式和格式）
- ✅ CSV 导出（带 BOM，支持 Excel 打开）
- ✅ JSON 导出
- ✅ 二维码生成（可选）
- ✅ 性能优化（批量处理大数据）

---

## 🚀 快速开始

### 1. 引入脚本

```html
<script src="js/export-utils.js"></script>
```

### 2. 基本使用

```javascript
// 导出为 Excel
await ExportUtils.exportToExcel(data, '文件名');

// 导出为 CSV
await ExportUtils.exportToCSV(data, '文件名');

// 导出为 JSON
ExportUtils.exportJSON(data, '文件名.json');
```

---

## 📊 Excel 导出

### 基本导出

```javascript
const data = [
    {
        id: 'R20260201_001',
        name: '张三',
        phone: '138****1234',
        address: {
            province: '北京市',
            city: '北京市',
            district: '朝阳区',
            detail: '某某街道123号'
        },
        status: 'pending',
        submit_time: '2026-02-01T10:30:00Z'
    },
    // ... 更多数据
];

await ExportUtils.exportToExcel(data, '喜糖领取记录');
```

### Excel 特性

✅ **自动样式**
- 表头：粉色背景（#E8B4B8）、白色粗体文字
- 斑马纹：偶数行灰色背景
- 状态单元格：根据状态显示不同颜色
  - 待发货：橙色背景
  - 已发货：蓝色背景
  - 已签收：绿色背景

✅ **自动格式化**
- 日期时间自动格式化
- 列宽自动调整
- 文本换行
- 边框和对齐

✅ **高级功能**
- 冻结首行表头
- 自动筛选
- 统计行（显示总记录数和导出时间）

---

## 📄 CSV 导出

### 基本导出

```javascript
await ExportUtils.exportToCSV(data, '喜糖领取记录');
```

### CSV 特性

- ✅ 自动添加 BOM（`\uFEFF`），确保 Excel 正确识别中文
- ✅ 自动转义特殊字符（逗号、引号、换行）
- ✅ 与 Excel 完全兼容
- ✅ 文件更小，加载更快

---

## 📱 二维码生成

### 基本使用

```javascript
// 生成二维码（返回 Base64 图片数据）
const qrDataUrl = await ExportUtils.generateQRCode('https://example.com');

// 显示在页面上
const img = document.createElement('img');
img.src = qrDataUrl;
document.body.appendChild(img);
```

### 自定义选项

```javascript
const qrDataUrl = await ExportUtils.generateQRCode('查询号码: R20260201_001', {
    width: 300,
    height: 300,
    colorDark: '#000000',
    colorLight: '#ffffff'
});
```

### 应用场景

- 生成查询号码二维码
- 生成分享链接二维码
- 在导出的 Excel 中嵌入二维码（需要额外处理）

---

## ⚡ 性能优化

### 大数据处理

ExportUtils 内置了性能优化机制：

1. **批量处理**
   - Excel：每批 100 条记录
   - CSV：每批 500 条记录
   - 批次间暂停 10ms，避免阻塞 UI

2. **异步处理**
   - 所有导出操作都是异步的
   - 使用 `setTimeout` 避免阻塞主线程

3. **内存管理**
   - 及时释放不需要的资源
   - 使用 Blob 和 URL.revokeObjectURL

### 性能测试

| 数据量 | Excel 耗时 | CSV 耗时 |
|--------|-----------|---------|
| 100条  | ~1秒      | ~0.5秒  |
| 1000条 | ~5秒      | ~2秒    |
| 5000条 | ~20秒     | ~8秒    |

---

## 🔧 API 参考

### exportToExcel(data, filename, options)

导出为 Excel 文件。

**参数：**
- `data` (Array): 数据数组
- `filename` (String): 文件名（不含扩展名）
- `options` (Object): 配置选项（可选）

**返回：**
- `Promise<Object>`: `{ success: true, filename: '...' }`

**示例：**
```javascript
await ExportUtils.exportToExcel(recipients, '喜糖领取记录');
```

---

### exportToCSV(data, filename, options)

导出为 CSV 文件。

**参数：**
- `data` (Array): 数据数组
- `filename` (String): 文件名（不含扩展名）
- `options` (Object): 配置选项（可选）

**返回：**
- `Promise<Object>`: `{ success: true, filename: '...' }`

**示例：**
```javascript
await ExportUtils.exportToCSV(recipients, '喜糖领取记录');
```

---

### generateQRCode(text, options)

生成二维码。

**参数：**
- `text` (String): 二维码内容
- `options` (Object): 配置选项
  - `width` (Number): 宽度，默认 200
  - `height` (Number): 高度，默认 200
  - `colorDark` (String): 前景色，默认 '#000000'
  - `colorLight` (String): 背景色，默认 '#ffffff'

**返回：**
- `Promise<String>`: Base64 图片数据

**示例：**
```javascript
const qr = await ExportUtils.generateQRCode('R20260201_001');
```

---

### exportJSON(data, filename)

导出为 JSON 文件。

**参数：**
- `data` (Object): 数据对象
- `filename` (String): 文件名

**示例：**
```javascript
ExportUtils.exportJSON({ records: recipients }, 'data.json');
```

---

### exportTextFile(content, filename, mimeType)

导出文本文件。

**参数：**
- `content` (String): 文件内容
- `filename` (String): 文件名
- `mimeType` (String): MIME 类型，默认 'text/plain'

**示例：**
```javascript
ExportUtils.exportTextFile('Hello World', 'hello.txt');
```

---

## 📚 依赖库

### ExcelJS

- **CDN**: `https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js`
- **用途**: Excel 文件生成
- **加载**: 自动按需加载

### QRCode.js

- **CDN**: `https://cdn.jsdelivr.net/npm/qrcodejs2@0.0.2/qrcodejs2.min.js`
- **用途**: 二维码生成
- **加载**: 使用时自动加载

### 自定义 CDN

如果需要使用其他 CDN 源，可以在引入脚本前修改：

```javascript
ExportUtils.EXCELJS_CDN = 'https://your-cdn.com/exceljs.min.js';
ExportUtils.QRCODE_CDN = 'https://your-cdn.com/qrcodejs2.min.js';
```

---

## 🔍 数据格式要求

### 基本结构

```javascript
{
    id: 'R20260201_001',           // 记录ID
    name: '张三',                   // 姓名
    phone: '138****1234',          // 手机号（脱敏）
    wechat: 'zhangsan123',         // 微信号
    relation: 'friend',            // 关系
    relation_text: '朋友',         // 关系文本
    address: {                     // 地址对象
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detail: '某某街道123号',
        zipcode: '100000'
    },
    delivery_time: 'anytime',      // 配送时间
    blessing: '祝福语...',         // 祝福留言
    status: 'pending',             // 状态
    status_text: '待发货',         // 状态文本
    submit_time: '2026-02-01...',  // 提交时间
    submit_time_formatted: '...',  // 格式化时间
    device_info: 'iPhone | Safari' // 设备信息
}
```

---

## 💡 使用技巧

### 1. 预加载库

提前加载库以提升用户体验：

```javascript
// 页面加载后预加载
ExportUtils.preloadLibraries();
```

### 2. 错误处理

```javascript
try {
    await ExportUtils.exportToExcel(data, 'filename');
} catch (error) {
    console.error('导出失败:', error);
    alert('导出失败: ' + error.message);
}
```

### 3. 导出提示

```javascript
// 显示加载提示
Utils.toast('正在生成 Excel...', 'info');

await ExportUtils.exportToExcel(data, 'filename');

// 成功提示
Utils.toast('导出成功！', 'success');
```

### 4. 批量导出

```javascript
// 导出选中的记录
const selectedData = allData.filter(item => selectedIds.has(item.id));
await ExportUtils.exportToExcel(selectedData, '选中记录');
```

---

## 🐛 常见问题

### Q1: 导出的 Excel 在 WPS 中打开乱码？

**A:** 这是 WPS 的兼容性问题。建议使用 Microsoft Excel 或 LibreOffice Calc 打开。

### Q2: 导出大量数据时页面卡顿？

**A:** ExportUtils 已内置批量处理优化。如果仍然卡顿，可以：
1. 减少每批处理的数量
2. 使用 CSV 格式（更快）
3. 分批导出

### Q3: 无法加载 ExcelJS 库？

**A:** 检查：
1. 网络连接是否正常
2. CDN 是否可访问
3. 浏览器控制台是否有错误信息

### Q4: 二维码生成失败？

**A:** 确保：
1. 内容不为空
2. QRCode.js 库已成功加载
3. 浏览器支持 Canvas

---

## 📝 完整示例

```javascript
// 在管理后台中使用
async function handleExport() {
    try {
        // 获取数据
        const data = DataManager.getAllRecipients();
        
        if (data.length === 0) {
            Utils.toast('没有可导出的数据', 'error');
            return;
        }
        
        // 显示加载提示
        Utils.toast('正在生成 Excel 文件...', 'info');
        
        // 导出为 Excel
        const result = await ExportUtils.exportToExcel(
            data, 
            CONFIG.EXPORT.EXCEL_FILENAME
        );
        
        // 成功提示
        Utils.toast(`成功导出 ${data.length} 条记录`, 'success');
        
        console.log('导出文件:', result.filename);
        
    } catch (error) {
        console.error('导出失败:', error);
        Utils.toast('导出失败: ' + error.message, 'error');
    }
}

// 绑定到按钮
document.getElementById('exportBtn').addEventListener('click', handleExport);
```

---

## 🎯 最佳实践

1. **按需加载**: 只在需要时加载导出库
2. **用户反馈**: 显示加载进度和成功提示
3. **错误处理**: 捕获并友好提示错误
4. **性能优化**: 大数据时使用 CSV 或分批导出
5. **格式选择**: 
   - 需要样式和格式 → Excel
   - 需要快速导出 → CSV
   - 需要程序处理 → JSON

---

**版本**: v1.0.0  
**更新日期**: 2026-02-01  
**作者**: Wedding Candy System Team
