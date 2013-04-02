/*
 * grunt-java-properties
 * https://github.com/igen261/grunt-java-properties
 *
 * Copyright (c) 2013 Matt Steele
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var properties = require('java-properties');
  var path = require('path');

  grunt.registerMultiTask('java_properties', 'Your task description goes here.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      properties: []
    });
    var props;
    if (options.properties) {
      props = properties.of.apply(this, options.properties);
    } else {
      grunt.fail.warn('Need to specify properties value');
    }

    if (options.processProperties) {
      options.processProperties(props);
    }

    var processJs = function(i) {
      return i.replace(/\$\{([A-Za-z0-9\.]*)\}/g, function(match) {
        var key = match.substring(2, match.length - 1);
        return props.get(key);
      });
    };

    grunt.verbose.writeflags(options, 'Options');

    // Iterate over all specified file groups.
    this.files.forEach(function(file) {
      var isExpandedPair = file.orig.expand || false;
      file.src.forEach(function(src) {
        var dest = file.dest;
        grunt.file.copy(src, dest, {
          process: processJs
        });
      });

      // Print a success message.
      grunt.verbose.writeln('File "' + file.dest + '" created.');
    });
  });

};
