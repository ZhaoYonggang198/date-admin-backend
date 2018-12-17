const logger = require('../utils/logger').logger('uploader');
const config = require('../config');
const fs = require('fs')
const uuid = require('node-uuid');

const staticResourcePath = config.static_resource_path
const staticResourcePathWeb = config.static_resource_web

function saveFile(file, type) {
  return new Promise( (resolve, reject) => {
      const reader = fs.createReadStream(file.path);
      const ext = file.name.split('.').pop();
      if (ext != 'mp3' && ext != 'mp4' && ext != 'png' && ext != 'gif' && ext != 'jpg') {
          throw reject('not support file type : ' + ext);
      }
      const fileName = `${uuid.v1()}.${ext}`;
      const filePath = `${staticResourcePath}/${type}/${fileName}`;
      const upStream = fs.createWriteStream(filePath);
      upStream.on('finish', () => {
          upStream.close( ()=> {
            logger.debug(`save file success ${filePath}`)
            resolve({filepath, url: `${staticResourcePathWeb}${type}/${fileName}`});
          });
      });
      reader.pipe(upStream);
  })
}


module.exports = {
  saveFile
}