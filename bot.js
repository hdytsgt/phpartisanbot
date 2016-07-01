'use strict';

/**
 * API Key & Token
 */
const SlackToken   = '<Your Bot Slack Token>';

/**
 * Define Required vars
 */
var botkit  = require( 'botkit' ),
    exec    = require( 'child_process' ).exec;

/**
 * Build up Slack
 */
var controller = botkit.slackbot({
                    json_file_store: 'storage'
                 });
var bot        = controller.spawn({ 
                    token: SlackToken
                 });

/**
 * Fireup Slack's Real Time Messaging
 */
bot.startRTM( function( err, bot, payload ) {
	if( err ){
		throw new Error( 'Could not connect to Slack' );
	}
});

/**
 * Bot Listening...
 */
controller
	.hears( [ 'register project (.*) (.*)' ], 'direct_message,direct_mention,mention', function( bot, message ) {
	    BOT.registerProject( bot, message, message.match[ 1 ], message.match[ 2 ] );
	})
	.hears( [ 'list projects' ], 'direct_message,direct_mention,mention', function( bot, message ) {
	    BOT.listProject( bot, message, true );
	})
	.hears( [ 'use (.*)' ], 'direct_message,direct_mention,mention', function( bot, message ) {
	    BOT.setProject( bot, message, message.match[1] );
	})
	.hears( [ 'run (.*)' ], 'direct_message,direct_mention,mention', function( bot, message ) {
	    BOT.runCommand( bot, message, message.match[1] );
	});

/**
 * BOT Class
 */
var BOT = {

	/**
	 * Run artisan command
	 * 
	 * @param  bot
	 * @param  message
	 * @param  command
	 * 
	 * @return void
	 */
	runCommand: function( bot, message, command ) {
		
		controller.storage.teams.get( 'current', function( error, data ) {

			if( !error ) {

				var projectName = data.project;

				controller.storage.teams.get( projectName, function( error, data ) {

					var _command = 'php ' + data.path + '/artisan ' + command

					bot.reply( message, 'Executing your command under *'+ projectName +'*.... :hourglass:' );

					exec( _command, function( error, stdout, stderr ) {

						if( error )
							bot.reply( message, error );

						if( stdout )
							bot.reply( message, '```' + stdout + '```' );
						
						if( stderr )
							bot.reply( message, '```stderr : ' + stderr + '```' );

					});

				});
			} else {
				bot.reply( message, 'You haven\'t set any project sir! :confused: Try use `use <project-name>`' );
			}

		});
	},

	/**
	 * Register Project into Storage
	 * 
	 * @param  bot
	 * @param  message
	 * @param  path
	 * @param  projectName
	 * 
	 * @return void
	 */
	registerProject: function( bot, message, path, projectName ) {

		var _invalid = 'You already have a project with this name sir! :pensive: Check your project by `list projects`';

		BOT.validateProject( bot, message, projectName, _invalid, function() {

			controller.storage.teams.save({
				id : projectName,
				path : path
			}, function( error ) {

				if( error ) throw new Error( 'Something wrong while registering project : ' + error );

				bot.reply( message, 'Registering your project sir! Hold on a sec... :hourglass:' );
				bot.reply( message, 'Okay! Project is registered sir! :tada: Here are your project list :point_down:' );
				BOT.listProject( bot, message );
			
			});
		});
	},

	/**
	 * List Project inside Storage
	 * 
	 * @param  bot
	 * @param  message
	 * @param  displayMessage
	 * 
	 * @return void
	 */
	listProject: function( bot, message, displayMessage = false ) {

		var _projects = '';

		controller.storage.teams.all( function( error, data ) {

			if( error ) throw new Error( 'Something wrong while registering project : ' + error );

			if( typeof data !== 'undefined' && data.length ) {

				if( displayMessage )
					bot.reply( message, 'Here are your registered projects so far :point_down:' );

				var _count = 0;

				data.map( function( project ) {
					if( project.id != 'current' )
						_projects = _projects + ( ++_count ) + '. *' + project.id + '*\n';
				});

				bot.reply( message, _projects );

			} else {

				if( displayMessage )
					bot.reply( message, 'You don\'t have project registered :confused: Try adding one : `register project <full/path> <project-name>`' );
			
			}
		});
	},

	/**
	 * Validate Project if Already Exists or Not
	 * 
	 * @param  bot
	 * @param  message
	 * @param  projectName
	 * @param  invalidMessage
	 * @param  callback
	 * 
	 * @return void
	 */
	validateProject: function( bot, message, projectName, invalidMessage, callback ) {

		controller.storage.teams.get( projectName, function( error, data ) {

			if( !error ) {
				bot.reply( message, invalidMessage );
			} else {
				callback();
			}
			
		});
	},

	/**
	 * Set Project as Main Project
	 * 
	 * @param bot
	 * @param message
	 * @param projectName
	 *
	 * @return void
	 */
	setProject: function( bot, message, projectName ) {

		controller.storage.teams.get( projectName, function( error, data ) {

			if( !error ) {

				controller.storage.teams.save({
					id : 'current',
					project : projectName
				}, function( error ) {

					if( error ) throw new Error( 'Something wrong while registering project : ' + error );

					bot.reply( message, 'Okay! *'+ projectName +'* is activated sir! :thumbsup:' );
				
				});

			} else {

				bot.reply( message, 'Project *'+ projectName +'* is not exists sir! :confused:' );
			
			}
		});
	}

};