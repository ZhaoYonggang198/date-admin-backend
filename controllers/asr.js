const logger = require('../utils/logger').logger('controller-asr');
const fs = require('fs');
const config = require('../config')
const ffmpeg = require('fluent-ffmpeg');
const AipSpeech = require("baidu-aip-sdk").speech;
const saveFile = require('../models/uploader').saveFile

function audioToAsr(audioPath) {
    const client = new AipSpeech(config.baidu_api_id, config.baidu_api_key, config.baidu_secret_key);
    let voice = fs.readFileSync(audioPath);
    let voiceBase64 = new Buffer(voice);
    return new Promise( (resolve, reject) => {
        client.recognize(voiceBase64, 'wav', 16000).then(result => {
            logger.debug('receive asr result:');
            logger.debug(JSON.stringify(result));
            resolve(result)
        }, function(err) {
            logger.error('asr result failed : ' + err);
            reject(err);
        });
    });
}

function transMp3ToWav(mp3FilePath) {
    const targetWavPath = mp3FilePath.split('.')[0] + '.wav';
    return new Promise( (resolve, reject) => {
        ffmpeg(mp3FilePath)
        .toFormat('wav')
        .on('error', (err) => {
            reject(err);
        })
        .on('progress', (progress) => {
            logger.debug('Processing: ' + progress.targetSize + ' KB converted');
        })
        .on('end', () => {
            logger.debug('Processing complete!');
            resolve(targetWavPath);
        })
        .save(targetWavPath);
    });
}

async function getAsrResult(ctx) {
    try {
        const {filePath, url} = await saveFile(ctx.request.body.files.audio, 'asr');
        const wavPath = await transMp3ToWav(filePath);
        const asrResult = await audioToAsr(wavPath);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {url, result : asrResult};
    } catch (err) {
        ctx.response.status = 404;
        ctx.response.type = "application/json";
        ctx.response.body = {error: err.toString()};
        logger.error('asr handler failed: ' + err);
    }
}

module.exports = {
    'POST /asr' : getAsrResult
}
