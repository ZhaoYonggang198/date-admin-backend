const logger = require('../utils/logger').logger('media-upload');
const saveFile = require('../models/uploader').saveFile

async function postAudio(ctx) {
    try {
        const {url} = await saveFile(ctx.request.body.files.audio, 'audio');
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {url};
    } catch (err) {
        ctx.response.status = 404;
        ctx.response.type = "application/json";
        ctx.response.body = {error: err.toString()};
        logger.error('post audio failed: ' + err.message);
    }
}

async function postVideo(ctx) {
    try {
        const {url} = await saveFile(ctx.request.body.files.video, 'video');
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {url};
    } catch (err) {
        ctx.response.status = 404;
        ctx.response.type = "application/json";
        ctx.response.body = {error: err.toString()};
        logger.error('post video failed: ' + err.message);
    }
}

async function postImage(ctx) {
    try {
        const {url} = await saveFile(ctx.request.body.files.image, 'image');
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {url};
    } catch (err) {
        ctx.response.status = 404;
        ctx.response.type = "application/json";
        ctx.response.body = {error: err.toString()};
        logger.error('post image failed: ' + err.message);
    }
}

module.exports = {
    'POST /upload/audio' : postAudio,
    'POST /upload/video' : postVideo,
    'POST /upload/image' : postImage,
    'POST /upload/avatar' : postImage
}
