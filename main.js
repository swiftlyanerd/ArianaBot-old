const Discord = require("discord.js");
const config = require("./auth.json");

const arianaBot = new Discord.Client();

var version = "2017.02.28a";

arianaBot.on ("ready", () => {
    console.log("Logged in as " + arianaBot.user.username + " - " + arianaBot.user.id + "\nReady!");
});

arianaBot.on ('message', message => {
    var command = message.content.split(" ");
    var params = command.slice(1, command.length).join(" ");

    switch(command[0].toLowerCase()) {
        case "!commands":
        case "!help":
	    message.channel.sendMessage("__My Commands__:\n!commands, !help: Displays my available commands.\n!rules: Displays the rules" + 
            "\n!setalbum: Grants you a role based on what your favorite album is.\n!version: Displays the current version the bot is running on.");
	    break;
        case "!eval":
            if (message.author.id == config.ownerID) {
                if (command[1] == null) {
                    message.reply ("You have not specified what you want me to evaluate! :(");
                } else {
                    try {
                        var evaled = eval(params);
                        if (typeof evaled !== "string")
                            evaled = require("util").inspect(evaled);
                            message.channel.sendMessage("```xl\n" + clean(evaled) + "\n```");
                    } catch (err) {
                        message.channel.sendMessage("`ERROR` ```xl\n" + clean(err) + "\n```");
                    }
                }
            } else {
                message.reply("lol no :rolling_eyes:");
            }
            break;
        case "!rules":
            message.channel.sendMessage("__Rules__:\n1) Don't be a dick\n2) No NSFW pictures\n3) No spamming pictures, however " +
	    "you can spam Ariana pictures in <#285538056772255754>\n4) Please always keep the topic of conversation in <#285890540988268555> about " +
	    "Ariana. Other discussions can be held in <#285493585120591892> or <#285538056772255754>");
	    break;
        case "!setalbum":
            favoriteAlbum(message);
            break;
        case "!version":
            message.channel.sendMessage("Current version: " + version);
            break;
	//mod commands
        case "!ban":
	    var userToBan = message.mentions.users.first();
	    if(isMod(message)) {
                message.guild.member(userToBan).ban();
		message.reply(userToBan.username + " was banned from the server! :open_mouth:");
		modlog(userToBan.username + " was banned from the server by " + message.author.username + ".");
	    } else {
	        message.reply("lol no :rolling_eyes:");
	    }
	    break;
	case "!kick":
	    var userToKick = message.mentions.users.first();
	    if(isMod(message)) {
                message.guild.member(userToKick).kick();
		message.reply(userToKick.username + " was kicked from the server! :open_mouth:");
		modlog(userToKick.username + " was kicked from the server by " + message.author.username + ".");
	    } else {
	        message.reply("lol no :rolling_eyes:");
	    }
	    break;
	case "!mute":
	    var userToMute = message.mentions.users.first();
	    if (isMod(message)) {
	        message.channel.overwritePermissions(userToMute, {SEND_MESSAGES: false });
		message.reply(userToMute.username + " was muted! :open_mouth:");
		modlog(userToMute.username + " was muted by " + message.author.username + " in " + message.channel.name + ".");
	    } else {
		message.reply("lol no :rolling_eyes:");
	    }
	    break;
	case "!unmute":
	    var userToUnmute = message.mentions.users.first();
	    if (isMod(message)) {
	        message.channel.overwritePermissions(userToUnmute, {SEND_MESSAGES: null });
		message.reply(userToUnmute.username + " was unmuted! :open_mouth:");
		modlog(userToUnmute.username + " was unmuted by " + message.author.username + " in " + message.channel.name + ".");
	    } else {
		message.reply("lol no :rolling_eyes:");
	    }
	    break
	case "!setstatus":
	    if (isMod(message)) {
		arianaBot.user.setGame(params);
		log(message.author.username + " has set my status to " + params);
	    } else {
		message.reply("lol no :rolling_eyes:");
	    }
	    break;
	case "!settopic":
	    if(isMod(message)) {
	        message.channel.setTopic(params);
		message.reply("topic updated.");
		log(message.author.username + " changed the topic in " + message.channel.name + " to " + params);
		} else {
		    message.reply("lol no :rolling_eyes:");
		}
            break;
        case "!speak": 
            if(isMod(message)) {
                message.delete();
                message.channel.sendMessage(params);
            }
            break;
        //admin commands
	case "!restart":
            if(message.member.roles.exists("name", "Moonlight")) {
		log("I was restarted by " + message.author.username + ".");
	        process.exit(-1);
	    } else {
	        message.reply("lol no :rolling_eyes:");
		log(message.author.username + " attempted to restart me.");
	    }
	    break;
        }
});

