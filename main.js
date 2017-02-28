const Discord = require("discord.js");
const config = require("./auth.json");

const arianaBot = new Discord.Client();

var version = "2017.02.27a";

arianaBot.on ("ready", () => {
    console.log("Ready!");
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
            message.channel.sendMessage("__Rules__:\n1) Don't be a dick\n2) No NSFW pictures\n3)No spamming pictures, however " +
	    "you can spam Ariana pictures in #cutie_cave\n4) Please always keep the topic of conversation in #arianatalk about " +
	    "Ariana, other discussions can be done in #dangerouswoman or #cutie_cave");
	    break;
        case "!setalbum":
            favoriteAlbum(message);
            break;
	case "!setstatus": //mod command
	    if (isMod(message)) {
		arianaBot.user.setGame(params);
		console.log(message.author.username + " has set my status to " + params);
	    } else {
		message.reply("lol no :rolling_eyes:");
	    break;
	case "!settopic": //mod command
	    if(isMod(message)) {
	        message.channel.setTopic(params);
		message.reply("topic updated.");
		console.log(message.author.username + " changed the topic in " + message.channel.name + " to " + params);
		} else {
		    message.reply("lol no :rolling_eyes:");
		}
            break;
        case "!speak": //mod command
            if(isMod(message)) {
                message.delete();
                message.channel.sendMessage(params);
            }
            break;
        case "!version":
            message.channel.sendMessage("Current version: " + version);
            break;
        }
});

arianaBot.on ("guildMemberAdd", (member) => {
    member.guild.channels.get(member.guild.id).sendMessage(member.user.username + " has joined the server! :smiley:");
    console.log(member.user.username + " joined " + member.guild.name);
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
            console.log(message.author.username + " has added themselves to the Dangerous Woman role.");
            break;
        case "me":
        case "my everything":
            message.member.addRole(myEverything);
            message.reply("your favorite album has been set to My Everything. :smiley:");
            console.log(message.author.username + " has added themselves to the My Everything role.");
            break;
        case "yt":
        case "yours truly":
            message.member.addRole(yoursTruly);
            message.reply("your favorite album has been set to Yours Truly. :smiley:");
            console.log(message.author.username + " has added themselves to the Yours Truly role.");
            break;
	case "clear":
	    clearAlbum(message);
	    message.reply("your favorite album has been cleared. :frowning:");
	    console.log(message.author.username + " has cleared their favorite album. Appropriate roles have been removed.");
	    break;
    }
}

function isMod(message) {
    return message.member.roles.exists("name", "Moonlight") || message.member.roles.exists("name", "Be Alright");
}

arianaBot.login(config.token);
