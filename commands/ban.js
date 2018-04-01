const Discord = require("discord.js")

const selfperm = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("You do not have the ban members permission.")
.setColor('ORANGE');

const botperm = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("I do not have the ban members permission.")
.setColor('ORANGE');

const missingmod = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("This server is missing a moderation log channel.")
.setColor('ORANGE');

const mismention = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("You have to mention a user to ban them.")
.setColor('ORANGE');

const missingreason = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("You must supply a reason to ban someone.")
.setColor('ORANGE');

const higherperm = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("You can't ban people with higher roles than you.")
.setColor('ORANGE');

module.exports.run = (client, message, args) => {
    if(!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) return message.reply({
        embed : selfperm
    });
    if(!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) return message.reply({
        embed : botperm
    });
    let user = message.mentions.users.first();
    let reason = message.content.split(" ").slice(2).join(" ");
    let modlog = client.channels.find("name", "general");

    if(!modlog) return message.reply({
        embed : missingmod
    });
    if (message.mentions.users.size < 1) return message.reply({
        embed : mismention
    });
    if(!reason) return message.reply({
        embed : missingreason
    })
    if (!message.guild.member(user).bannable) return message.reply({
        embed : higherperm
    })

    message.guild.member(user).ban();

    const banembed = new Discord.RichEmbed()
    .setAuthor(`I banned ${user.username}`, user.displayAvatarURL)
    .addField("Ban Information", `**Banned User:** ${user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`);
    modlog.send({
        embed : banembed
    })
}
    module.exports.help = {
        name: "ban"
    }
