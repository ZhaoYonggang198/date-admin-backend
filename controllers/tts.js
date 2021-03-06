const logger = require('../utils/logger').logger('controller-tts');
const TTS = require('../utils/tts')

async function getTtsResult(ctx) {
    try {
        const text = ctx.request.body.text
        const speed = ctx.request.body.speed
        const role = ctx.request.body.role
        const pit = ctx.request.body.pit
        const vol = ctx.request.body.vol
        const audioFile = await TTS.getAudio(text, speed, role, pit, vol, 'static/tts/dictation/')
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {url : 'tts/dictation/' + audioFile};
    } catch (err) {
        ctx.response.status = 404;
        ctx.response.type = "application/json";
        ctx.response.body = {error: err.toString()};
        logger.error('tts handler failed: ' + err);
    }
}

module.exports = {
    'POST /tts' : getTtsResult
}
