const Discord = require("discord.js")

const mismention = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("You have to mention someone to view their details.")
.setColor('ORANGE');

module.exports.run = (client, message, args) => {

    let user = message.mentions.users.first();

    if (message.mentions.users.size < 1) return message.reply({
		embed : mismention
	});

    const information = new Discord.RichEmbed()
    .setAuthor(`Info for ${user.username}#${user.discriminator}`, user.displayAvatarURL)
    .setThumbnail(user.displayAvatarURL)
    .setFooter(`This is the info for ${user.username}#${user.discriminator}`, user.displayAvatarURL)
    .addField(`**User Username:** ${user.username}\n\n`, `\n\n**User Discriminator:** ${user.discriminator}\n\n**User Status:** ${user.presence.status}\n\n**User Playing:** ${user.presence.game}\n\n**User ID:** ${user.id}\n\n`)
    message.reply({
        embed : information
    })
};

module.exports.help = {
    name: "userinfo"
}