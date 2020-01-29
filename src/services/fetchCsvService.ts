import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import expect from 'expect-puppeteer';

export async function deleteFile(filepath: string) {
        fs.unlinkSync(filepath);
}

export async function fetchCsvService(
    URL: string,
    username: string,
    password: string,
    date: string,
): Promise<string> {
    const browserFetcher = puppeteer.createBrowserFetcher();
    const localChromiums = await browserFetcher.localRevisions();
    const { executablePath } = browserFetcher.revisionInfo(localChromiums[0]);

    const browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--disable-extensions'],
        executablePath
    });
    const page = await browser.newPage();
    // トップページ表示
    await page.goto(`${URL}/login`);
    // ログイン処理
    await page.type('input[name="login_id"]', username);
    await page.type('input[name="password"]', password);
    page.$eval('form[name="form1"]', (form : any) => (form as any).submit())
    await page.waitForSelector('span[class="monthTxtOn"]', { visible: true });
    // 予約者ページへの遷移
    await page.goto(geturl(URL, date), {
        waitUntil: 'domcontentloaded'
    })
    const filePath = await download(page, 'input[name="xls"]')
    browser.close();
    return filePath;
}

function geturl(url: string, date: string): string {
    const today = date;
    return `${url}/cm/book_search/?booking_kind_booked=1&booking_kind_modified=1&stay_start=&stay_end=&checkin_start=${today}&checkin_end=${today}&checkout_start=&checkout_end=&reserve_start=&reserve_end=&cancel_start=&cancel_end=&modify_start=&modify_end=&booking_num=&name=&name_kana=&booker_name=&booker_name_kana=&email=&tel=&total_amount_min=&total_amount_max=&charge_amount_min=&charge_amount_max=&point_used_min=&point_used_max=&memo=&card=2&free_word=&keyword_type=AND&Submit=%E6%A4%9C%E7%B4%A2&mode=search&rwith_enable=1`
}
async function download(page: any, selector: string) {
    await (page as any)._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: './data' })
    await expect(page).toClick(selector)
    let filename = await waitForFileToDownload('./data')
    return path.resolve('./data', filename)
}

async function waitForFileToDownload(downloadPath: string) {
    let filename
    while (!filename || filename.endsWith('.crdownload')) {
        filename = fs.readdirSync(downloadPath)[0]
        await sleep(500);
    }
    return filename
}

function sleep(milliSeconds: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, milliSeconds);
  });
}
