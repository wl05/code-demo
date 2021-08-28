const axios = require('axios')
const puppeteer = require('puppeteer')
const fs = require('fs')
const utils = require('./utils')
const { url, headers } = require('./constants')

const request = axios.create({
  timeout: 10000,
  headers
})

const requestHistoryArticleList = async () => {
  try {
    const res = await request.request({
      url,
      method: 'GET'
    })
    return res.data.app_msg_list
  } catch (error) {
    console.log(error)
  }
}

const requestArticleDetail = async url => {
  try {
    // 解决无法启动的问题 https://github.com/puppeteer/puppeteer/issues/5992
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto(url)

    await page.waitForSelector('#js_content')
    const options = (await page.$$eval('p', options => options.map(option => option.textContent))).filter(str => {
      return /日微语简报/.test(str) || /^[0-9]+、/.test(str) || /【微语】/.test(str)
    })

    console.log(JSON.stringify(options))
    const time = options.shift()
    const weiyu = options.pop()

    const html = utils.formatHtmlStr(utils.formatDateStr(time.split('，')[2]), utils.formatContentStr(options), utils.formatWeiyuStr(weiyu))
    fs.writeFileSync('./html/res.html', html)

    await page.setContent(html)
    await page.setViewport({
      width: 750,
      height: 1080
    })
    await page.screenshot({ path: 'weiyu.png', fullPage: true })
    await page.close()
    await browser.close()
  } catch (error) {
    console.log(error)
  }
}

const stater = async () => {
  //   utils.pushToGitLab()
  const historyArticleList = await requestHistoryArticleList()
  const newestArticle = historyArticleList.find(arr => {
    return /日微语简报/.test(arr.title)
  })
  if (newestArticle) {
    await requestArticleDetail(newestArticle.link)
  }
}

stater()
