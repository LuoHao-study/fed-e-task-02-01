const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')
module.exports = grunt => {
  grunt.initConfig({
    clean: {
      dist: ['dist']
    },
    sass: {
      options: {
        implementation: sass
      },
      target: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['assets/styles/*.scss'],
          dest: 'dist/',
          ext: '.css'
        }]
      }
    },
    babel: {
      options: {
        sourceMap: false,
        presets: ['@babel/preset-env']

      },
      target: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['assets/scripts/*.js'],
          dest: 'dist/'
        }]
      }
    },
    web_swig: {
      options: {
        swigOptions: {
          cache: false
        },
        getData: function (tpl) {
          const data = {
            menus: [
              {
                name: 'Home',
                icon: 'aperture',
                link: 'index.html'
              },
              {
                name: 'Features',
                link: 'features.html'
              },
              {
                name: 'About',
                link: 'about.html'
              },
              {
                name: 'Contact',
                link: '#',
                children: [
                  {
                    name: 'Twitter',
                    link: 'https://twitter.com/w_zce'
                  },
                  {
                    name: 'About',
                    link: 'https://weibo.com/zceme'
                  },
                  {
                    name: 'divider'
                  },
                  {
                    name: 'About',
                    link: 'https://github.com/zce'
                  }
                ]
              }
            ],
            pkg: grunt.file.readJSON('package.json'),
            date: new Date()
          }
          return data;
        }
      },
      target: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.html'],
          dest: 'dist/'
        }]
      },
    },
    imagemin: {
      main: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['assets/images/*.{png,jpg,jpeg,svg,gif,bmp}'],
          dest: 'dist/'
        }, {
          expand: true,
          cwd: 'dist/',
          src: ['assets/fonts/*.{png,jpg,jpeg,svg,gif,bmp}'],
          dest: 'dist/'
        }]
      }
    },
    useref: {
      html: 'dist/**/*.html',
      temp: 'dist'
    },
    htmlmin: {
      options: {
        removeComments: true, //移除注释
        removeCommentsFromCDATA: true,//移除来自字符数据的注释
        collapseWhitespace: true,//无用空格
        collapseBooleanAttributes: true,//失败的布尔属性
        removeAttributeQuotes: true,//移除属性引号      有些属性不可移走引号
        removeRedundantAttributes: true,//移除多余的属性
        useShortDoctype: true,//使用短的跟元素
        removeEmptyAttributes: true,//移除空的属性
        removeOptionalTags: true,//移除可选附加标签
        minifyCSS: true,
        minifyJS: true,
      },
      target: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**/*.html'],
          dest: 'dist'
        }]
      }
    },
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'public',
          src: '**',
          dest: 'dist/',
        }, {
          expand: true,
          cwd: 'src',
          src: 'assets/fonts/**',
          dest: 'dist/',
        }]
      },
    },
    connect: {
      server: {
        options: {
          protocol: 'http',
          port: 8081,
          hostname: '*',
          keepalive: true,
          open: true,
          base: ['dist', 'src', 'public']
        }
      }
    },
    watch: {
      sass: {
        files: ['src/**/*.scss'],
        tasks: ['sass'],
      },
      babel: {
        files: ['src/**/*.js'],
        tasks: ['babel']
      },
      html: {
        files: ['src/**/*.html'],
        tasks: ['web_swig', 'useref', 'concat'],
      }
    },
  })
  loadGruntTasks(grunt)
  grunt.registerTask('dev', ['clean', 'babel', 'sass', 'web_swig', 'useref', 'concat', 'connect'])
  grunt.registerTask('build', ['clean', 'copy', 'sass', 'babel', 'web_swig', 'useref', 'concat', 'uglify', 'cssmin', 'imagemin', 'htmlmin'])
}