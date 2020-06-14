## 1、前端工程化

#### 1、工程化的定义和主要解决的问题

主要解决的问题：

1. 传统语言或者语法的弊端
2. 无法使用模块化/组件化
3. 重复的机械式工作
4. 代码风格统一，质量保证
5. 依赖后端服务接口支持
6. 整体依赖后端项目

#### 2、工程化不等用工具

![avatar](http://106.12.177.33/markDownImg/工程化图.png)

## 2、脚手架工具

#### 1、脚手架工具概要

* 相同的组织结构
* 相同的开发范式
* 相同的模块依赖
* 相同的工具配置
* 相同的基础代码

#### 2、常用的脚手架工具

1. Create-react-app
2. Vue-cli
3. Angular-cli
4. yeoman

#### 3、yeoman简介

相比于vue-cli等脚手架yeoman更加灵活

#### 4、yeoman基础使用

1. 在全局范围安装yo

    npm install yo --global -g

2. 你这对应的generator

   npm install generator-node -g

3. 通过yo运行generator

   cd path/to/project-dir

   mkdir my-module

   yo node

#### 5、Sub Generator

1. yo node:cli
2. yarn link
3. yarn
4. 模块名 --help

#### 6、yeoman使用步骤总结

1. 明确你的需求
2. 找到合适的Generator
3. 全局范围安装找到的Generator
4. 通过yo运行对应的Generator
5. 通过命令行交互填写选项
6. 生成你所需要的项目结构

#### 7、创建Generator模块

Generator目录结构如下图：

![avatar](http://106.12.177.33/markDownImg/Generator基本目录结构.png)

自定义Generator的模块名称必须为generator-name的格式

操作：

1. mkdir generator-sample
2. cd generator-sample
3. yarn init
4. yarn add yeoman-generator
5. 编辑器打开文件夹，创建genterators/app/index.js(generators文件夹下有app文件夹，app文件夹下有index.js文件)，此文件作为generator的核心入口

```javascript
//此文件为Generator的核心入口
//需要导出一个继承自Yeoman Generator的类型
//Yeoman Generator在工作时会自动调用我们在此类型中定义的一些生命周期方法
//我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入
//如下为index.js内容

const Generator = require('yeoman-generator')

module.exports = class extends Generator{
  writing(){
    //Yeoman自动生成文件阶段调用此方法
    //我们这里尝试往项目目录中写入文件
    this.fs.write(
    	this.destinationPath('temp.txt'),
      Math.random().toString()
    )
  }
}
```

6. yarn link
7. cd ..
8. mkdir my-proj
9. cd my-proj
10. yo sample

#### 8、根据模板创建文件

在generators目录下创建一个templates目录，将需要生成的文件都放在templats目录下，例如创建一个foo.txt文件

相对于手动创建每一个文件，模板的方式大大提高了效率

```txt
这是一个模板文件，内部可以使用EJS模板标记输出数据
例如：<%= title %>
其他的EJS语法也支持
<% if(success){ %>
哈哈哈
<% }%>
```

```javascript
//index.js文件修改如下
const Generator = require('yeoman-generator')

module.exports = class extends Generator{
  writing(){
		//通过模板方法写入文件到模板目录
    //模板文件路径
    const tmpl = this.templatePath('foo.txt')
    //输出目标路径
    const output = this.destinationPath('foo.txt')
    //模板数据上下文
    const context = {title:'Hello zce~',success:false}
    
    this.fs.copyTpl(tmpl,output,context)
  }
}
```

#### 9、接收用户输入

现在templates下创建bar.html模板

```javascript
//使用prompting接收输入
const Generator = require('yeoman-generator')

module.exports = class extends Generator{
  prompting(){
    //yeoman在询问用户环节会自动调用此方法
    //在此方法中可以调用父类的prompt()方法发出对用户的命令行询问
    return this.prompt([
      {
        type:'input',
        name:'name',
        message:'Your project name',
        default:this.appname//appname为项目生成目录名称
      }
    ])
    .then(answers=>{
      //answers =>{name:'user input value'}
      this.answers = answers
    })
  }
  writing(){
		//通过模板方法写入文件到模板目录
    //模板文件路径
    const tmpl = this.templatePath('foo.txt')
    //输出目标路径
    const output = this.destinationPath('foo.txt')
    //模板数据上下文
    const context = this.answers
    
    this.fs.copyTpl(tmpl,output,context)
  }
}
```

#### 10、vue Generator案例

1. mkdir generator-zce-vue
2. cd generator-zce-vue
3. yarn init
4. yarn add yeoman-generator 
5. 打开文件目录创建generators/app/index.js
6. 创建app/templates目录，并放入提前准备好的模板
7. yarn link
8. cd ..
9. mkdir my-proj
10. cd my-proj
11. yo zce-vue

```javascript
//index.js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting () {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname
    }])
      .then(answers => {
        this.answers = answers
      })
  }

  writing () {
    // 把每一个文件都通过模板转换到目标路径

    const templates = [
      '.browserslistrc',
      '.editorconfig',
      '.env.development',
      '.env.production',
      '.eslintrc.js',
      '.gitignore',
      'babel.config.js',
      'package.json',
      'postcss.config.js',
      'README.md',
      'public/favicon.ico',
      'public/index.html',
      'src/App.vue',
      'src/main.js',
      'src/router.js',
      'src/assets/logo.png',
      'src/components/HelloWorld.vue',
      'src/store/actions.js',
      'src/store/getters.js',
      'src/store/index.js',
      'src/store/mutations.js',
      'src/store/state.js',
      'src/utils/request.js',
      'src/views/About.vue',
      'src/views/Home.vue'
    ]

    templates.forEach(item => {
      // item => 每个文件路径
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.answers
      )
    })
  }
}
```

#### 11、发布Generator

1. echo node_modules > .gitignore
2. git init
3. git add .
4. git commit -m"commit"
5. Git remote add origin http://github.com/zce/generator-zce-vue.git
6. git push -u origin master
7. yarn publish --registry=https://registry.yarmpkg.com  

#### 12、plop简介

一个小而美的脚手架工具，用于创建重复文件

#### 13、plop的基本使用

1. yarn add plop --dev
2. 项目根目录下创建一个plopfiles.js文件
3. 创建plop-templates/component.hbs，plop-templates/component.css.hbs,plop-templates/component.test.hbs
4. yarn plop component(plopfiles.js中生成器的名字)

```javascript
//plopfiles.js
module.exports = plop = {
  plop.setGenerator('component',{
  	description:'create a component',
  	prompts:[{
  		type:'input',
  		name:'name',
  		message:'component name',
  		default:'MyComponent'
		}],
   	actions:[
      { 
      	type:'add',//代表添加文件
      	path:'src/components/{{name}}/{{name}}.js',
      	templateFile:'plop-templates/component.hbs'
    	},
       { 
      	type:'add',//代表添加文件
      	path:'src/components/{{name}}/{{name}}.css',
      	templateFile:'plop-templates/component.css.hbs'
    	},
       { 
      	type:'add',//代表添加文件
      	path:'src/components/{{name}}/{{name}}.js',
      	templateFile:'plop-templates/component.test.hbs'
    	}
    ]
	})
}
```

基本步骤：

1. 将plop模板作为项目开发依赖安装
2. 在项目根目录下创建一个plopfile.js文件
3. 在plopfile.js文件中定义脚手架任务
4. 编写用于生产特定类型文件的模板
5. 通过plop提供的CLI运行脚手架任务

#### 14、脚手架的工作原理

1. mkdir sample-scaffolding
2. cd  sample-scaffolding
3. yarn init
4. package.json中添加”bin“:"cli.js"
5. 创建cli.js文件

```javascript
#!/usr/bin/env node
//Node CLI应用入口文件必须要有这样的文件头
//如果是Linux或者mac系统下还需要修改此文件的读写权限为755
//具体就是通过chmod 755 cli.js实现修改

//脚手架的工作过程
//1.通过命令行交互询问用户问题
//2.根据用户的回答的结果生成文件
//需要先安装inquirer模块和ejs

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs')

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Project name?'
  }
])
.then(anwsers => {
  // console.log(anwsers)
  // 根据用户回答的结果生成文件

  // 模板目录
  const tmplDir = path.join(__dirname, 'templates')
  // 目标目录
  const destDir = process.cwd()

  // 将模板下的文件全部转换到目标目录
  fs.readdir(tmplDir, (err, files) => {
    if (err) throw err
    files.forEach(file => {
      // 通过模板引擎渲染文件
      ejs.renderFile(path.join(tmplDir, file), anwsers, (err, result) => {
        if (err) throw err

        // 将结果写入目标文件路径
        fs.writeFileSync(path.join(destDir, file), result)
      })
    })
  })
})
```

## 3、自动化构建

#### 1、自动化构建简介

自动化：通过机器代替手工完成一些工作

构建：把一个东西转换成另外一个东西

在程序开发中，自动化构建既把源代码自动转换成生产代码

自动化构建可以把不被支持的特性转换成能被支持的代码

#### 2、自动化构建初体验

npm scripts

```scss
$body-bg:#f8f9fb
$body-color:#333;

body{
  margin:0 auto;
  padding:20px;
  max-width:800px;
  background-color:#f8f9fb;
  color:#333;
}
```

#### 3、常用的自动化构建工具

1. Grunt
2. Gulp
3. FIS

#### 4、Grunt的基本使用

1. 创建一个空项目
2. yarn init --yes
3. yarn add grunt
4. 在项目下添加gruntfile.js文件

```javascript
//gruntfile.js
//Grunt的入口文件
//用于定义一些需要Grunt自动执行的任务
//需要导出一个函数
//此函数接收一个grunt的形参，内部提供一些创建任务时可以用到的API

module.exports = grunt => {
  grunt.registerTask('foo',()=>{
    console.log('hello grunt~')
  })
  grunt.registerTask('bar','任务描述'，()=>{
    console.log('other task')
  })
  grunt.registerTask('default',['foo','bar'])
  grunt.registerTask('async-task',()=>{
    setTimeout(()=>{
      console.log('async task working')	
      done()
    },1000)
  })
}
```

#### 5、Grunt标记任务失败

```javascript
module.exports = grunt => {
  grunt.registerTask('foo',()=>{
    console.log('hello grunt~')
    return false //标记为失败，如果这里标记失败了后续代码便不会被继续执行如果需要在失败的情况下继续执行后续任务，则在执行时使用yarn grunt default --force
  })
  grunt.registerTask('bar','任务描述'，()=>{
    console.log('other task')
  })
  grunt.registerTask('default',['foo','bar'])
  grunt.registerTask('async-task',()=>{
    const done = this.async()
    setTimeout(()=>{
      console.log('async task working')	
      done(false)//异步任务需要在此处传入false标记失败
    },1000)
  })
}
```

#### 6、Grunt的配置方法

   ```javascript
module.export = grunt =>{
  grunt.initConfig({
    foo:{
      bar:123
    }
  })
  grunt.registerTask('foo',()=>{
    console.log(grunt.config('foo.bar'))
  })
}
   ```

#### 7、Grunt多目标任务

```javascript
module.export = grunt =>{
    grunt.initConfig({
    build:{
      options:{
        foo:'bar'
      },
      css:{
        options:{
          foo:'baz'
        }
      },
      js:'2'
    }
  })
  //多目标模式，可以让任务根据配置形成多个子任务
  grunt.registerMultiTask('build',function(){
    console.log(this.options())
    console.log(`target:${this.target},data:${this.data}`)
  })
}
```

#### 8、Grunt插件的使用

```javascript
//需要先使用NPM安装此插件
module.exports = grunt =>{
  grunt.initConfig({
    clean:{
      temp:'temp/*.txt'//'temp/index.txt'或者'temp/**'
    }
  })
  grunt.loadNpmTask('grunt-contrib-clean')
}
```

#### 9、Grunt常用插件及总结

```javascript
//yarn add grunt-sass sass --dev
//yarn add grunt-babel @babel/core @babel/preset-env --dev
//yarn add load-grunt-tasks --dev
//yarn add grunt-contrib-watch --dev
const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')
module.exports = grunt =>{
  grunt.initConfig({
    sass:{
      options:{
        sourceMap:true
        implementation:sass
      },
      main:{
        files:{
          'dist/css/main.css':'src/scss/main.scss'
        }
      },
      babel:{
        options:{
          sourceMap:true
          presets:['@babel/preset-env']
        },
        main:{
          flies:{
            'dist/js/app.js':'src/js/app.js'
          }
        }
      },
   		 watch:{
    		js:{
          files:['src/js/*.js']
          tasks:['babel']
        },
    		css:{
          files:['src/scss/*.scss']
          tasks:['sass']
        },
  		}
    }
  })
  //grunt.loadNpmTask('grunt-sass')
  loadGruntTasks(grunt)//自动加载所有的grunt插件中的任务
	grunt.registerTask('default',['sass','babel','watch'])
}
```

#### 10、Gulp的基本使用

1. 安装gulp依赖，yarn add gulp --dev 
2. 创建gulpfile.js文件

```javascript
//gulpfile.js
//gulp的入口文件
export.foo = done=>{
  console.log('foo task woring~')
  done()//标识任务完成
}
export.default = done =>{
  console.log('default task working~')
  done()
}
//gulp4.0以前
const gulp = require('gulp')
gulp.task('bar',done=>{
  console.log('bar working')
  done()
})
```

#### 11、Gulp组合任务

```javascript
const {series,parallel} = require('gulp')
const task1 = done =>{
  setTimeout(()=>{
    console.log('task1 working')
    done()
  },1000)
}
const task2 = done =>{
  setTimeout(()=>{
    console.log('task2 working')
    done()
  },1000)
}
const task3 = done =>{
  setTimeout(()=>{
    console.log('task3 working')
    done()
  },1000)
}
exports.foo = series(task1,task2,task3)
exports.bar = parallel(task1,task2,task3)
```

#### 12、Gulp的异步任务

```javascript
const fs = require('fs')
export.callback = done =>{
  console.log('callback task~')
  done()
}
export.callback_error = done =>{
  console.loh('callback task')
  done(new Error('task failed'))
}
export.promise = ()=>{
  console.log('promise task~')
  return Promise.resolve()
}
export.promise = ()=>{
  console.log('promise task~')
  return Promise.reject(new Error('task failed'))
}
const timeout = time =>{
  return new Promise(resolve =>{
    setTimeout(resolve,time)
  })
}
exports.async = async()=>{
  await timeout(1000)
  console.log('async task~')
}
exports.stream = ()=>{
  const readStream = fs.createReadStream('package.json')
  const writeStream = fs.createWriteStream('temp/.txt')
  readStream.pipe(writeStream)
  return readStream
}

exports.stream = done=>{
  const readStream = fs.createReadStream('package.json')
  const writeStream = fs.createWriteStream('temp/.txt')
  readStream.pipe(writeStream)
  readStream.on('end',()=>{
    done()
  })
}
```

#### 13、Gulp构建过程核心工作原理

输入->加工->输出

```javascript
const fs = require('fs')
const {Transform} = require('stream')
export.default = done =>{
  //文件读取流
  const read = fs.createReadStream('normalzie.css')
  //文件写入流
  const write = fs.createWriteStream('normalzie.min.css')
  //文件转换流
  const transform = new Transform({
    transform:(chunk,encoding,callback)=>{
      //核心转换过程
      //chunk=>读取六中读取到的内容（Buffer）
      const input = chunk.toString()
      const ourpuy = 								    input.replace(/\s+/g,'').replace(/\/\*.+?\*\//g,'')
      callback(null,output)
    }
  })
  //把读取出来的文件流导入写入文件流
  read
  	.pipe(transform)
  	.pipe(write)
  return read
}
```

#### 14、Gulp文件操作API

```javascript
//yarn add gulp-clean-css glup-rename --dev
const {src,dest} = require('gulp')
const cleanCss = require('gulp-clean-css')
const renam = require('glup-rename')
exports.default = ()=>{
  return src('src/normalize.css')//*.css
  			 .pipe(cleanCss())
  			 .pipe(renam({extname:'.min.css'}))
  			 .pipe(dest('dist'))
}
```

#### 15、Gulp案例-样式编译

```javascript
//yarn add gulp gulp-sass --dev
//gulpfile.js
const {src,dest} = reuqire('gulp')
const sass = require('gulp-sass')
const style = ()=>{
  return src('src/assets/styles/*.scss',{base:'src'})
  			 .pipe(sass({outputStyle:'expanded'}))
    		 .pipe(dest('dist'))
}
module.export = {
  style
}
```

#### 16、Gulp案例-脚本编译

```javascript
//yarn add gulp gulp-sass gulp-babel @babel/core @babel/preset-env --dev
//gulpfile.js
const {src,dest} = reuqire('gulp')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const style = ()=>{
  return src('src/assets/styles/*.scss',{base:'src'})
  			 .pipe(sass({outputStyle:'expanded'}))
    		 .pipe(dest('dist'))
}
const script = ()=>{
  return src('src/assets/script/*.js',{base:'src'})
  			 .pipe(babel({presets:['@babel/presets-env']}))
  			 .pipe(dest('dist'))
}
module.export = {
  style,
  script
}
```

#### 17、Gulp案例-页面模板编译

```javascript
//yarn add gulp gulp-sass gulp-babel @babel/core @babel/preset-env gulp-swig--dev
//gulpfile.js
const {src,dest,parallel} = reuqire('gulp')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const swig = require('gulp-swig')
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
  pkg: require('./package.json'),
  date: new Date()
}
const style = ()=>{
  return src('src/assets/styles/*.scss',{base:'src'})
  			 .pipe(sass({outputStyle:'expanded'}))
    		 .pipe(dest('dist'))
}
const script = ()=>{
  return src('src/assets/script/*.js',{base:'src'})
  			 .pipe(babel({presets:['@babel/presets-env']}))
  			 .pipe(dest('dist'))
}
const page = ()=>{
  return src('src/**/*.html'，{base:'src'})//**为所以子目录
    		 .pipe(swig({data}))
  			 .pipe(dest('dist'))
}
const compole = parallel(style,script,page)
module.export = {
 compole
}
```

#### 18、Gulp案例-图片和字体文件转换

```javascript
//yarn add gulp gulp-sass gulp-babel @babel/core @babel/preset-env gulp-swig gulp-imagemin --dev
//gulpfile.js
const {src,dest,parallel} = reuqire('gulp')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const swig = require('gulp-swig')
const imagemin = require('gulp-imagemin')
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
  pkg: require('./package.json'),
  date: new Date()
}
const style = ()=>{
  return src('src/assets/styles/*.scss',{base:'src'})
  			 .pipe(sass({outputStyle:'expanded'}))
    		 .pipe(dest('dist'))
}
const script = ()=>{
  return src('src/assets/script/*.js',{base:'src'})
  			 .pipe(babel({presets:['@babel/presets-env']}))
  			 .pipe(dest('dist'))
}
const page = ()=>{
  return src('src/**/*.html'，{base:'src'})//**为所以子目录
    		 .pipe(swig({data}))
  			 .pipe(dest('dist'))
}
const image = ()=>{
  return src('src/assets/images/**',{base:'src'})
  			 .pipe(imagemin())
    		 .pipe(dest('dist'))
}
const font = ()=>{
   return src('src/assets/images/**',{base:'src'})
  			 .pipe(imagemin())
    		 .pipe(dest('dist'))
}
const compole = parallel(style,script,page,image,font)
module.export = {
 compole
}
```

#### 19、Gulp案例-其他文件及文件清除

```javascript
//yarn add gulp gulp-sass gulp-babel @babel/core @babel/preset-env gulp-swig gulp-imagemin del --dev
//gulpfile.js
const {src,dest,parallel,series} = reuqire('gulp')

const del = require('del')

const sass = require('gulp-sass')
const babel = require('gulp-babel')
const swig = require('gulp-swig')
const imagemin = require('gulp-imagemin')
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
  pkg: require('./package.json'),
  date: new Date()
}
const clean = ()=>{
  return del(['dist'])
}
const style = ()=>{
  return src('src/assets/styles/*.scss',{base:'src'})
  			 .pipe(sass({outputStyle:'expanded'}))
    		 .pipe(dest('dist'))
}
const script = ()=>{
  return src('src/assets/script/*.js',{base:'src'})
  			 .pipe(babel({presets:['@babel/presets-env']}))
  			 .pipe(dest('dist'))
}
const page = ()=>{
  return src('src/**/*.html'，{base:'src'})//**为所以子目录
    		 .pipe(swig({data}))
  			 .pipe(dest('dist'))
}
const image = ()=>{
  return src('src/assets/images/**',{base:'src'})
  			 .pipe(imagemin())
    		 .pipe(dest('dist'))
}
const font = ()=>{
   return src('src/assets/images/**',{base:'src'})
  			 .pipe(imagemin())
    		 .pipe(dest('dist'))
}
const extra = ()=>{
   return src('public/**',{base:'public'})
    		 .pipe(dest('dist'))
}
const compile = parallel(style,script,page,image,font)
const build = series(clean,parallel(compile,extra))

module.export = {
 compile
 build
}
```

#### 20、Gulp案例-自动加载插件

```javascript
//yarn add gulp gulp-sass gulp-babel @babel/core @babel/preset-env gulp-swig gulp-imagemin del glup-load-plugins --dev
//gulpfile.js
const {src,dest,parallel,series} = reuqire('gulp')

const del = require('del')

const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
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
  pkg: require('./package.json'),
  date: new Date()
}
const clean = ()=>{
  return del(['dist'])
}
const style = ()=>{
  return src('src/assets/styles/*.scss',{base:'src'})
  			 .pipe(plugins.sass({outputStyle:'expanded'}))
    		 .pipe(dest('dist'))
}
const script = ()=>{
  return src('src/assets/script/*.js',{base:'src'})
  			 .pipe(plugins.babel({presets:['@babel/preset-env']}))
  			 .pipe(dest('dist'))
}
const page = ()=>{
  return src('src/**/*.html'，{base:'src'})//**为所以子目录
    		 .pipe(plugins.swig({data}))
  			 .pipe(dest('dist'))
}
const image = ()=>{
  return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const font = ()=>{
   return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const extra = ()=>{
   return src('public/**',{base:'public'})
    		 .pipe(dest('dist'))
}
const compile = parallel(style,script,page,image,font)
const build = series(clean,parallel(compile,extra))

module.export = {
 compile
 build
}
```

#### 21、Gulp案例-开发服务器

```javascript
//yarn add gulp gulp-sass gulp-babel @babel/core @babel/preset-env gulp-swig gulp-imagemin del glup-load-plugins browser-sync --dev
//gulpfile.js
const {src,dest,parallel,series} = reuqire('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const loadPlugins = require('glup-load-plugins')
const plugins = loadPlugins()
const bs = browserSync.create()
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
  pkg: require('./package.json'),
  date: new Date()
}
const clean = ()=>{
  return del(['dist'])
}
const style = ()=>{
  return src('src/assets/styles/*.scss',{base:'src'})
  			 .pipe(plugins.sass({outputStyle:'expanded'}))
    		 .pipe(dest('dist'))
}
const script = ()=>{
  return src('src/assets/script/*.js',{base:'src'})
  			 .pipe(plugins.babel({presets:['@babel/presets-env']}))
  			 .pipe(dest('dist'))
}
const page = ()=>{
  return src('src/**/*.html'，{base:'src'})//**为所以子目录
    		 .pipe(plugins.swig({data}))
  			 .pipe(dest('dist'))
}
const image = ()=>{
  return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const font = ()=>{
   return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const extra = ()=>{
   return src('public/**',{base:'public'})
    		 .pipe(dest('dist'))
}
const serve = ()=>{
  bs.init({
    notify:false,
    port:2080,
    //open:false,
    files:'dist/**',
    serve:{
      baseDir:'dist'
      routes:{
      	'/node_modules':'node_modules'
    	}
    }
  })
}
const compile = parallel(style,script,page,image,font)
const build = series(clean,parallel(compile,extra))

module.export = {
 compile,
 build,
 serve
}
```

####  22、Glup案例-监听变化以及构建优化

```javascript
//yarn add gulp gulp-sass gulp-babel @babel/core @babel/preset-env gulp-swig gulp-imagemin del glup-load-plugins browser-sync --dev
//gulpfile.js
const {src,dest,parallel,series,watch} = reuqire('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const loadPlugins = require('glup-load-plugins')
const plugins = loadPlugins()
const bs = browserSync.create()
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
  pkg: require('./package.json'),
  date: new Date()
}
const clean = ()=>{
  return del(['dist'])
}
const style = ()=>{
  return src('src/assets/styles/*.scss',{base:'src'})
  			 .pipe(plugins.sass({outputStyle:'expanded'}))
    		 .pipe(dest('dist'))
  			 .pipe(bs.reload({stream:true}))
}
const script = ()=>{
  return src('src/assets/script/*.js',{base:'src'})
  			 .pipe(plugins.babel({presets:['@babel/presets-env']}))
  			 .pipe(dest('dist'))
    		 .pipe(bs.reload({stream:true}))
}
const page = ()=>{
  return src('src/**/*.html'，{base:'src'})//**为所以子目录
    		 .pipe(plugins.swig({data,default:{ cache: false }}))
  			 .pipe(dest('dist'))
  			 .pipe(bs.reload({stream:true}))
}
const image = ()=>{
  return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const font = ()=>{
   return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const extra = ()=>{
   return src('public/**',{base:'public'})
    		 .pipe(dest('dist'))
}
const serve = ()=>{
  watch('src/assets/styles/*.scss',style)
  watch('src/assets/script/*.js',script)
  watch('src/**/*.html',page)
  //watch('src/assets/images/**',image)
  //watch('src/assets/images/**',font)
  //watch('public/**',extra)
  watch(['src/assets/images/**','src/assets/images/**','public/**'],bs.reload)
  bs.init({
    notify:false,
    port:2080,
    //open:false,
    //files:'dist/**',
    serve:{
      baseDir:['dist','src','public']
      routes:{
      	'/node_modules':'node_modules'
    	}
    }
  })
}
const compile = parallel(style,script,page)
//上线之前执行的任务
const build = series(clean,parallel(compile,extra,,image,font))

const develop = serise(compile,serve)

module.export = {
 compile,
 build,
 develop
}
```

#### 23、Glup案例-useref文件引用处理

```javascript
//yarn add gulp gulp-sass gulp-babel @babel/core @babel/preset-env gulp-swig gulp-imagemin del glup-load-plugins browser-sync gulp-useref --dev
//gulpfile.js
const {src,dest,parallel,series,watch} = reuqire('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const loadPlugins = require('glup-load-plugins')
const plugins = loadPlugins()
const bs = browserSync.create()
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
  pkg: require('./package.json'),
  date: new Date()
}
const clean = ()=>{
  return del(['dist'])
}
const style = ()=>{
  return src('src/assets/styles/*.scss',{base:'src'})
  			 .pipe(plugins.sass({outputStyle:'expanded'}))
    		 .pipe(dest('dist'))
  			 .pipe(bs.reload({stream:true}))
}
const script = ()=>{
  return src('src/assets/script/*.js',{base:'src'})
  			 .pipe(plugins.babel({presets:['@babel/presets-env']}))
  			 .pipe(dest('dist'))
    		 .pipe(bs.reload({stream:true}))
}
const page = ()=>{
  return src('src/**/*.html'，{base:'src'})//**为所以子目录
    		 .pipe(plugins.swig({data,default:{ cache: false }}))
  			 .pipe(dest('dist'))
  			 .pipe(bs.reload({stream:true}))
}
const image = ()=>{
  return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const font = ()=>{
   return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const extra = ()=>{
   return src('public/**',{base:'public'})
    		 .pipe(dest('dist'))
}
const serve = ()=>{
  watch('src/assets/styles/*.scss',style)
  watch('src/assets/script/*.js',script)
  watch('src/**/*.html',page)
  //watch('src/assets/images/**',image)
  //watch('src/assets/images/**',font)
  //watch('public/**',extra)
  watch(['src/assets/images/**','src/assets/images/**','public/**'],bs.reload)
  bs.init({
    notify:false,
    port:2080,
    //open:false,
    //files:'dist/**',
    serve:{
      baseDir:['dist','src','public']
      routes:{
      	'/node_modules':'node_modules'
    	}
    }
  })
}
const useref = ()=>{
  return src('dist/*.html',{base:'dist'})
  			 .pipe(plugins.useref({searchPath:['dist','.']}))
  			 .pipe(dest('dist'))
}
const compile = parallel(style,script,page)
//上线之前执行的任务
const build = series(clean,parallel(compile,extra,,image,font))

const develop = serise(compile,serve)

module.export = {
 compile,
 build,
 develop
}
```

#### 24、Gulp案例-文件压缩

```javascript
//yarn add gulp gulp-sass gulp-babel @babel/core @babel/preset-env gulp-swig gulp-imagemin del glup-load-plugins browser-sync gulp-useref gulp-htmlmin gulp-uglify gulp-clean-css glup-if --dev
//gulpfile.js
const {src,dest,parallel,series,watch} = reuqire('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const loadPlugins = require('glup-load-plugins')
const plugins = loadPlugins()
const bs = browserSync.create()
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
  pkg: require('./package.json'),
  date: new Date()
}
const clean = ()=>{
  return del(['dist'])
}
const style = ()=>{
  return src('src/assets/styles/*.scss',{base:'src'})
  			 .pipe(plugins.sass({outputStyle:'expanded'}))
    		 .pipe(dest('dist'))
  			 .pipe(bs.reload({stream:true}))
}
const script = ()=>{
  return src('src/assets/script/*.js',{base:'src'})
  			 .pipe(plugins.babel({presets:['@babel/presets-env']}))
  			 .pipe(dest('dist'))
    		 .pipe(bs.reload({stream:true}))
}
const page = ()=>{
  return src('src/**/*.html'，{base:'src'})//**为所以子目录
    		 .pipe(plugins.swig({data,default:{ cache: false }}))
  			 .pipe(dest('dist'))
  			 .pipe(bs.reload({stream:true}))
}
const image = ()=>{
  return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const font = ()=>{
   return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const extra = ()=>{
   return src('public/**',{base:'public'})
    		 .pipe(dest('dist'))
}
const serve = ()=>{
  watch('src/assets/styles/*.scss',style)
  watch('src/assets/script/*.js',script)
  watch('src/**/*.html',page)
  //watch('src/assets/images/**',image)
  //watch('src/assets/images/**',font)
  //watch('public/**',extra)
  watch(['src/assets/images/**','src/assets/images/**','public/**'],bs.reload)
  bs.init({
    notify:false,
    port:2080,
    //open:false,
    //files:'dist/**',
    serve:{
      baseDir:['dist','src','public']
      routes:{
      	'/node_modules':'node_modules'
    	}
    }
  })
}
const useref = ()=>{
  return src('dist/*.html',{base:'dist'})
  			 .pipe(plugins.useref({searchPath:['dist','.']}))
  				//html js css
  			 .pipe(plugins.if(/\.js$/,plugins.uglify()))
  			 				   .pipe(plugins.if(/\.html$/,plugins.htmlmin({collapseWhitespace:true,minifyCSS:true,minifyJS:true})))
  			 .pipe(plugins.if(/\.css$/,plugins.cleanCss()))
  			 .pipe(dest('release'))
}
const compile = parallel(style,script,page)
//上线之前执行的任务
const build = series(clean,parallel(compile,extra,,image,font))

const develop = serise(compile,serve)

module.export = {
 compile,
 build,
 develop
}
```

#### 25、Glup案例-重新规划构建过程

```javascript
//yarn add gulp gulp-sass gulp-babel @babel/core @babel/preset-env gulp-swig gulp-imagemin del glup-load-plugins browser-sync gulp-useref gulp-htmlmin gulp-uglify gulp-clean-css glup-if --dev
//gulpfile.js
const {src,dest,parallel,series,watch} = reuqire('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
const bs = browserSync.create()
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
  pkg: require('./package.json'),
  date: new Date()
}
const clean = ()=>{
  return del(['dist','temp'])
}
const style = ()=>{
  return src('src/assets/styles/*.scss',{base:'src'})
  			 .pipe(plugins.sass({outputStyle:'expanded'}))
    		 .pipe(dest('temp'))
  			 .pipe(bs.reload({stream:true}))
}
const script = ()=>{
  return src('src/assets/script/*.js',{base:'src'})
  			 .pipe(plugins.babel({presets:['@babel/presets-env']}))
  			 .pipe(dest('temp'))
    		 .pipe(bs.reload({stream:true}))
}
const page = ()=>{
  return src('src/**/*.html'，{base:'src'})//**为所以子目录
    		 .pipe(plugins.swig({data,default:{ cache: false }}))
  			 .pipe(dest('temp'))
  			 .pipe(bs.reload({stream:true}))
}
const image = ()=>{
  return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const font = ()=>{
   return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const extra = ()=>{
   return src('public/**',{base:'public'})
    		 .pipe(dest('dist'))
}
const serve = ()=>{
  watch('src/assets/styles/*.scss',style)
  watch('src/assets/script/*.js',script)
  watch('src/**/*.html',page)
  //watch('src/assets/images/**',image)
  //watch('src/assets/images/**',font)
  //watch('public/**',extra)
  watch(['src/assets/images/**','src/assets/images/**','public/**'],bs.reload)
  bs.init({
    notify:false,
    port:2080,
    //open:false,
    //files:'dist/**',
    serve:{
      baseDir:['temp','src','public'],
      routes:{
      	'/node_modules':'node_modules'
    	}
    }
  })
}
const useref = ()=>{
  return src('temp/*.html',{base:'temp'})
  			 .pipe(plugins.useref({searchPath:['temp','.']}))
  				//html js css
  			 .pipe(plugins.if(/\.js$/,plugins.uglify()))
  			 				   .pipe(plugins.if(/\.html$/,plugins.htmlmin({collapseWhitespace:true,minifyCSS:true,minifyJS:true})))
  			 .pipe(plugins.if(/\.css$/,plugins.cleanCss()))
  			 .pipe(dest('dist'))
}
const compile = parallel(style,script,page)
//上线之前执行的任务
const build = series(clean,parallel(serise(compile,useref),extra,,image,font))

const develop = serise(compile,serve)

module.export = {
 compile,
 build,
 develop
}
```

#### 26、Glup案例-补充

```javascript
//yarn add gulp gulp-sass gulp-babel @babel/core @babel/preset-env gulp-swig gulp-imagemin del glup-load-plugins browser-sync gulp-useref gulp-htmlmin gulp-uglify gulp-clean-css gulp-if --dev
//gulpfile.js
const {src,dest,parallel,series,watch} = reuqire('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const loadPlugins = require('glup-load-plugins')
const plugins = loadPlugins()
const bs = browserSync.create()
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
  pkg: require('./package.json'),
  date: new Date()
}
const clean = ()=>{
  return del(['dist','temp'])
}
const style = ()=>{
  return src('src/assets/styles/*.scss',{base:'src'})
  			 .pipe(plugins.sass({outputStyle:'expanded'}))
    		 .pipe(dest('temp'))
  			 .pipe(bs.reload({stream:true}))
}
const script = ()=>{
  return src('src/assets/script/*.js',{base:'src'})
  			 .pipe(plugins.babel({presets:['@babel/presets-env']}))
  			 .pipe(dest('temp'))
    		 .pipe(bs.reload({stream:true}))
}
const page = ()=>{
  return src('src/**/*.html'，{base:'src'})//**为所以子目录
    		 .pipe(plugins.swig({data,default:{ cache: false }}))
  			 .pipe(dest('temp'))
  			 .pipe(bs.reload({stream:true}))
}
const image = ()=>{
  return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const font = ()=>{
   return src('src/assets/fonts/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const extra = ()=>{
   return src('public/**',{base:'public'})
    		 .pipe(dest('dist'))
}
const serve = ()=>{
  watch('src/assets/styles/*.scss',style)
  watch('src/assets/script/*.js',script)
  watch('src/**/*.html',page)
  //watch('src/assets/images/**',image)
  //watch('src/assets/images/**',font)
  //watch('public/**',extra)
  watch(['src/assets/images/**','src/assets/images/**','public/**'],bs.reload)
  bs.init({
    notify:false,
    port:2080,
    //open:false,
    //files:'dist/**',
    serve:{
      baseDir:['temp','src','public'],
      routes:{
      	'/node_modules':'node_modules'
    	}
    }
  })
}
const useref = ()=>{
  return src('temp/*.html',{base:'temp'})
  			 .pipe(plugins.useref({searchPath:['temp','.']}))
  				//html js css
  			 .pipe(plugins.if(/\.js$/,plugins.uglify()))
  			 				   .pipe(plugins.if(/\.html$/,plugins.htmlmin({collapseWhitespace:true,minifyCSS:true,minifyJS:true})))
  			 .pipe(plugins.if(/\.css$/,plugins.cleanCss()))
  			 .pipe(dest('dist'))
}
const compile = parallel(style,script,page)
//上线之前执行的任务
const build = series(clean,parallel(series(compile,useref),extra,,image,font))

const develop = series(compile,serve)

module.export = {
 clean,
 build,
 develop
}
//可以放到package.json的script当中
"scripts":{
  "clean":"gulp clean",
  "build":"gulp build",
  "develop":"gulp develop"
}
//.gitignore文件中忽略一下目录
```

#### 27、封装工作流-提取gulpfile

1. 把gulpflie代码复制到入口文件lib/index.js中
2. 把需要的依赖复制到package.json中
3. 把写好的项目上传到npm
4. npm install完成之后导入，项目中的gulpfile使用module.exports = require('zce-pages')

#### 28、封装工作流-解决模块中的问题

1. 在项目目录下创建一个x(名字可自定义).config.js文件

```javascript
//yarn add gulp gulp-sass gulp-babel @babel/core @babel/preset-env gulp-swig gulp-imagemin del gulp-load-plugins browser-sync gulp-useref gulp-htmlmin gulp-uglify gulp-clean-css gulp-if --dev
//gulpfile.js
const {src,dest,parallel,series,watch} = reuqire('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const loadPlugins = require('glup-load-plugins')
const plugins = loadPlugins()
const bs = browserSync.create()
const cwd = process.cwd()
let config = {
  //default config
}

try{
  const loadConfig = require(`${cwd}/pages.config.js`)
  config = Object.assign({},config,loadConfig)
}catch(e){}

const clean = ()=>{
  return del(['dist','temp'])
}
const style = ()=>{
  return src('src/assets/styles/*.scss',{base:'src'})
  			 .pipe(plugins.sass({outputStyle:'expanded'}))
    		 .pipe(dest('temp'))
  			 .pipe(bs.reload({stream:true}))
}
const script = ()=>{
  return src('src/assets/script/*.js',{base:'src'})
  			 .pipe(plugins.babel({presets:[require('@babel/preset-env')]}))
  			 .pipe(dest('temp'))
    		 .pipe(bs.reload({stream:true}))
}
const page = ()=>{
  return src('src/**/*.html'，{base:'src'})//**为所以子目录
    		 .pipe(plugins.swig({data:config.data,default:{ cache: false }}))
  			 .pipe(dest('temp'))
  			 .pipe(bs.reload({stream:true}))
}
const image = ()=>{
  return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const font = ()=>{
   return src('src/assets/images/**',{base:'src'})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const extra = ()=>{
   return src('public/**',{base:'public'})
    		 .pipe(dest('dist'))
}
const serve = ()=>{
  watch('src/assets/styles/*.scss',style)
  watch('src/assets/script/*.js',script)
  watch('src/**/*.html',page)
  //watch('src/assets/images/**',image)
  //watch('src/assets/images/**',font)
  //watch('public/**',extra)
  watch(['src/assets/images/**','src/assets/fonts/**','public/**'],bs.reload)
  bs.init({
    notify:false,
    port:2080,
    //open:false,
    //files:'dist/**',
    server:{
      baseDir:['temp','src','public']
      routes:{
      	'/node_modules':'node_modules'
    	}
    }
  })
}
const useref = ()=>{
  return src('temp/*.html',{base:'temp'})
  			 .pipe(plugins.useref({searchPath:['temp','.']}))
  				//html js css
  			 .pipe(plugins.if(/\.js$/,plugins.uglify()))
  			 				   .pipe(plugins.if(/\.html$/,plugins.htmlmin({collapseWhitespace:true,minifyCSS:true,minifyJS:true})))
  			 .pipe(plugins.if(/\.css$/,plugins.cleanCss()))
  			 .pipe(dest('dist'))
}
const compile = parallel(style,script,page)
//上线之前执行的任务
const build = series(clean,parallel(serise(compile,useref),extra,,image,font))

const develop = serise(compile,serve)

module.export = {
 clean,
 build,
 develop
}
//可以放到package.json的script当中
"scripts":{
  "clean":"gulp clean",
  "build":"gulp build",
  "develop":"gulp develop"
}
//.gitignore文件中忽略一下目录
```

```javascript
module.exports = {
  data: {
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
  	pkg: require('./package.json'),
  	date: new Date()
	}
}
```

#### 29、封装工作流-抽象路径配置

```javascript
//yarn add gulp gulp-sass gulp-babel @babel/core @babel/preset-env gulp-swig gulp-imagemin del glup-load-plugins browser-sync gulp-useref gulp-htmlmin gulp-uglify gulp-clean-css glup-if --dev
//gulpfile.js
const {src,dest,parallel,series,watch} = reuqire('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const loadPlugins = require('glup-load-plugins')
const plugins = loadPlugins()
const bs = browserSync.create()
const cwd = process.cwd()
let config = {
  //default config
  build:{
    src:'src',
    dist:'dist',
    temp:'temp',
    pubilc:'public',
    paths:{
      styles:'assets/styles/*.scss',
      scripts:'assets/scripts/*.js',
      page:'*.html',
      images:'assets/images/**',
      fonts:'assets/fonts/**'
    }
  }
}

try{
  const loadConfig = require(`${cwd}/pages.config.js`)
  config = Object.assign({},config,loadConfig)
}catch(e){}

const clean = ()=>{
  return del([config.build.dist,config.build.temp])
}
const style = ()=>{
  return src(config.build.paths.styles,{base:config.build.src,cwd:config.build.src})
  			 .pipe(plugins.sass({outputStyle:'expanded'}))
    		 .pipe(dest(config.build.temp))
  			 .pipe(bs.reload({stream:true}))
}
const script = ()=>{
  return src(config.build.paths.script,{base:config.build.src,cwd:config.build.src})
  			 .pipe(plugins.babel({presets:[require('@babel/preset-env')]}))
  			 .pipe(dest(config.build.temp))
    		 .pipe(bs.reload({stream:true}))
}
const page = ()=>{
  return src(config.build.paths.page,{base:config.build.src,cwd:config.build.src})//**为所以子目录
    		 .pipe(plugins.swig({data:config.data,defaults:{ cache: false }}))
  			 .pipe(dest('temp'))
  			 .pipe(bs.reload({stream:true}))
}
const image = ()=>{
  return src(config.build.paths.images,{base:config.build.src,cwd:config.build.src})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const font = ()=>{
   return src(config.build.paths.font,{base:config.build.src,cwd:config.build.src})
  			 .pipe(plugins.imagemin())
    		 .pipe(dest('dist'))
}
const extra = ()=>{
   return src('**',{base:config.build.public,cwd:config.build.public})
    		 .pipe(dest(config.build.dist))
}
const serve = ()=>{
  watch(config.build.paths.style,{cwd:config.build.src},style)
  watch(config.build.paths.scripts,{cwd:config.build.src},script)
  watch(config.build.paths.page,{cwd:config.build.src},page)
  //watch('src/assets/images/**',image)
  //watch('src/assets/images/**',font)
  //watch('public/**',extra)
  watch([config.build.paths.images,config.build.paths.fonts],{cwd:config.build.src},bs.reload)
watch('**',{cwd:config.build.public},bs.reload)
  bs.init({
    notify:false,
    port:2080,
    //open:false,
    //files:'dist/**',
    server:{
      baseDir:['temp','src','public']
      routes:{
      	'/node_modules':'node_modules'
    	}
    }
  })
}
const useref = ()=>{
  return src(config.build.paths.pages,{base:config.build.temp,cwd:config.build.temp}})
  			 .pipe(plugins.useref({searchPath:[config.build.temp,'.']}))
  				//html js css
  			 .pipe(plugins.if(/\.js$/,plugins.uglify()))
  			 				   .pipe(plugins.if(/\.html$/,plugins.htmlmin({collapseWhitespace:true,minifyCSS:true,minifyJS:true})))
  			 .pipe(plugins.if(/\.css$/,plugins.cleanCss()))
  			 .pipe(dest(config.build.dist))
}
const compile = parallel(style,script,page)
//上线之前执行的任务
const build = series(clean,parallel(serise(compile,useref),extra,,image,font))

const develop = serise(compile,serve)

module.export = {
 clean,
 build,
 develop
}
```

#### 30、封装工作流-包装Gulp Cli

yarn gulp --gulpfile ./node_modules/zce-pages/lib/index.js --cwd .

1. 项目中添加bin/zce-pages.js
2. package.json添加"bin":zce-pages.js

```javascript
#!/usr/bin/env node
//zce-pages.js
process.argv.push('--cwd')
process.argv.push(process.cwd())
process.argv.push('--gulpfile')
process.argv.push(process.resolve('..'))

require('gulp/bin/gulp')
```

#### 31、封装工作流-发布并使用模块

1. 在package.json中的"files":["lib","bin"]
2. 提交一下git
3. yarn publish
4. 打开新目录，并下载我们传好的npm包，并使用

#### 32、FIS的基本使用

百度的前端团队推出的

1. yarn global add fis3
2. 添加fis-config.js文件
3. fis3 release  -d output

```javascript
//fis-config.js
fis.match('*.{js,scss,png}',{
  release:'/assets/$0'//$0表示当前文件原始的目录结构
})
```

#### 33、FIS编译与压缩

```javascript
//fis-config.js
//yarn global add dis-parser-node-asass
//fis3 inspect可以看到转换会转换什么文件
fis.match('*.{js,scss,png}',{
  release:'/assets/$0'//$0表示当前文件原始的目录结构
})
fis.match('**/*.scss',{
  rExt:'.css',
  parser:fis.plugin('node-sass'),
  optimizer:fis.plugin('clean-css')
})
fis.match('**/*.js',{
  parser:fis.plugin('babel-6.x')
  optimizer:fis.plugin('uglify-js')
})
```



