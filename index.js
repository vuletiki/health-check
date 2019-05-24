const HOOK = 'https://hooks.slack.com/services/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';
var cron = require('cron');
var request = require('request');

const hitList = [
	{
		alias: 'Home',
		url: 'https://tiki.vn',
		platform: 'desktop',
		threshold: 1000
	},
	{
		alias: 'Product Detail',
		url: 'https://tiki.vn/combo-2-ta-quan-pampers-tiet-kiem-l36-36-mieng-goi-p11124433.html',
		platform: 'desktop',
		threshold: 1000
	},
	{
		alias: 'Home',
		url: 'https://tiki.vn',
		platform: 'mobile',
		threshold: 1000
	},
	{
		alias: 'LP',
		url: 'https://tiki.vn/chuong-trinh/tiki-xiaomi-now',
		platform: 'desktop',
		threshold: 1000
	},
	{
		alias: 'LP',
		url: 'https://tiki.vn/chuong-trinh/tiki-xiaomi-now',
		platform: 'mobile',
		threshold: 1000
	}
]

const uas = {
	mobile: "Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_2 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D257 Safari/9537.53",
	desktop: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36"
}

const hit = (target) => {
	return new Promise((resolve, reject) => {
		return request({
			method: 'GET',
		    url: target.url,
		    time: true,
		    headers: {
		    	'User-Agent': uas[target.platform]
		    },
		    callback: (error, responseObject, response) => {
				if(error) {
					reject(error)
				} else {
					resolve({
						firstByte: responseObject.timingPhases.firstByte,
						alias: target.alias,
						url: target.url,
						platform: target.platform,
						threshold: target.threshold
					})
				}
			}
		});

	})
}

const summaryResult = datas => {
	let summary = {
		mobile: [],
		desktop: []
	}
	datas.map(record => {
		if(record.firstByte > record.threshold) {

			summary[record.platform].push(record)
		}
	})
	console.log(summary)
	let attachments = []
	Object.keys(summary).map(platform => {
		if(summary[platform].length > 0) {
			attachments.push({
		         "pretext": platform.toUpperCase(),
		         "color":"#D00000",
		         "fields": summary[platform].map(item => {
		         	return {
		               "value": `<${item.url}|${item.alias}>: ${Math.round(item.firstByte, 0)}ms`,
		               "short":false
		            }
		         })
		    })
		}
	})
	if(attachments.length > 0) {
		request.post(HOOK).form({
			payload: JSON.stringify({
				"text":"<!here|here> List page is slow!",
			   	attachments
			})
		})
	} else {
		request.post(HOOK).form({
			payload: JSON.stringify({
				"text":"Everything look good!"
			})
		})
	}
}

var CronJob = require('cron').CronJob;
console.log('cron start')
var job = new CronJob('0 */5 * * * *', function() {
	console.log('cron run')
	try {

		request.post(HOOK).form({
			payload: JSON.stringify({
				"text":"Start to hit!",
			})
		})

		let prs = []
		hitList.map(item => {
		let pr = hit(item)
			prs.push(pr)
		})
		Promise.all(prs).then(summaryResult)
	} catch(e) {
		request.post(HOOK).form({
			payload: JSON.stringify({
				"text":"Fail to hit!",
			})
		})
	}
});

job.start();