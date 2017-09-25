"use strict";

const Flickr = require("flickrapi");
const flickrOptions = {
    api_key: "d409981bb930b8152dd1e2822fc80ca5",
    secret: "b9ad98c40c02d298"
};

const fs = require('fs');
const csvWriter = require('csv-write-stream');
const writer = csvWriter({ headers: ["camera","id","secret","server","farm","exposure","aperture","iso","date-taken","focal-length"]})
const asyncLoop = require('node-async-loop');

Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    let photoIds = [];
    let photoInfo = [];
    let camera, id, secret, server, farm, exposure, aperture, iso, dateTaken, focalLength;
    let exposureRaw, apertureRaw, isoRaw, dateTakenRaw, focalLengthRaw;

    writer.pipe(fs.createWriteStream('flickr-data-1-updated.csv'));
    flickr.people.getPhotos(
        {
            user_id: "46863234@N05", //My user id
            page: 1,
            per_page: 500
        }, function (err, result) {
            if(err) {
                console.log("Error: " + err);
            } else {
                const photoLength = result.photos.photo.length;
                asyncLoop(result.photos.photo, function(item, next){
                    flickr.photos.getExif(
                        {
                            photo_id: item.id
                        }, function(err, result) {
                            if(err) {
                                console.log("Error: " + err);
                            } else {
                                camera= (result.photo.camera !== '' ? result.photo.camera:'null');
                                id = result.photo.id;
                                secret = result.photo.secret;
                                server = result.photo.server;
                                farm = result.photo.farm;
                                exposureRaw = result.photo.exif.filter(function(photo){ return photo.label == "Exposure" });
                                apertureRaw = result.photo.exif.filter(function(photo){ return photo.label == "Aperture" });
                                isoRaw = result.photo.exif.filter(function(photo){ return photo.label == "ISO Speed" });
                                dateTakenRaw = result.photo.exif.filter(function(photo){ return photo.tag == "DateTimeOriginal" });
                                focalLengthRaw = result.photo.exif.filter(function(photo){ return photo.tag == "FocalLength" });
                                //photoInfo = [camera, id, secret, server, farm, exposure[0].raw._content, aperture[0].raw._content, iso[0].raw._content, dateTaken[0].raw._content, focalLength[0].clean._content];

                                exposure = (exposureRaw.length ? exposureRaw[0].raw._content:'null');
                                aperture = (apertureRaw.length ? apertureRaw[0].raw._content:'null');
                                iso = (isoRaw.length ? isoRaw[0].raw._content:'null');
                                dateTaken = (dateTakenRaw.length ? dateTakenRaw[0].raw._content:'null');
                                focalLength = (focalLengthRaw.length && focalLengthRaw.hasOwnProperty('clean')) ? focalLengthRaw[0].clean._content:'null';

                                writer.write([camera, id, secret, server, farm, exposure, aperture, iso, dateTaken, focalLength]);
                                next();
                            }
                        }
                    )
                }, function(err) {
                  if(err){
                    console.log("Error: " + err.message);
                    return;
                  }
                  console.log("Finished");
                  writer.end();
                }
              );
            }
        }
    )
});
