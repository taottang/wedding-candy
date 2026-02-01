// =================================================================
// SEO优化模块 - SEO Optimizer
// Meta标签管理、结构化数据、站点地图生成
// =================================================================

const SEOOptimizer = (() => {
    // 基础配置
    const CONFIG = {
        siteName: '婚礼喜糖领取系统',
        siteUrl: 'https://your-domain.com',
        coupleName: '邓蓓 & 唐韬',
        weddingDate: '2026-02-01',
        defaultImage: 'assets/images/og-image.jpg',
        defaultDescription: '邓蓓 & 唐韬的婚礼喜糖在线领取系统，填写信息即可免费领取精美喜糖礼盒',
        keywords: '婚礼喜糖,婚礼礼品,在线领取,婚礼祝福',
        twitterHandle: '@wedding',
        fbAppId: ''
    };

    // 页面特定的SEO配置
    const PAGE_CONFIG = {
        'index.html': {
            title: `${CONFIG.coupleName} 婚礼喜糖领取 | ${CONFIG.siteName}`,
            description: CONFIG.defaultDescription,
            keywords: '婚礼喜糖,喜糖领取,婚礼礼品,婚礼祝福',
            type: 'website'
        },
        'form.html': {
            title: `填写领取信息 | ${CONFIG.siteName}`,
            description: '填写您的收货信息，我们将尽快为您寄送精美喜糖礼盒',
            keywords: '喜糖领取,收货地址,婚礼礼品',
            type: 'website'
        },
        'success.html': {
            title: `提交成功 | ${CONFIG.siteName}`,
            description: '您的信息已成功提交，我们将尽快为您安排配送',
            keywords: '提交成功,喜糖配送',
            type: 'website'
        },
        'privacy.html': {
            title: `隐私政策 | ${CONFIG.siteName}`,
            description: '我们重视您的隐私，了解我们如何收集、使用和保护您的个人信息',
            keywords: '隐私政策,个人信息保护,数据安全',
            type: 'article'
        }
    };

    /**
     * 设置基础Meta标签
     */
    function setupBasicMeta() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageConfig = PAGE_CONFIG[currentPage] || PAGE_CONFIG['index.html'];

        // 设置页面标题
        document.title = pageConfig.title;

        // Meta标签配置
        const metaTags = [
            { name: 'description', content: pageConfig.description },
            { name: 'keywords', content: pageConfig.keywords },
            { name: 'author', content: CONFIG.coupleName },
            { name: 'robots', content: 'index, follow' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0' },
            { charset: 'UTF-8' },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
            
            // 移动端优化
            { name: 'mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
            { name: 'apple-mobile-web-app-title', content: CONFIG.siteName },
            { name: 'format-detection', content: 'telephone=no' },
            
            // 主题颜色
            { name: 'theme-color', content: '#FFE6E6' },
            { name: 'msapplication-TileColor', content: '#FFE6E6' },
        ];

        // 添加或更新Meta标签
        metaTags.forEach(tag => {
            let element;
            
            if (tag.charset) {
                element = document.querySelector('meta[charset]');
                if (!element) {
                    element = document.createElement('meta');
                    element.setAttribute('charset', tag.charset);
                    document.head.insertBefore(element, document.head.firstChild);
                }
            } else if (tag['http-equiv']) {
                element = document.querySelector(`meta[http-equiv="${tag['http-equiv']}"]`);
                if (!element) {
                    element = document.createElement('meta');
                    element.setAttribute('http-equiv', tag['http-equiv']);
                    document.head.appendChild(element);
                }
                element.setAttribute('content', tag.content);
            } else if (tag.name) {
                element = document.querySelector(`meta[name="${tag.name}"]`);
                if (!element) {
                    element = document.createElement('meta');
                    element.setAttribute('name', tag.name);
                    document.head.appendChild(element);
                }
                element.setAttribute('content', tag.content);
            }
        });

        console.log('%c🔍 基础SEO Meta标签已设置', 'color: #9C27B0;');
    }

    /**
     * 设置Open Graph标签
     */
    function setupOpenGraph() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageConfig = PAGE_CONFIG[currentPage] || PAGE_CONFIG['index.html'];
        const currentUrl = `${CONFIG.siteUrl}/${currentPage}`;

        const ogTags = [
            { property: 'og:type', content: pageConfig.type },
            { property: 'og:title', content: pageConfig.title },
            { property: 'og:description', content: pageConfig.description },
            { property: 'og:url', content: currentUrl },
            { property: 'og:site_name', content: CONFIG.siteName },
            { property: 'og:image', content: `${CONFIG.siteUrl}/${CONFIG.defaultImage}` },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:image:alt', content: pageConfig.title },
            { property: 'og:locale', content: 'zh_CN' },
        ];

        // 添加婚礼特定信息
        if (currentPage === 'index.html') {
            ogTags.push(
                { property: 'og:type', content: 'website' },
                { property: 'article:author', content: CONFIG.coupleName },
                { property: 'article:published_time', content: CONFIG.weddingDate }
            );
        }

        // 如果有Facebook App ID
        if (CONFIG.fbAppId) {
            ogTags.push({ property: 'fb:app_id', content: CONFIG.fbAppId });
        }

        // 添加或更新OG标签
        ogTags.forEach(tag => {
            let element = document.querySelector(`meta[property="${tag.property}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('property', tag.property);
                document.head.appendChild(element);
            }
            element.setAttribute('content', tag.content);
        });

        console.log('%c📘 Open Graph标签已设置', 'color: #3b5998;');
    }

    /**
     * 设置Twitter Card标签
     */
    function setupTwitterCard() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageConfig = PAGE_CONFIG[currentPage] || PAGE_CONFIG['index.html'];

        const twitterTags = [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: CONFIG.twitterHandle },
            { name: 'twitter:creator', content: CONFIG.twitterHandle },
            { name: 'twitter:title', content: pageConfig.title },
            { name: 'twitter:description', content: pageConfig.description },
            { name: 'twitter:image', content: `${CONFIG.siteUrl}/${CONFIG.defaultImage}` },
            { name: 'twitter:image:alt', content: pageConfig.title },
        ];

        // 添加或更新Twitter标签
        twitterTags.forEach(tag => {
            let element = document.querySelector(`meta[name="${tag.name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('name', tag.name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', tag.content);
        });

        console.log('%c🐦 Twitter Card标签已设置', 'color: #1DA1F2;');
    }

    /**
     * 添加结构化数据 (JSON-LD)
     */
    function addStructuredData() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        let structuredData = {};

        if (currentPage === 'index.html') {
            // 婚礼活动
            structuredData = {
                '@context': 'https://schema.org',
                '@type': 'Event',
                'name': `${CONFIG.coupleName}的婚礼`,
                'description': CONFIG.defaultDescription,
                'startDate': CONFIG.weddingDate,
                'endDate': CONFIG.weddingDate,
                'eventStatus': 'https://schema.org/EventScheduled',
                'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
                'organizer': {
                    '@type': 'Person',
                    'name': CONFIG.coupleName
                },
                'offers': {
                    '@type': 'Offer',
                    'price': '0',
                    'priceCurrency': 'CNY',
                    'availability': 'https://schema.org/InStock',
                    'url': `${CONFIG.siteUrl}/form.html`
                },
                'image': `${CONFIG.siteUrl}/${CONFIG.defaultImage}`
            };
        } else if (currentPage === 'privacy.html') {
            // 网页
            structuredData = {
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                'name': PAGE_CONFIG[currentPage].title,
                'description': PAGE_CONFIG[currentPage].description,
                'url': `${CONFIG.siteUrl}/${currentPage}`,
                'inLanguage': 'zh-CN',
                'isPartOf': {
                    '@type': 'WebSite',
                    'name': CONFIG.siteName,
                    'url': CONFIG.siteUrl
                }
            };
        } else {
            // 通用网站
            structuredData = {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                'name': CONFIG.siteName,
                'url': CONFIG.siteUrl,
                'description': CONFIG.defaultDescription,
                'inLanguage': 'zh-CN',
                'copyrightYear': new Date().getFullYear(),
                'author': {
                    '@type': 'Person',
                    'name': CONFIG.coupleName
                }
            };
        }

        // 添加面包屑导航（如果适用）
        if (currentPage !== 'index.html') {
            const breadcrumb = {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'name': '首页',
                        'item': `${CONFIG.siteUrl}/index.html`
                    },
                    {
                        '@type': 'ListItem',
                        'position': 2,
                        'name': PAGE_CONFIG[currentPage]?.title || '当前页',
                        'item': `${CONFIG.siteUrl}/${currentPage}`
                    }
                ]
            };

            addJSONLD(breadcrumb, 'breadcrumb');
        }

        // 添加主要结构化数据
        addJSONLD(structuredData, 'main');

        console.log('%c📊 结构化数据已添加', 'color: #9C27B0;');
    }

    /**
     * 添加JSON-LD脚本
     */
    function addJSONLD(data, id) {
        // 删除旧的脚本（如果存在）
        const oldScript = document.getElementById(`json-ld-${id}`);
        if (oldScript) {
            oldScript.remove();
        }

        // 创建新脚本
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = `json-ld-${id}`;
        script.textContent = JSON.stringify(data, null, 2);
        document.head.appendChild(script);
    }

    /**
     * 添加Canonical链接
     */
    function addCanonicalLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const canonicalUrl = `${CONFIG.siteUrl}/${currentPage}`;

        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', canonicalUrl);

        console.log('%c🔗 Canonical链接已添加:', 'color: #9C27B0;', canonicalUrl);
    }

    /**
     * 添加其他重要链接
     */
    function addImportantLinks() {
        const links = [
            // Favicon
            { rel: 'icon', type: 'image/x-icon', href: 'assets/images/favicon.ico' },
            { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'assets/images/favicon-32x32.png' },
            { rel: 'icon', type: 'image/png', sizes: '16x16', href: 'assets/images/favicon-16x16.png' },
            { rel: 'apple-touch-icon', sizes: '180x180', href: 'assets/images/apple-touch-icon.png' },
            
            // Web App Manifest
            { rel: 'manifest', href: 'manifest.json' },
        ];

        links.forEach(linkData => {
            const selector = linkData.sizes 
                ? `link[rel="${linkData.rel}"][sizes="${linkData.sizes}"]`
                : `link[rel="${linkData.rel}"]`;
            
            let link = document.querySelector(selector);
            if (!link) {
                link = document.createElement('link');
                document.head.appendChild(link);
            }
            
            Object.keys(linkData).forEach(attr => {
                link.setAttribute(attr, linkData[attr]);
            });
        });
    }

    /**
     * 生成站点地图（客户端版本 - 仅用于展示）
     */
    function generateSitemap() {
        const pages = [
            { loc: 'index.html', priority: '1.0', changefreq: 'weekly' },
            { loc: 'form.html', priority: '0.9', changefreq: 'weekly' },
            { loc: 'success.html', priority: '0.5', changefreq: 'monthly' },
            { loc: 'privacy.html', priority: '0.6', changefreq: 'monthly' },
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `    <url>
        <loc>${CONFIG.siteUrl}/${page.loc}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`).join('\n')}
