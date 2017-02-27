const Discord = require('discord.js');
const config = require('./auth.json');

const arianaBot = new Discord.Client();

var version = "v0.01";

arianaBot.on ('ready', () => {
    console.log('Ready!');
});

arianaBot.on ('message', message => {
    var command = message.content.split(" ");
    var params = command.slice(1, command.length).join(" ");

    switch(command[0].toLowerCase()) {
        case "!eval":
            if (message.author.id == config.ownerID) {
                if (command[1] == null) {
                    message.reply ("You have not specified what you want me to execute! :(");
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
                message.reply("Nice try :rolling_eyes:");
            }
            break;
        case "!setalbum":
            favoriteAlbum(message);
            break;
        case "!speak":
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

function clean(text) {
    if (typeof(text) === "string") {
        return text.replace(/` /g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    } else {
        return text;
    }
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
        case "dangerous woman":
            message.member.addRole(dangerousWoman);
            message.reply("your favorite album has been set to Dangerous Woman. :smiley:");
            console.log(message.author.username + " has added themselves to the Dangerous Woman role.");
            break;

        case "my everything":
            message.member.addRole(myEverything);
            message.reply("your favorite album has been set to My Everything. :smiley:");
            console.log(message.author.username + " has added themselves to the My Everything role.");
            break;

        case "yours truly":
            message.member.addRole(yoursTruly);
            message.reply("your favorite album has been set to Yours Truly. :smiley:");
            console.log(message.author.username + " has added themselves to the Yours Truly role.");
            break;
    }
}

function isMod(message) {
    return message.member.roles.exists("name", "admins") || message.member.roles.exists("name", "mods");
}

arianaBot.login(config.token);
