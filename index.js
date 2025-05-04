import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // ou false se quiser ver o navegador
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.goto('https://cbengine.com.br/categorias/');

  // exemplo: capturar os títulos das categorias
  const categorias = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.categoria .titulo')).map(el => el.textContent.trim());
  });

  console.log('Categorias:', categorias);

  await browser.close();
})();
