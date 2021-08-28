const axios = require('axios')
const puppeteer = require('puppeteer')
const fs = require('fs')
const html2canvas = require('html2canvas')

const htmlStr = frameData => `<!DOCTYPE html>
<html>
  <head>
    <style>
      * {
        padding: 0;
        margin: 0;
      }
      .container {
        /* width: 750px; */
      }
      .template {
        /* width: 750px; */
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img class="template" src="../html/template.png" />
      ${frameData}
    </div>
  </body>
</html>
`

// # 目标url
const url =
  'https://mp.weixin.qq.com/cgi-bin/appmsg?action=list_ex&begin=0&count=5&fakeid=MzIzMzExMjQxMA==&type=9&query=&token=720228344&lang=zh_CN&f=json&ajax=1'

// # 使用Cookie，跳过登陆操作
const headers = {
  Cookie:
    'appmsglist_action_3863671028=card; rewardsn=; wxtokenkey=777; cert=hnZ41d9LbxOJM0qxaChzE3FnJkw_9ym7; wxuin=28999288770686; ua_id=KrwCbyZh8tYJ3JE9AAAAALgd99_Hm2f4zCgVQlVn8J0=; mm_lang=zh_CN; OUTFOX_SEARCH_USER_ID_NCOO=2054206066.4636347; tvfe_boss_uuid=4316bd3565a8909c; pgv_pvid=1698764542; pgv_info=ssid=s9934595459; media_ticket=74fc2743c669e1805a28b0da169e96113ab0862f; media_ticket_id=gh_41f799bb6fc9; noticeLoginFlag=1; remember_acct=2929712050@qq.com; uin=o2929712050; skey=@fNBn6aNyg; RK=cWql7p4v5L; ptcz=49b3de96a628f8a15afad72182a14220ad9eab63bc1e56eea6884714812c903d; idqq_account=theCanChange=0;theShowUin=2929712050;shouldshowmail=1;firstsetidqq=1;MSK=0;; sig=h01292d4618e8c9a6e189bb2be46a7304afd43ea3f277587954e0099371c6db1309e45e0af5988c6800; master_key=rf9fGykO3CHCBPanmLn0MUum/OS8C3qrchAj5A9NzMc=; uuid=a0c4b0a362fecef9e46b11601c7757a1; rand_info=CAESIEM/bnPzFY0dt9M0qPmLEQhe85qlrOkikGO/ubHggFYd; slave_bizuin=3863671028; data_bizuin=3863671028; bizuin=3863671028; data_ticket=7sBDrNcCYn4Vke2aXmldMkm2fU2vJsvx1lyO7RGx+vjTc5HPRgXGCLWe4OiNV4VQ; slave_sid=eDBMQzNmZDl6MTF2Vkg5bUFpeU83RklDTTJfa2t5WVNFamw3Sl8wMThFZkhfbFJtcmhORzZLaGpKQzBxTUVvVllhMTJYNHVjbjZHTGY3cWxrV0ViemxKVW1MNng4UnE1d0hqSEpuTlZTWmcyYWtqcjhaQTh5TkRiR01Tam1HeFF4UGY4UlVZSmk3eDlySk1j; slave_user=gh_7772bbd118ba; xid=18d68c1daf67299210323e9d39e12c6f',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
}

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
    console.log(res)
    return res.data.app_msg_list
  } catch (error) {
    console.log('===error===', error)
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

    console.log(options)

    const html = htmlStr(
      options.reduce((pre, cur) => {
        return pre + `<p>${cur}</p>`
      }, '')
    )

    // fs.writeFileSync('./html/index.html', html)
    await page.setContent(html)
    await page.screenshot({ path: 'example.png' })
    await page.close()
    await browser.close()
  } catch (error) {
    console.log('=========', error)
  }
}

const stater = async () => {
  const historyArticleList = await requestHistoryArticleList()
  console.log('===historyArticleList===', historyArticleList)
  const newestArticle = historyArticleList.find(arr => {
    return /日微语简报/.test(arr.title)
  })
  if (newestArticle) {
    await requestArticleDetail(newestArticle.link)
  }
}

stater()
