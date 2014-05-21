var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var clone = require('clone');
var request = require('request');

module.exports = function(app) {

  router.get('/', function(req, res) {
    getAssetPath(function(assetPath) {
      res.render('index', {
        title: 'Gunnlod: '+path.relative(process.cwd(), srcDirectory()),
        assetPath: assetPath
      });
    });
  });

  router.get('/articles', function(req, res) {
    var files = fs.readdirSync(srcDirectory()).map(function(name) {
      return { name: name };
    });
    res.json({articles: files});
  });

  router.get('/article/:name', function(req, res) {
    var file = fs.readFileSync(path.join(srcDirectory(), req.params.name)).toString();
    res.json({
      article: {
        name: req.params.name,
        content: file
      }
    });
  });

  router.post('/article/:name', function(req, res) {
    var filePath = path.join(srcDirectory(), req.params.name);
    fs.writeFileSync(filePath, req.body.content);
    res.send(200);
  });

  router.get('/config', function(req, res) {
    var config = clone(app.get('config'));
    if (config.template) {
      config.template = config.template.toString();
    }
    res.json(config);
  });

  function srcDirectory() {
    return path.join(process.cwd(), app.get('config').srcDirectory);
  }

  return router;
};

function getAssetPath(cb) {
  request('http://localhost:4200/application.js', function(err) {
    cb(err ? '' : 'http://localhost:4200');
  });
}

