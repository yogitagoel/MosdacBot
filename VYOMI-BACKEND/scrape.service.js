const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

const MAX_DEPTH = 2; // Limit crawl depth to avoid infinite loops

async function extractPageData(page, url, title, baseUrl, seenLinks, depth = 1) {
  if (depth > MAX_DEPTH) return [];
  const results = [];
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const html = await page.content();
    const $ = cheerio.load(html);

    // Extract main text content
    const content1 = $('#content .field-item.even p').text().replace(/\s+/g, ' ').trim();
    const content2 = $('#content .field-item.even ol li').text().replace(/\s+/g, ' ').trim();

    // Extract tables
    const tables = [];
    $('#content table').each((i, table) => {
      const tableData = [];
      $(table)
        .find('tr')
        .each((j, row) => {
          const rowData = [];
          $(row)
            .find('th, td')
            .each((k, cell) => {
              rowData.push($(cell).text().replace(/\s+/g, ' ').trim());
            });
          if (rowData.length) tableData.push(rowData);
        });
      if (tableData.length) tables.push(tableData);
    });

    // Extract meta tags
    const meta = {};
    $('meta').each((i, el) => {
      const name = $(el).attr('name') || $(el).attr('property');
      const content = $(el).attr('content');
      if (name && content) meta[name] = content;
    });

    // Extract ARIA/accessibility tags
    const aria = [];
    $('[aria-label]').each((i, el) => {
      aria.push($(el).attr('aria-label'));
    });

    // Extract document links (PDF, DOCX, XLSX)
    const docLinks = [];
    $('a[href$=".pdf"], a[href$=".docx"], a[href$=".xlsx"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        const fullHref = href.startsWith('http') ? href : `${baseUrl}${href}`;
        docLinks.push(fullHref);
      }
    });

    results.push({
      title,
      url,
      content1,
      content2,
      tables,
      meta,
      aria,
      docLinks
    });

    // Crawl deeper links within the page (limit to same domain, avoid seenLinks)
    const pageLinks = [];
    $('a[href^="/"], a[href^="https://www.mosdac.gov.in"]').each((i, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      const fullUrl = href.startsWith('http') ? href : `${baseUrl}${href}`;
      if (!seenLinks.has(fullUrl)) {
        seenLinks.add(fullUrl);
        pageLinks.push(fullUrl);
      }
    });
    for (const link of pageLinks) {
      const subResults = await extractPageData(page, link, '', baseUrl, seenLinks, depth + 1);
      results.push(...subResults);
    }
  } catch (err) {
    console.warn(`⚠️ Failed to fetch ${url}: ${err.message}`);
  }
  return results;
}

(async () => {
  const baseUrl = 'https://www.mosdac.gov.in';
  const results = [];
  const seenLinks = new Set();
  const MAX_DEPTH = 2;

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

    // Visit each top-level link and crawl deeper
    for (const { title, url } of linksToVisit) {
      const pageResults = await extractPageData(page, url, title, baseUrl, seenLinks, 1);
      results.push(...pageResults);
    }

    await browser.close();
    fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
    console.log('\n✅ All data saved to output.json');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
