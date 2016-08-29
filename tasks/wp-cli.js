(function() {
  'use strict';
  
  var WP = require('wp-cli');

  module.exports = function(grunt) {
    grunt.registerMultiTask('wp-cli', 'Wp-cli', function() {
      var done = this.async();
      
      if (!this.data.path) {
        grunt.log.error("Path is required");
        return done(false);
      }
      
      if (!this.data.command) {
        grunt.log.error("Command is required");
        return done(false);
      }

      if (!this.data.subcommand) {
        grunt.log.error("Subcommand is required");
        return done(false);
      }
      
      WP.discover({path:this.data.path}, function(wp) {
        var command = wp[this.data.command];
        if (command) {
          var subcommandNames = this.data.subcommand.split(' ');
          var subcommand = command[subcommandNames[0]];
          for (var i = 1, l = subcommandNames.length; i < l; i++) {
            subcommand = subcommand[subcommandNames[1]];
          }
         
          if ((typeof subcommand) === 'function') {
            var subcommandArgs = [];
            
            if (this.data.arguments) {
              subcommandArgs.push(this.data.arguments);
            }

            if (this.data.options) {
              subcommandArgs.push(this.data.options);
            }
            
            subcommandArgs.push(function (err, result) {
              if (err) {
                grunt.log.error(err);
                done(false);
              } else {
                grunt.log.writeln(result);
                done();
              }
            });
            
            subcommand.apply(global, subcommandArgs);
          } else {
            grunt.log.error("Subcommand is invalid.");
            done(false);
          }

        } else {
          grunt.log.error("Command is invalid");
          done(false);
        }
      }.bind(this));
      
    });
  };

}).call(this);