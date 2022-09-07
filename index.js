// import fetch from 'node-fetch'

import qrcode from 'qrcode'

import sharp from 'sharp'

import fetch from 'node-fetch'

import http from 'http'


http.createServer(async (req, res) => {

    fetch("https://isu.ifmo.ru/pls/apex/wwv_flow.show", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-GB,en;q=0.6",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "ORA_WWV_RAC_INSTANCE=2; REMEMBER_SSO=AA133E53E573586FC1C41C01099B2567:44B97FCA48459FD7095054C22E540B5A1F7C767E29031CF7A4C6E346808339FA8369BC8458908189338DEBB27DD00B2B; ISU_AP_COOKIE=ORA_WWV-RxkANz3DykkbCA4vOPWpvXgN; ISU_LIB_SID=ORA_WWV-RxkANz3DykkbCA4vOPWpvXgN",
            "Referer": "https://isu.ifmo.ru/pls/apex/f?p=2437:121:102680740129896::NO::",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "p_flow_id=2437&p_flow_step_id=121&p_instance=102680740129896&p_request=APPLICATION_PROCESS%3DGET_HEXCODE",
        "method": "POST"
    }).then(res => {
        return res.json()
    }).then((jsonResponse) => {

        qrcode.toFile('./qrcode.png', jsonResponse.P121_HEXCODE, {
            color: {
                dark: '#000000',
                light: '#FFFF' // Transparent background
            },
            scale: 10
        }, function (err) {
            if (err) throw err
    
            console.log(jsonResponse)

            sharp('./qrcode.png').resize(700, 700).toBuffer({ resolveWithObject: true }).then( ({ data, info }) => {
                sharp('./background.jpg')
                .composite([{
                    input: data,
                }])
                .jpeg()
                .toBuffer(function (err, data, info) {
                    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    res.end(data); // Send the file data to the browser.
                });
            }).catch(err => { 
                console.log("Error: ", err);
              });
    
        })
    });


}).listen(3200);

// fetch("https://isu.ifmo.ru/pls/apex/wwv_flow.show", {
//   "headers": {
//     "accept": "application/json, text/javascript, */*; q=0.01",
//     "accept-language": "en-GB,en;q=0.6",
//     "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "sec-gpc": "1",
//     "x-requested-with": "XMLHttpRequest",
//     "cookie": "ORA_WWV_RAC_INSTANCE=2; REMEMBER_SSO=AA133E53E573586FC1C41C01099B2567:44B97FCA48459FD7095054C22E540B5A1F7C767E29031CF7A4C6E346808339FA8369BC8458908189338DEBB27DD00B2B; ISU_AP_COOKIE=ORA_WWV-z6rXYOP8pQaIlS/i/Cmv8Upv; ISU_LIB_SID=ORA_WWV-z6rXYOP8pQaIlS/i/Cmv8Upv",
//     "Referer": "https://isu.ifmo.ru/pls/apex/f?p=2437:121:105315550952492::NO::",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": "p_flow_id=2437&p_flow_step_id=121&p_instance=105315550952492&p_request=APPLICATION_PROCESS%3DGET_HEXCODE",
//   "method": "POST"
// });