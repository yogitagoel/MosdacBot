const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const baseUrl = 'https://www.mosdac.gov.in';
  const results = [];
  const seenLinks = new Set();

  try {
    // Get sitemap URL from homepage
    const response = await axios.get(baseUrl);
    const $ = cheerio.load(response.data);
    const sitemapHref = $('#superfish-1 #menu-1978-1 a').attr('href');
    if (!sitemapHref) {
      console.log('Sitemap link not found.');
      return;
    }
    const sitemapUrl = sitemapHref.startsWith('http') ? sitemapHref : `${baseUrl}${sitemapHref}`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(sitemapUrl, { waitUntil: 'networkidle2' });

    const sitemapHtml = await page.content();
    const $$ = cheerio.load(sitemapHtml);
    const linksToVisit = [];

    // Extract top-level links from sitemap
    $$('.content .site-map-menu li.expanded ul li a').each((_, el) => {
      const link = $$(el).attr('href');
      const text = $$(el).text().trim();
      if (link && text) {
        const fullLink = link.startsWith('http') ? link : `${baseUrl}${link}`;
        if (!seenLinks.has(fullLink)) {
          seenLinks.add(fullLink);
          linksToVisit.push({ title: text, url: fullLink });
        }
      }
    });

    // Visit each top-level link
    for (const { title, url } of linksToVisit) {
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        const pageHtml = await page.content();
        const $$$ = cheerio.load(pageHtml);

        const content1 = $$$('#content .field-item.even p').text().replace(/\s+/g, ' ').trim();
        const content2 = $$$('#content .field-item.even ol li').text().replace(/\s+/g, ' ').trim();
        if(content1 || content2){
          results.push({ title, url, content1, content2 });
        console.log(`✅ Main Page: ${title}`);
        console.log(`📄 content1: ${content1}`);
        console.log(`📄 content2: ${content2}`);

        // Visit sidebar links of this page
        const sidebarLinks = $$$('.content .menu .clearfix ul li a');

        for (let i = 0; i < sidebarLinks.length; i++) {
          const sidebarHref = $$$(sidebarLinks[i]).attr('href');
          const sidebarTitle = $$$(sidebarLinks[i]).text().trim();
          if (!sidebarHref) continue;

          const fullSidebarUrl = sidebarHref.startsWith('http') ? sidebarHref : `${baseUrl}${sidebarHref}`;
          if (seenLinks.has(fullSidebarUrl)) continue;
          seenLinks.add(fullSidebarUrl);

          try {
            await page.goto(fullSidebarUrl, { waitUntil: 'networkidle2', timeout: 30000 });
            const sbHtml = await page.content();
            const $$$$ = cheerio.load(sbHtml);

            const sbContent1 = $$$$('.field-item p').text().replace(/\s+/g, ' ').trim();

            console.log(`🔹 Sidebar: ${sidebarTitle}`);
            console.log(`📄 content1: ${sbContent1}`);

            results.push({
              title: sidebarTitle || '(sidebar)',
              url: fullSidebarUrl,
              content1: sbContent1
            });

          } catch (sbErr) {
            console.warn(`⚠️ Failed to load sidebar link ${fullSidebarUrl}: ${sbErr.message}`);
          }
        }

      } 
        }
        catch (err) {
        console.warn(`⚠️ Failed to fetch ${url}: ${err.message}`);
      }
    }

    await browser.close();
    fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
    console.log('\n✅ All data saved to output.json');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