arianaBot.on("guildMemberAdd", (member) => {
    member.guild.channels.get(member.guild.id).sendMessage(member.user.username + " has joined the server! :smiley:");
    modlog(member.user.username + " joined " + member.guild.name);
});

arianaBot.on("guildMemberRemove", (member) => {
    modlog(member.user.username + " has either been kicked or left the server.");
});

function clean(text) {
    if (typeof(text) === "string") {
        return text.replace(/` /g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    } else {
        return text;
    }
}

function clearAlbum(message) {
    var roles = message.member.roles;
    var dangerousWoman = message.guild.roles.find("name", "Dangerous Woman");
    var myEverything = message.guild.roles.find("name", "My Everything");
    var yoursTruly = message.guild.roles.find("name", "Yours Truly");

    roles.forEach(function (role) {
        switch(role.name) {
	    case "Dangerous Woman":
	        message.member.removeRole(dangerousWoman);
		break;
	    case "My Everything":
		message.member.removeRole(myEverything);
		break;
	    case "Yours Truly":
		message.member.removeRole(yoursTruly);
		break;
	}
    });
}

function favoriteAlbum(message) {
    var command = message.content.split(" ");
    var params = command.slice(1, command.length).join(" ");
   
    var dangerousWoman = message.guild.roles.find("name", "Dangerous Woman");
    var myEverything = message.guild.roles.find("name", "My Everything");
    var yoursTruly = message.guild.roles.find("name", "Yours Truly");

    if (command[1] == null) {
        message.reply("you need to select your favorite album. Ariana's albums are: Dangerous Woman, My Everything, and Yours Truly.");
        return;
    }

    switch(params.toLowerCase()) {
	case "dw":
        case "dangerous woman":
            message.member.addRole(dangerousWoman);
            message.reply("your favorite album has been set to Dangerous Woman. :smiley:");
            log(message.author.username + " has added themselves to the Dangerous Woman role.");
            break;
        case "me":
        case "my everything":
            message.member.addRole(myEverything);
	    message.reply("your favorite album has been set to My Everything. :smiley:");
            log(message.author.username + " has added themselves to the My Everything role.");
            break;
        case "yt":
        case "yours truly":
            message.member.addRole(yoursTruly);
            message.reply("your favorite album has been set to Yours Truly. :smiley:");
            log(message.author.username + " has added themselves to the Yours Truly role.");
            break;
	case "clear":
	    clearAlbum(message);
	    message.reply("your favorite album has been cleared. :frowning:");
	    log(message.author.username + " has cleared their favorite album. Appropriate roles have been removed.");
	    break;
    }
}

function isMod(message) {
    return message.member.roles.exists("name", "Moonlight") || message.member.roles.exists("name", "Be Alright");
}

function log(message) {
    arianaBot.users.get("147109473155022848").sendMessage(message); //Fearless Swiftie
    console.log(message);
}

function modlog(message) {
    arianaBot.users.get("147109473155022848").sendMessage(message); //Fearless Swiftie
    arianaBot.users.get("163245022181982208").sendMessage(message); //joeyer5
    arianaBot.users.get("118197472232341511").sendMessage(message); //SavoyRoad
    arianaBot.users.get("115631289201065993").sendMessage(message); //Compressirk
    arianaBot.users.get("244629699521675265").sendMessage(message); //Lindsey
    console.log(message);
}

arianaBot.login(config.token);
