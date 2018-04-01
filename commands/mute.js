const fs = module.require("fs");
const Discord = require("discord.js")

const missingperm = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("You do not have the manage roles permission.")
.setColor('ORANGE');

const mismention = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("You have to mention a user to mute them.")
.setColor('ORANGE');

const selfmute = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("You can't mute yourself.")
.setColor('ORANGE');

const higherperm = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("You can't mute people with higher roles than you.")
.setColor('ORANGE');

const missingmod = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("This server is missing a moderation log channel.")
.setColor('ORANGE');

const missingreason = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("You must supply a reason to mute someone.")
.setColor('ORANGE');

const currentmute = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("This user is already muted.")
.setColor('ORANGE');

const mutenotice = new Discord.RichEmbed()
.setTitle("Kestrel Discord Bot")
.setDescription("I have muted the user.")
.setColor('RED');

module.exports.run = async (client, message, args) => {
    let user = message.mentions.users.first();
    let reason = message.content.split(" ").slice(2).join(" ");
    let modlog = client.channels.find("name", "modlog");
	if(!message.member.hasPermission("MANAGE_ROLES")) return message.reply({
		embed : missingperm
	});

	let toMute = message.mentions.members.first() || message.guild.members.get(args[0]);
	if(!toMute) return message.reply({
		embed : mismention
	});

	if(toMute.id === message.author.id) return message.reply({
		embed : selfmute
	});
    if(toMute.highestRole.position >= message.member.highestRole.position) return message.reply({
		embed : highermute
	});
    
    if(!modlog) return message.reply({
		embed : missingmod
	});
    if (message.mentions.users.size < 1) return message.reply({
		embed : mismention
	});
    if(!reason) return message.reply({
		embed : missingreason
	})

	let role = message.guild.roles.find(r => r.name === "Muted");
	if(!role) {
		try {
			role = await message.guild.createRole({
				name: "Muted",
				color: "#000000",
				permissions: []
			});

			message.guild.channels.forEach(async (channel, id) => {
				await channel.overwritePermissions(role, {
					SEND_MESSAGES: false,
					ADD_REACTIONS: false
				});
			});
		} catch(e) {
			console.log(e.stack);
		}
	}

	if(toMute.roles.has(role.id)) return message.reply({
		embed : currentmute
	});

	client.mutes[toMute.id] = {
		guild: message.guild.id,
		time: Date.now() + parseInt(args[1]) * 1000
	}

	await toMute.addRole(role);

	fs.writeFile("./mutes.json", JSON.stringify(client.mutes, null, 4), err => {
		if(err) throw err;
		message.reply({
			embed : mutenotice
		})
	})

    const muteembed = new Discord.RichEmbed()
    .setAuthor(`I muted ${user.username}`, user.displayAvatarURL)
	.addField("Mute Information", `**Muted User:** ${user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
	.setColor('RED');
    modlog.send({
        embed : muteembed
    })

}

module.exports.help = {
	name: "mute"
}