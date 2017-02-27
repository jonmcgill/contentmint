Cmint.createComponent({
    template: '\
        <table cellpadding="0" cellspacing="0"\
            :align="config._fields.output.alignment"\
            :width="config._fields.output.width"\
            style="background:#cb4f29;"\
            data-hook="vertical-space">\
            <tr>\
                <td width="20" height="16" style="font-size:10px; line-height:10px;">&nbsp;</td>\
                <td height="16" style="font-size:10px; line-height:10px;">&nbsp;</td>\
                <td width="20" height="16" style="font-size:10px; line-height:10px;">&nbsp;</td>\
            </tr>\
            <tr>\
                <td width="20" height="25" style="font-size:10px; line-height:10px;">&nbsp;</td>\
                <td height="25">\
                    <div style="font-family:Arial, sans-serif; font-size:16px; font-weight:bold; text-align:center; line-height:14px; font-style: italic;">\
                        <a :href="config._fields.output.link"\
                            target="_blank"\
                            style="color:#ffffff; text-decoration: none;"\
                            v-html="config._fields.output.text"></a>\
                    </div>\
                </td>\
                <td width="25" height="16" style="font-size:10px; line-height:10px;">&nbsp;</td>\
            </tr>\
            <tr>\
                <td width="20" height="16" style="font-size:10px; line-height:10px;">&nbsp;</td>\
                <td height="16" style="font-size:10px; line-height:10px;">&nbsp;</td>\
                <td width="20" height="16" style="font-size:10px; line-height:10px;">&nbsp;</td>\
            </tr>\
        </table>',
    config: {
        _name: 'cta-button',
        _display: 'Button',
        _category: 'CTA',
        _content: {
            linktext: 'CTA Message Here'
        },
        _fields: {
            list: [
                {   name: 'alignment',
                    result: 'alignment' },
                {   name: 'plain-text',
                    result: 'text' },
                {   name: 'width',
                    result: 'width' },
                {   name: 'link-choice',
                    result: 'link' }
            ],
            output: {
                'link': 'http://www.reyrey.com',
                'text': 'CTA Message Here',
                'alignment': 'center',
                'width': ''
            }
        }
    }
})