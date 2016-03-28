module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js', 'public/javascript/wating.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'public/javascript/wating.js',
                dest: 'public/javascript/wating.min.js'
            }
        }
    });

    // Load the plugin
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['uglify']);

};