</urlset>`;

        return sitemap;
    }

    /**
     * 生成robots.txt内容
     */
    function generateRobotsTxt() {
        return `User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /test.html

Sitemap: ${CONFIG.siteUrl}/sitemap.xml`;
    }

    /**
     * 下载站点地图和robots.txt（开发用）
     */
    function downloadSEOFiles() {
        // 下载sitemap.xml
        const sitemap = generateSitemap();
        downloadFile('sitemap.xml', sitemap, 'application/xml');

        // 下载robots.txt
        const robotsTxt = generateRobotsTxt();
        downloadFile('robots.txt', robotsTxt, 'text/plain');

        console.log('%c✅ SEO文件已生成并下载', 'color: #4CAF50;');
    }

    /**
     * 下载文件辅助函数
     */
    function downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * 优化页面加载性能（SEO相关）
     */
    function optimizePageLoad() {
        // 预加载关键资源
        const preloadLinks = [
            { href: 'css/theme.css', as: 'style' },
            { href: 'js/utils.js', as: 'script' },
        ];

        preloadLinks.forEach(link => {
            const preload = document.createElement('link');
            preload.rel = 'preload';
            preload.href = link.href;
            preload.as = link.as;
            document.head.appendChild(preload);
        });
    }

    /**
     * 初始化所有SEO优化
     */
    function init(customConfig = {}) {
        // 合并自定义配置
        Object.assign(CONFIG, customConfig);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initSEO();
            });
        } else {
            initSEO();
        }
    }

    /**
     * 执行SEO初始化
     */
    function initSEO() {
        // 设置基础Meta标签
        setupBasicMeta();

        // 设置Open Graph
        setupOpenGraph();

        // 设置Twitter Card
        setupTwitterCard();

        // 添加结构化数据
        addStructuredData();

        // 添加Canonical链接
        addCanonicalLink();

        // 添加重要链接
        addImportantLinks();

        // 优化页面加载
        optimizePageLoad();

        console.log('%c🔍 SEO优化已全部启用', 'color: #9C27B0; font-weight: bold;');
    }

    // 返回公共API
    return {
        init,
        setupBasicMeta,
        setupOpenGraph,
        setupTwitterCard,
        addStructuredData,
        generateSitemap,
        generateRobotsTxt,
        downloadSEOFiles
    };
})();

// 自动初始化
if (typeof window !== 'undefined') {
    window.SEOOptimizer = SEOOptimizer;
    
    // 从配置文件读取配置（如果存在）
    if (window.CONFIG) {
        SEOOptimizer.init({
            siteName: window.CONFIG.SITE_NAME,
            siteUrl: window.CONFIG.SITE_URL || 'https://your-domain.com',
            coupleName: `${window.CONFIG.BRIDE_NAME} & ${window.CONFIG.GROOM_NAME}`,
            weddingDate: window.CONFIG.WEDDING_DATE
        });
    } else {
        SEOOptimizer.init();
    }
}

// CommonJS导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOOptimizer;
}

console.log('%c🔍 SEO Optimizer Loaded', 'color: #9C27B0; font-size: 12px;');
