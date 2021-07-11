const { duaGram, terminal } = require("duagram");
const { performance } = require('perf_hooks');

const bot = new duaGram({
    api_id: 1,
    api_hash: 'your-api-hash',
    as_bot_api: true,
    bot_token: 'your-token-bot',

    logLevel: 1, // 0 false, 1 event, 2 detail
    logDetail: "warn", // none, error, warn, info, debug
});

const Helper = bot.Helper

// event all new message
bot.on('message', async (ctx) => {
    // simple log
    terminal.less(ctx);
});

bot.cmd('ping', async (ctx) => {
    if (!ctx.out) {
        let t0 = performance.now();
        let res = await bot.sendMessage(ctx, '**Pong**!', { parse_mode: 'markdown', replyToMsgId: ctx.id });
        let t1 = performance.now();
        let diff = '<code>' + ((t1 - t0) / 1000).toLocaleString('id-ID', { maximumFractionDigits: 3 }) + "</code>"
        return bot.editMessage(ctx, res.id, `Pong!\nIn ${diff} seconds.`, { parse_mode: 'html' });
    }
});

bot.hear(/^(hi|hel+o+)/i, async (ctx) => {
    // terminal.less(ctx);

    // message in only
    if (!ctx.out) {
        await bot.sendMessage(ctx, '<i>Hi, too!</i>', { parse_mode: 'html' });
    }
});

bot.cmd('upload', async (ctx) => {
    if (!ctx.out) {
        terminal.info('Starting upload...');
        let file = './photo.jpg';
        return bot.sendFile(ctx, file);
    }
});

bot.cmd('start', async (ctx) => {
    // message in only
    if (!ctx.out) {

        if (!bot.asBotApi) {
            return bot.sendMessage(ctx, "I'm not bot api 😅")
        }

        // if Bot API, send with Bot API can too

        let chat_id = bot.getPeerId(ctx);

        let reply_markup = JSON.stringify({
            inline_keyboard: [
                [
                    Helper.Button.url('👥 uBotIndonesia', 'https://t.me/ubotindonesia')
                ], [
                    Helper.Button.text('One', 'cb1'),
                    Helper.Button.text('Two', 'cb2')
                ]
            ]
        });

        let more = {
            parse_mode: 'html',
            reply_markup
        }

        await bot.BotApi.sendMessage(chat_id, 'This message from <b>Bot Api</b>', more)
            .then(result => {
                terminal.log('Result: BotApi sendMessage')
                console.log(result);
            })
            .catch(error => terminal.error(error.message));


    }
});

bot.start();
