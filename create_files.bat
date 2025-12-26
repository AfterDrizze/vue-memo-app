@echo off
chcp 65001 >nul
echo 正在创建 Vue 3 备忘录应用项目结构...
echo.

REM 创建根目录文件
echo. > package.json
echo. > index.html
echo. > vite.config.js
echo. > .gitignore
echo. > README.md

REM 创建 src 目录及其文件
mkdir src 2>nul
echo. > src\main.js
echo. > src\App.vue
echo. > src\styles\main.less

REM 创建 components 目录及其文件
mkdir src\components 2>nul
echo. > src\components\Header.vue
echo. > src\components\FolderList.vue
echo. > src\components\MemoList.vue
echo. > src\components\MemoEditor.vue
echo. > src\components\AuthForm.vue

REM 创建 views 目录及其文件
mkdir src\views 2>nul
echo. > src\views\Home.vue
echo. > src\views\Login.vue

REM 创建 router, store, utils 目录
mkdir src\router 2>nul
echo. > src\router\index.js
mkdir src\store 2>nul
echo. > src\store\index.js
mkdir src\utils 2>nul
echo. > src\utils\storage.js

echo 项目骨架创建完成！
echo.
echo 接下来：
echo 1. 用我提供的代码内容填充这些空文件。
echo 2. 在此文件夹打开终端，运行：git init
echo 3. 然后运行：npm install
pause