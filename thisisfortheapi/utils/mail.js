const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '11683773@qq.com', // generated ethereal user
        pass: 'siohpsbxaltsbghe'  // generated ethereal password
    }
});

// setup email data with unicode symbols
let mailOptions = {  
    from: '"对话小说"<11683773@qq.com>', // sender address
    to: 'wxclover@qq.com', // list of receivers
    subject: '内容创作平台注册激活邮件', // Subject line
    text: 'Hello !!!', // plain text body
    html: '<b>Welcome !!!</b>' // html body
};

function sendMail(user){
  // send mail with defined transport object

  var html = `
    <div id="mailContentContainer" class="qmbox qm_con_body_content qqmail_webmail_only" style="">
      <table width="618" height="410" border="0" cellspacing="20" cellpadding="0" bgcolor="#f7f7f7">
      <tbody><tr>
      <td height="55">&nbsp;<a href=":;" target="_blank"><img class="png" src="javascript:;" border="0"></a></td>
      </tr>
      <tr>
      <td><table width="578" height="328" border="0" cellpadding="0" cellspacing="1" bgcolor="#cee9ff">
      <tbody><tr>
      <td bgcolor="#ffffff" style="padding:20px 30px">
      <strong>欢迎您来到内容创作平台，请继续完成以下操作。</strong>    
      <p style="line-height:160%">请点击链接激活帐号：<br>
      <a href="http://story.yc.ifeng.com/activate/${user._id}/" target="_blank">
                      http://story.yc.ifeng.com/activate/${user._id}/
      </a><br>
      <font style="font-size:12px;color:#aaaaaa;">(该链接在24小时内有效，24小时后需要重新获取)</font></p>
      <p style="font-size:12px;">如果上面不是链接形式，请将地址复制到您的浏览器的地址栏再访问。</p>
      <p style="font-size:12px;">感谢您对平台的支持，希望您在平台获得好的服务体验。<br>                  
      (这是一封系统邮件，请勿回复。)</p>
      </td>
      </tr>
      </tbody></table></td>
      </tr>
      </tbody></table>
      
      <style type="text/css">.qmbox style, .qmbox script, .qmbox head, .qmbox link, .qmbox meta {display: none !important;}</style></div>
    `
  mailOptions.to = `${user.username}`
  mailOptions.html = html;


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });

}

module.exports = {send: sendMail}