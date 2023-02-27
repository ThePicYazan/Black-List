const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

const { Client, MessageEmbed } = require('discord.js');
const client = new Client({ intents: 32767 });
const { prefix , color, GUILD , ROLE } = require('./config.json');
const mongoose = require('mongoose');
const { user } = require('./DataBase/user');
const { blackk } = require('./DataBase/data');

client.on('ready',async () => {
  await console.log(`[ Logged in as ${client.user.tag}! ]`);
  await mongoose.connect(process.env.mongo).then(async () => {
    await console.log('Login Mongo');
  }).catch(async () => {
    await console.log('Bad url Mongo');
  })
}).login(process.env.token).catch(err => {console.log('Erorr Token Not Invite..')});


client.on('messageCreate', async message => {
  if(!message.content.startsWith(prefix) || message.author.bot) return;
  if(!message.member.permissions.has('ADMINISTRATOR')) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  
  if(command === 'black-list') {

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) {
      let embed = new MessageEmbed()
      embed.setDescription(`منشن شخص`)
      embed.setColor('NOT_QUITE_BLACK')

      await message.channel.send({embeds : [embed]})
    } else {
      let data = await user.findOne({
        Member : member.id,
      });

      if(!data) {
        await user.create({
          Member : member.id,
        });

        let embed = new MessageEmbed()
        embed.setDescription(`تم اعطاء شخص بلاك لست ${member}`)
        embed.setColor('NOT_QUITE_BLACK')

        await message.channel.send({embeds : [embed]});
      } else {

        let embed = new MessageEmbed()
        embed.setDescription(`شخص معه بلاك لست من قبل ${member}`)
        embed.setColor('NOT_QUITE_BLACK')

        await message.channel.send({embeds : [embed]});
      }
    }
  }
});

client.on('messageCreate', async message => {
  if(!message.content.startsWith(prefix) || message.author.bot) return;
  if(!message.member.permissions.has('ADMINISTRATOR')) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  
  if(command === 'black-remove') {

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if(!member) {

      let embed = new MessageEmbed()
      embed.setDescription(`منشن شخص`)
      embed.setColor('NOT_QUITE_BLACK')

      await message.channel.send({embeds : [embed]});
    } else {

      let data = await user.findOne({
        Member : member.id,
      });

      if(!data) {
        let embed = new MessageEmbed()

        embed.setDescription('ما في بلاك لست')
        embed.setColor('NOT_QUITE_BLACK')

        await message.channel.send({embeds : [embed]});

      } else {

        await user.deleteMany({
          Member : member.id,
        });

        let embed = new MessageEmbed()

        embed.setDescription('تم حذف البلاك لست')
        embed.setColor('NOT_QUITE_BLACK')

        await message.channel.send({embeds : [embed]});
      }
    }
  }
});

async function blacklist() {
  try {
    
  let member = await blackk.find();

  for (let key of member) {
    
    for (let index = 0; index < key.Member.length; index++) {
      const ids = key.Member[index];

      let guild = await client.guilds.fetch(GUILD);

      let vip = await guild.members.fetch(ids);

      await vip.roles.set([ROLE],'Reason Black-list');
    } 
  }
} catch (err) {
    //await console.log(err);
}}

setInterval(async () => {
  await blacklist();
}, 3000);
