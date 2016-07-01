# phpartisanbot

A Node.js-based Slack bot for running Laravel's `php artisan` through chat.

This bot require [Slack Bot Token](https://my.slack.com/services/new/bot).



## Available Command

There are few commands available, following command sorted by usage steps :

1. `register project <full_path> <project-name>` 

   Where **full_path** is your laravel installation full path and **project-name** is your project name.

   This command will register your project into this bot.

2. `list projects` 

   This command will list all of your registered projects

3. `use <project-name>`

   Where **project-name** is your registered project name. This command will make your project as main project and will be used globally when you run any Laravel's artisan command

4. `run <artisan command>`

   Where **artisan command** is anything from Laravel's artisan commands, you can see available commands [here](https://laravel.com/docs/master/artisan) or just type `run list`




## Installation

This should just works as any other Node.js application. 

1. Pull this repo
2. Go to **phpartisanbot** folder and run `npm install`
3. Run `node bot.js` or you can use any Node.js manager like [PM2](https://github.com/Unitech/PM2/) : `pm2 start bot.js`




## Example

Register project :

`register project /Application/MAMP/htdocs/laravel-project laravel`

Use **laravel** project as main project

`use laravel`

Some artisan commands usage :

1. `run route:list` this is similar to `php artisan route:list`
2. `run make:controller FooController` similar to : `php artisan make:controller FooController`
3. `run make:migration create_table_foo` similar to : `php artisan make:migration create_table_foo`

And many more!



## Screenshot

![Screenshot](https://raw.githubusercontent.com/hdytsgt/phpartisanbot/master/screenshot.png)