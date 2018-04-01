const Discord = require("discord.js")

const helpembedfalse = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("This bot is currently only for the administration of Kestrel.")
.setColor('RED');

const helpembedtrue = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("These are the Kestrel Discord Bot commands.")
.addField(`+help`, `Shows you all commands able to be ran.`)
.addField(`+ping`, `Response time of the bot.`)
.addField(`+mute`, `Mute users that break the rules.`)
.addField(`+unmute`, `Unmute the users that have served their punishment.`)
.addField(`+kick`, `Temporarily get rid of the problem causers.`)
.addField(`+ban`, `Permanently get rid of the problem causers.`)
.setColor('GREEN')

module.exports.run = (client, message, args) => {
    let user = message.mentions.users.first();

    if ("help"){
        let allowedRole = message.guild.roles.find("name", "Corporate Office");
        if (message.member.roles.has(allowedRole.id)) {
            message.reply({
                embed : helpembedtrue
            })
        } else {
            message.reply({
                embed : helpembedfalse
            })
        }
    }
}

module.exports.help = {
    name: "help"
}