import puppeteer from 'puppeteer';

const run = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  const url = 'https://cbengine.com/search.html?log_srch=yes&cm=32&cs=toponly&rt=30&kw=&op=AND&field=any&du=&dp=y&ap=0&ao=Or&am=65&sc=rank&so=asc&sort=&c1c=mntm&c1o=GT&c1v=0&mode=cathop&recurring=';

  await page.goto(url, { waitUntil: 'networkidle2' });

  const produtos = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tr td table tr'));
    return rows
      .map(row => {
        const nome = row.querySelector('a[href^="/product/"]')?.innerText?.trim();
        const link = row.querySelector('a[href^="/product/"]')?.href;
        const apvMatch = row.innerHTML.match(/APV:\s*\$?([0-9.,]+)/);
        const epcMatch = row.innerHTML.match(/EPC:\s*\$?([0-9.,]+)/);
        const gravidadeMatch = row.innerHTML.match(/Gravity:\s*([0-9.,]+)/);
        if (!nome || !link) return null;
        return {
          nome,
          link: `https://cbengine.com${new URL(link).pathname}`,
          APV: apvMatch?.[1] || 'N/A',
          EPC: epcMatch?.[1] || 'N/A',
          Gravidade: gravidadeMatch?.[1] || 'N/A'
        };
      })
      .filter(Boolean);
  });

  console.log(JSON.stringify(produtos, null, 2));
  await browser.close();
};

run();
