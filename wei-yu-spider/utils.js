const { execSync } = require('child_process')
const utils = {
  formatterWeekDay() {
    const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    return weekdays[new Date().getDay()]
  },
  formatterYearMonthDay() {
    // 添加分隔符“-”
    const separator = '.'
    // 获取当前日期
    const date = new Date()
    // 获取当前月份
    let nowMonth = date.getMonth() + 1
    // 获取当前是几号
    let strDate = date.getDate()
    // 对月份进行处理，1-9月在前面添加一个“0”
    if (nowMonth < 10) {
      nowMonth = '0' + nowMonth
    }
    // 对月份进行处理，1-9号在前面添加一个“0”
    if (strDate < 10) {
      strDate = '0' + strDate
    }
    // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
    return date.getFullYear() + separator + nowMonth + separator + strDate
  },
  formatDateStr(nongLi) {
    return `${this.formatterYearMonthDay()} | ${this.formatterWeekDay()} | ${nongLi}`
  },
  formatWeiyuStr(weiyuStr) {
    const res = weiyuStr
      .replace(/【微语】/, '')
      .split('。')
      .filter(val => !!val)
    return res.reduce((pre, cur) => {
      return pre + `<p>${cur}</p>`
    }, '')
  },
  formatContentStr(contents) {
    return contents.reduce((pre, cur, index) => {
      let res = cur.split('、')
      res.shift()
      res = res.join('、')

      return pre + `<p>${index}.${res}</p>`
    }, '')
  },
  formatHtmlStr(dateStr, contentStr, weiyuStr) {
    return `<!DOCTYPE html>
        <html>
        <head>
            <style>
            * {
                padding: 0;
                margin: 0;
            }
            .container {
                display: flex;
                flex-direction: column;
                align-items: center;
                overflow: scroll;
            }
            .content {
                width: 690px;
                opacity: 1;
                background: #ffffff;
                border-radius: 10px;
                box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.3);
                padding: 20px 40px 17px 40px;
                font-size: 23px;
                font-family: Source Han Sans CN, Source Han Sans CN-Regular;
                font-weight: 400;
                text-align: JUSTIFIED;
                color: #a5461e;
                line-height: 25px;
                box-sizing: border-box;
            }
            .content .content-text > p {
                margin-bottom: 30px;
            }
            .every-day-sign {
                opacity: 0.7;
                font-size: 20px;
                font-family: Source Han Sans CN, Source Han Sans CN-Regular;
                font-weight: 400;
                text-align: CENTER;
                color: #a13f19;
                letter-spacing: 2px;
            }
            .content-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .content-header .ball {
                width: 12px;
                height: 12px;
                opacity: 1;
                background: #a5461e;
                border-radius: 50%;
                display: inline-block;
            }
            .weiyu {
                width: 690px;
                margin-top: 30px;
                margin-bottom: 30px;
            }
            .weiyu > p {
                opacity: 0.7;
                font-size: 22px;
                font-family: Source Han Sans CN, Source Han Sans CN-Regular;
                font-weight: 400;
                text-align: CENTER;
                color: #a5461e;
            }
            .image-title {
                margin-top: 40px;
                margin-bottom: 14px;
            }
            .title-container {
                position: relative;
                width: 690px;
                margin-bottom: 22px;
            }
            .title {
                opacity: 1;
                font-size: 20px;
                font-family: Source Han Sans CN, Source Han Sans CN-Regular;
                font-weight: 400;
                text-align: CENTER;
                color: #c43f0c;
                position: absolute;
                transform: translateX(-50%);
                left: 50%;
                background-color: white;
                padding: 0 20px;
                margin-top: 4px;
            }
            .divider {
                display: inline-block;
                width: 100%;
                height: 1px;
                background-color: #c43f0c;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <img class="image-title" class="template" src="https://github.com/wl05/code-demo/blob/master/wei-yu-spider/html/title.png?raw=true" />
            <div class="title-container">
                <p class="title">${dateStr}</p>
                <span class="divider"></span>
            </div>

            <img class="template" src="https://github.com/wl05/code-demo/blob/master/wei-yu-spider/html/banner.png?raw=true" />
            <div class="content">
                <div class="content-header">
                <span class="ball"></span>
                <span class="ball"></span>
                </div>
                <section class="content-text">
                ${contentStr}
                <p class="every-day-sign">每/日/一/签</p>
                </section>
            </div>
            <div class="weiyu">
                <p>【微语】</p>
                ${weiyuStr}
            </div>
            </div>
        </body>
        </html>
        `
  },
  pushToGitLab() {
    try {
      console.log('======')
      execSync(`git status`)
    } catch (error) {
      console.log(error)
    }
  },
  async sendEmail() {
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'windows',
      logger: false
    })

    // Message object
    let message = {
      from: '<2929712050@qq.com>',

      // Comma separated list of recipients
      to: '<291534318@qq.com>',

      // Subject of the message
      subject: 'Nodemailer is unicode friendly ✔',

      // plaintext body
      text: '微语简报截图',

      // HTML body
      html:
        '<p><b>Hello</b> Baby</p>' +
        '<p>生成的截图效果:<br/><img src="https://github.com/wl05/code-demo/blob/master/wei-yu-spider/html/weiyu.png?raw=true"/></p>',

      // An array of attachments
      attachments: [
        // File Stream attachment
        {
          filename: 'weiyu.png',
          path: __dirname + '/weiyu.png',
          cid: '291534318@qq.com' // should be as unique as possible
        }
      ]
    }

    let info = await transporter.sendMail(message)
    console.log('Message sent successfully as %s', info.messageId)
  }
}

module.exports = utils
