'use strict';

/**
 * API Key & Token
 */
const SlackToken   = '<Your Bot Slack Token>';

/**
 * Define Required vars
 */
const botkit   = require( 'botkit' ),
      cstorage = require( './lib/custom_storage' )( { path: './storage' } );

/**
 * Build up Slack
 */
const controller = botkit.slackbot( { storage: cstorage } ),
      bot        = controller.spawn( { token: SlackToken } ),
      BOT        = require( './lib/bot_helper' )( controller );

/**
 * Fireup Slack's Real Time Messaging
 */
bot.startRTM( function( error, bot, payload ) {
	if( error ){
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
	.hears( [ 'remove (.*)' ], 'direct_message,direct_mention,mention', function( bot, message ) {
	    BOT.removeProject( bot, message, message.match[1] );
	})
	.hears( [ 'run (.*)' ], 'direct_message,direct_mention,mention', function( bot, message ) {
	    BOT.runCommand( bot, message, message.match[1] );
	});