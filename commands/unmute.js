const fs = require("fs");
const Discord = require("discord.js")

const missingmember = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("Please mention a user to unmute.")
.setColor('ORANGE');

const mismute = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("This user is not muted.")
.setColor('ORANGE');

const unmuteembed = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("I have unmuted this user.")
.setColor('GREEN');

const noperm = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("You do not have the manage roles permission.")
.setColor('ORANGE');

module.exports.run = async (client, message, args) => {
	if(!message.member.hasPermission("MANAGE_ROLES")) return message.reply({
		embed : noperm
	});

	let toMute = message.mentions.members.first() || message.guild.members.get(args[0]);
	if(!toMute) return message.reply({
		embed : missingmember
	});

	let modlog = client.channels.find("name", "modlog");
	let user = message.mentions.users.first();

	let role = message.guild.roles.find(r => r.name === "Muted");

	if(!role || !toMute.roles.has(role.id)) return message.reply({
		embed : mismute
	});

	await toMute.removeRole(role);

	delete client.mutes[toMute.id];

	fs.writeFile("./mutes.json", JSON.stringify(client.mutes), err => {
		if(err) throw err;
        message.reply({
			embed : unmuteembed
		})
	});
	
	const unmutemodlog = new Discord.RichEmbed()
    .setAuthor(`I unmuted ${user.username}`, user.displayAvatarURL)
	.addField("Unmute Information", `**Unmuted User:** ${user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** Mute expiration.`)
	.setColor('GREEN');
    modlog.send({
        embed : unmutemodlog
    })
}

module.exports.help = {
	name: "unmute"
}