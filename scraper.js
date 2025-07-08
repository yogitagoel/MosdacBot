const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const baseUrl = 'https://www.mosdac.gov.in';
  const results = [];
  const seenLinks = new Set();

  try {
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

    for (const { title, url } of linksToVisit) {
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        const pageHtml = await page.content();
        const $$$ = cheerio.load(pageHtml);

        const content1 = $$$('#content .field-item.even p').text().replace(/\s+/g, ' ').trim();
        const content2 = $$$('#content .field-item.even ol li').text().replace(/\s+/g, ' ').trim();

        if (content1 || content2) {
          results.push({ title, url, content1, content2 });
        }

        // Extract any tables from the main page
$$$('table').each((tableIndex, table) => {
  const headers = [];
  const tableData = [];

  $$$(table).find('thead tr th').each((i, th) => {
    headers.push($$$(th).text().trim());
  });

  $$$(table).find('tbody tr').each((i, row) => {
    const rowData = {};
    $$$(row).find('td').each((j, cell) => {
      const cellKey = headers[j] || `col_${j}`;
const cellLinks = [];

// Extract all <a href="..."> links in the cell
$$$(cell).find('a').each((_, a) => {
  const href = $$$(a).attr('href');
  if (href) {
    const fullLink = href.startsWith('http') ? href : `${baseUrl}${href}`;
    cellLinks.push(fullLink);
  }
});

const cellText = $$$(cell).text().trim();

// Store text + links (if links found), else just text
if (cellLinks.length > 0) {
  rowData[cellKey] = {
    text: cellText,
    links: cellLinks
  };
} else {
  rowData[cellKey] = cellText;
}

    });
    tableData.push(rowData);
  });

  if (headers.length > 0 && tableData.length > 0) {
    const mainTableResult = {
      title: `${title} - Table ${tableIndex}`,
      url,
      table_index: tableIndex,
      headers,
      rows: tableData
    };
    results.push(mainTableResult);
  }
});

const imageLinks = [];
$$$('img').each((_, img) => {
  const src = $$$(img).attr('src');
  if (src) {
    const fullSrc = src.startsWith('http') ? src : `${baseUrl}${src}`;
    imageLinks.push(fullSrc);
  }
});

results.push({
  title,
  url,
  content1,
  content2,
  images: imageLinks
});


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

            const sbContent1 = $$$$('.field-item').text().replace(/\s+/g, ' ').trim();
            
            const sidebarLinks = [];
$$$$('.field-item a').each((_, a) => {
  const href = $$$$(a).attr('href');
  if (href) {
    const fullLink = href.startsWith('http') ? href : `${baseUrl}${href}`;
    sidebarLinks.push(fullLink);
  }
});

            if (sbContent1) {
              results.push({
                title: sidebarTitle || '(sidebar)',
                url: fullSidebarUrl,
                content1: sbContent1,
                links: sidebarLinks
              });
            }

            $$$$('table').each((tableIndex, table) => {
              const headers = [];
              const tableData = [];

              $$$$(table).find('thead tr th').each((i, th) => {
                headers.push($$$$(th).text().trim());
              });

              $$$$(table).find('tbody tr').each((i, row) => {
                const rowData = {};
                $$$$(row).find('td').each((j, cell) => {
                  const cellKey = headers[j] || `col_${j}`;
  const cellLinks = [];

  $$$$(cell).find('a').each((_, a) => {
    const href = $$$$(a).attr('href');
    if (href) {
      const fullLink = href.startsWith('http') ? href : `${baseUrl}${href}`;
      cellLinks.push(fullLink);
    }
  });

  const cellText = $$$$(cell).text().trim();

  if (cellLinks.length > 0) {
    rowData[cellKey] = {
      text: cellText,
      links: cellLinks
    };
  } else {
    rowData[cellKey] = cellText;
  }
                });
                tableData.push(rowData);
              });

              if (headers.length > 0 && tableData.length > 0) {
                const sidebarTableResult = {
                  title: `${sidebarTitle} - Table ${tableIndex}`,
                  url: fullSidebarUrl,
                  table_index: tableIndex,
                  headers,
                  rows: tableData
                };

                results.push(sidebarTableResult);
              }
            });
          } catch (sbErr) {
            console.warn(`⚠️ Failed to load sidebar link ${fullSidebarUrl}: ${sbErr.message}`);
          }
        }
      } catch (err) {
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
