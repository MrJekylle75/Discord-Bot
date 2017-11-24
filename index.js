const { Client } = require('discord.js');
const {readdir} = require('fs-nextra');
const Enmap = require('enmap');
const snekfetch = require('snekfetch');
if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');

class GrandBot extends Client{
  constructor(options){
    super(options);
    this.db = require('./functions/EnmapDB.js');
    this.config = require('./config.json');
    this.commands = new Enmap();
    this.aliases = new Enmap();
    this.invspam = new Enmap();
  }

  permLvl(message){
    let level = 0;
    const ownerList = client.config.ownerIDs;
	const authorizedList = client.config.authorizeIDs;
    for(let i = 0; i < ownerList.length; i++){
      if(ownerList[i].includes(message.author.id)) return level = 10;
    }
	for(let i = 0; i < authorizedList; i++){
	  if(authorizedList[i].includes(message.author.id)) return level = 9;
	}
    if (message.channel.type === "text" && message.guild.ownerID === message.author.id) return level = 5;
    return level;
  }

  log(type, message, title) {
    if (!title) title = 'Log';
    console.log(`[${type}] [${title}]${message}`);
  }

  clean(client, text) {
    if (text && text.constructor.name == 'Promise')
      text = text;
    if (typeof evaled !== 'string')
      text = require('util').inspect(text, {
        depth: 1
      });

    text = text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(client.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

    return text;
  };
}

  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

const client = new GrandBot({
  fetchAllMembers: true,
  disabledEvents:['TYPING_START']
});


client.on('ready', () => {
  console.log('Start')
  var i = 0;
 setInterval(function () {
    var gamePresence = [
      `${client.config.prefix}help for ${client.users.size} users !`,
      `${client.config.prefix}help in ${client.guilds.size} servers !`,
      `${client.config.prefix}help for commands !`,
    ];
    client.user.setGame(gamePresence[i%gamePresence.length], 'https://twitch.tv/speezingbot');
    i++;
  },6500);
})
const init = async () => {
  const cmdFiles = await readdir('./commands/');
  client.log('log', `Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    try {
      const props = new (require(`./commands/${f}`))(client);
      if (f.split('.').slice(-1)[0] !== 'js') return;
      client.log('log', `Loading Command: ${props.help.name}. ✔`);
      client.commands.set(props.help.name, props);
      if (props.init) props.init(client);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
    } catch (error) {
      client.log(`Unable to load command ${f}: ${error}`);
    }
  });

  const evtFiles = await readdir('./events/');
  client.log('log', `Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split('.')[0];
    const event = new (require(`./events/${file}`))(client);
    client.on(eventName, (...args) => event.execute(...args));
    client.log('log', `Loading Event: ${eventName}. ✔`);
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  const express = require("express");
  var RedisSessions = require("redis-sessions");
  var rs = new RedisSessions();
  var ffmpeg = require("ffmpeg");
  var search = require('youtube-search');
  var errorlog = require("./jsonlist/errors.json")
  var moment = require("moment");
  var app = express();
  var util = require('util');
  var youtube_node = require('youtube-node');
  var request = require('request');
  var ytdl = require('ytdl-core');
  var config = {"youtube_api_key" : 'AIzaSyAXEstqyMMD4QmxNpEHHYRpe0IsQ6LcjhY'}
  var queues = {};
  var opts = { part: 'snippet', maxResults: 10, key: 'AIzaSyAXEstqyMMD4QmxNpEHHYRpe0IsQ6LcjhY'};      
  var intent; 
  var fighting = new Set();
  var paused = {};
  const prefix = '/';
  const fs = require('fs');
  const rep = JSON.parse(fs.readFileSync('./jsonlist/rep.json', 'utf8'));
  const rdate = JSON.parse(fs.readFileSync('./jsonlist/rdate.json', 'utf8'));
  const ddate = JSON.parse(fs.readFileSync('./jsonlist/ddate.json', 'utf8'));
  const fdate = JSON.parse(fs.readFileSync('./jsonlist/fdate.json', 'utf8'))
  const daily = JSON.parse(fs.readFileSync('./jsonlist/daily.json', 'utf8'));
  const fortune = JSON.parse(fs.readFileSync('./jsonlist/fortune.json', 'utf8'))
  const pretty = require('pretty-ms');
  const Discord = require('discord.js')
  const msg = JSON.parse(fs.readFileSync('./jsonlist/msg.json', 'utf8'));
  const lvl = JSON.parse(fs.readFileSync('./jsonlist/lvl.json', 'utf8'));
  const exp = JSON.parse(fs.readFileSync('./jsonlist/exp.json', 'utf8'));
  const autorole = JSON.parse(fs.readFileSync('./jsonlist/autorole.json', 'utf8'));

  function getQueue(guild) {
        if (!guild) return
        if (typeof guild == 'object') guild = guild.id
        if (queues[guild]) return queues[guild]
        else queues[guild] = []
        return queues[guild]
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * (max + 1));
    }
    
    app.get("/queue/:guildid",function(req,res){
    
      let queue = getQueue(req.params.guildid);
        if(queue.length == 0) return res.send("Pas de musique a la queue!");
        let text = '';
        for(let i = 0; i < queue.length; i++){
          text += `${(i + 1)}. ${queue[i].title} | demmandé par ${queue[i].requested}\n`    };
      res.send(text)
    })
    
    function play(message, queue, song) {
        try {
            if (!message || !queue) return;
            if (song) {
                search(song, opts, function(err, results) {
                    if (err) return message.channel.send("Video youtube non trouvé essayer avec le nom ou le lien."); 
                    song = (song.includes("https://" || "http://")) ? song : results[0].link
                    let stream = ytdl(song, {
                        audioonly: true
                    })
                    let test
                    if (queue.length === 0) test = true
                    queue.push({
                        "title": results[0].title,
                        "requested": message.author.username,
                        "toplay": stream
                    })
                    message.channel.send("**Ajout a la queue -  ** `" + queue[queue.length - 1].title + "`");
                    if (test) {
                        setTimeout(function() {
                            play(message, queue)
                        }, 1000)
                    }
                })
            } else if (queue.length != 0) {
            message.channel.send("**Je joue - ** `" + queue[0].title + "`** Demmandé par ** `" + queue[0].requested + "`");
                let connection = message.guild.voiceConnection
                if (!connection) return con("Je ne suis pas dans un channel vocal!");
                intent = connection.playStream(queue[0].toplay)

                intent.on('error', () => {
                    queue.shift()
                    play(message, queue)
                })
  
                intent.on('end', () => {
                    queue.shift()
                    play(message, queue)
                })
            } else {
                message.channel.send("Pas de musique a la queue!")
            }
        } catch (err) {
            console.log("Error\n\n" + err.stack)
            errorlog[String(Object.keys(errorlog).length)] = {
                "code": err.code,
                "error": err,
                "stack": err.stack
            }
            fs.writeFile("./jsonlist/errors.json", JSON.stringify(errorlog), function(err) {
                if (err) return con("Error");
            });
        }
    }
    
    client.on('message', function(message) {
        if(message.author.bot === true) return;
        if(!exp[message.author.id] || !lvl[message.author.id] || !msg[message.author.id]) {
          if (!exp[message.author.id]) {
              exp[message.author.id] = {
              "exps": "0"
          }
          fs.writeFile("./jsonlist/exp.json", JSON.stringify(exp), function(err) { if(err) { return console.log(err); }})
          } 
          if(!lvl[message.author.id]) {
              lvl[message.author.id] = {
            "lvls": "0"
              }
              fs.writeFile("./jsonlist/lvl.json", JSON.stringify(lvl), function(err) { if(err) { return console.log(err); }})
          } 
         if(!msg[message.author.id]) {
            msg[message.author.id] = {
            "msgs": "0"
        }
        fs.writeFile("./jsonlist/msg.json", JSON.stringify(msg), function(err) { if(err) { return console.log(err); }})
       }
       return;
    }
       exp[message.author.id].exps = exp[message.author.id].exps - 0 + 1;
       msg[message.author.id].msgs = msg[message.author.id].msgs - 0 + 1;
       let curLevel = Math.floor(0.1 * Math.sqrt(exp[message.author.id].exps));
       if (curLevel > lvl[message.author.id].lvls) {
        lvl[message.author.id].lvls = curLevel;
           message.reply(`vous êtes passé(e) au niveau **${curLevel}**!`);
       }
       fs.writeFile("./jsonlist/msg.json", JSON.stringify(msg), function(err) { if(err) { return console.log(err); }})
       fs.writeFile("./jsonlist/lvl.json", JSON.stringify(lvl), function(err) { if(err) { return console.log(err); }})
       fs.writeFile("./jsonlist/exp.json", JSON.stringify(exp), function(err) { if(err) { return console.log(err); }})
        });
        
        client.on('message', message => {
            try {
            if(message.content.startsWith(prefix + 'autorole ')) {
                var args = message.content.split(' ').slice(1).join(' ')
                if(!args === 'off') return;
                if(!message.guild.member(message.author).hasPermission('MANAGE_GUILD') && message.author.id != "265939137855488000") {
                    return message.channel.send('Tu n\'as pas les permissions nécessaire. (MANAGE_GUILD)') 
                }
                if(args === 'off') {
                    if(autorole[message.guild.id] === 'off') {
                      return message.channel.send('L\'autorole est déjà sur off, faites `' + prefix + 'autorole <role>` pour le réactiver.')
                    }
                            autorole[message.guild.id] = 'off'
                            message.channel.send('L\'autorole est maintenant sur off, faites `' + prefix + 'autorole <role>` pour le réactiver.')
                }
                  fs.writeFile("./jsonlist/autorole.json", JSON.stringify(autorole), function(err) { if(err) { return console.log(err); } console.log("The file was saved!"); }); 
            }
        } catch (error) {
            console.log(error)
        }
        })
    client.on("message", function(message) {
        if(!message.guild) return;
        if(message.author.bot) return;
        try {
            if(message.content.startsWith(prefix + "autorole")) {
                var args = message.content.split(' ').slice(1).join(' ')
                if(!message.guild.member(message.author).hasPermission('MANAGE_GUILD') && message.author.id != "265939137855488000") {
                    return message.channel.send('Tu n\'as pas les permissions nécessaire. (MANAGE_GUILD)') 
                }
                if(!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) {
                    return message.channel.send("Je n\'ai pas les permissions nécessaire. (MANAGE_ROLES)")
                }
                if(!args) {
                    return message.channel.send('Veuillez spécifiez un role.') 
                }
                if(args === 'off') return;
                var role = message.guild.roles.find("name", args) || message.guild.roles.find('id', args) || message.mentions.roles.first() || message.guild.roles.filter(r => r.name.includes(args)).first() || message.guild.roles.filter(r => r.name.toUpperCase().includes(args)).first() || message.guild.roles.filter(r => r.name.toLowerCase().includes(args)).first()
                if(!role) {
                    return message.channel.send('Le rôle n\'a pas été trouvé.')
                  }
                  if(role.position >= message.guild.member(client.user).highestRole.position) {
                    return message.channel.send('Je ne peux ajouter ce role.')
                  }
             
                     autorole[message.guild.id] = role.id
             message.channel.send(`L'autorole est maintenant le role \`${role.name}\``)
             
             fs.writeFile("./jsonlist/autorole.json", JSON.stringify(autorole), function(err) { if(err) { return console.log(err); } console.log("The file was saved!"); }); 
            }
            client.on('guildMemberAdd', member => {
                if(member.bot) return;
                if(!autorole[member.guild.id]) return;
                if(autorole[member.guild.id] === 'off') return;
                if(!member.guild.member(client.user).hasPermission('MANAGE_ROLES')) return;
                if(member.guild.roles.find('id', autorole[member.guild.id]).position >= member.guild.member(client.user).highestRole.position) return;  
                if(!autorole[member.guild.id] === member.guild.roles.find('id', autorole[member.guild.id])) return;  
                member.addRole(autorole[member.guild.id])
            })

            if(message.content.startsWith(prefix + "generateprofile")) {
                var args = message.content.split(' ').slice(1).join(' ')
                var autheur;
                if(args) {
                    var args = message.content.split(' ').slice(1).join(' ')
                    var mentionned = message.mentions.users.first()
                    if(mentionned) {
                        var autheur = mentionned;
                        if(autheur.bot) {
                            return message.channel.send('Les bots ne peuvent pas jouer.')
                        }
                        if (!exp[autheur.id]) {
                            exp[autheur.id] = {
                            "exps": "0"
                        }
                        fs.writeFile("./jsonlist/exp.json", JSON.stringify(exp), function(err) { if(err) { return console.log(err); }})
                        } 
                        if(!lvl[autheur.id]) {
                            lvl[autheur.id] = {
                          "lvls": "0"
                            }
                            fs.writeFile("./jsonlist/lvl.json", JSON.stringify(lvl), function(err) { if(err) { return console.log(err); }})
                        } 
                       if(!msg[autheur.id]) {
                          msg[autheur.id] = {
                          "msgs": "0"
                      }
                      fs.writeFile("./jsonlist/msg.json", JSON.stringify(msg), function(err) { if(err) { return console.log(err); }})
                     }

                        if(!daily[autheur.id]) {
                            daily[autheur.id] = {
                            "dailys": "0"
                            }
                            fs.writeFile("./jsonlist/daily.json", JSON.stringify(daily), function(err) { if(err) { return console.log(err); }})
                        }

                        if(!ddate[autheur.id]) {
                              ddate[autheur.id] = {
                                  "date": "0"
                              }
                              fs.writeFile("./jsonlist/ddate.json", JSON.stringify(ddate), function(err) { if(err) { return console.log(err); }});
                            }

                            if(!fortune[autheur.id]) {
                              fortune[autheur.id] = {
                                  "fortunes": ""
                              }
                              fs.writeFile("./jsonlist/fortune.json", JSON.stringify(fortune), function(err) { if(err) { return console.log(err); }});
                            }

                              if(!fdate[autheur.id]) {
                              fdate[autheur.id] = {
                                  "date": "0"
                              }
                              fs.writeFile("./jsonlist/fdate.json", JSON.stringify(fdate), function(err) { if(err) { return console.log(err); }});
                            }

                            if(!rep[autheur.id]) {
                              rep[autheur.id] = {
                                  "reps": "0"
                              }
                              fs.writeFile("./jsonlist/rep.json", JSON.stringify(rep), function(err) { if(err) { return console.log(err); }});
                            }

                            if(!rdate[autheur.id]) {
                              rdate[autheur.id] = {
                              "date": "0"
                              }
                              fs.writeFile("./jsonlist/rdate.json", JSON.stringify(rdate), function(err) { if(err) { return console.log(err); }});
                            }
                              message.channel.send('Le profile de ' + autheur.tag + ' à bien été générer !')
                    } else {
                        var autheur = message.guild.members.find('name', args) || message.guild.members.get(args) || message.guild.members.filter(m => m.displayName.includes(args)).first() || message.guild.members.filter(m => m.displayName.toUpperCase().includes(args)).first() || message.guild.members.filter(m => m.displayName.toLowerCase().includes(args)).first()
                        if(!autheur) {
                            return message.channel.send("La personne n'a pas été trouvé")
                        }
                        if(autheur.user.bot) {
                            return message.channel.send('Les bots ne peuvent pas jouer.')
                        }
                        if (!exp[autheur.user.id]) {
                            exp[autheur.user.id] = {
                            "exps": "0"
                        }
                        fs.writeFile("./jsonlist/exp.json", JSON.stringify(exp), function(err) { if(err) { return console.log(err); }})
                        } 
                        if(!lvl[autheur.user.id]) {
                            lvl[autheur.user.id] = {
                          "lvls": "0"
                            }
                            fs.writeFile("./jsonlist/lvl.json", JSON.stringify(lvl), function(err) { if(err) { return console.log(err); }})
                        } 
                       if(!msg[autheur.user.id]) {
                          msg[autheur.user.id] = {
                          "msgs": "0"
                      }
                      fs.writeFile("./jsonlist/msg.json", JSON.stringify(msg), function(err) { if(err) { return console.log(err); }})
                     }
                        if(!daily[autheur.user.id]) {
                            daily[autheur.user.id] = {
                            "dailys": "0",
                            }
                            fs.writeFile("./jsonlist/daily.json", JSON.stringify(daily), function(err) { if(err) { return console.log(err); }})
                        }
    
                        if(!ddate[autheur.user.id]) {
                              ddate[autheur.id] = {
                                  "date": "0"
                              }
                              fs.writeFile("./jsonlist/ddate.json", JSON.stringify(ddate), function(err) { if(err) { return console.log(err); }});
                            }
    
                            if(!fortune[autheur.user.id]) {
                              fortune[autheur.id] = {
                                  "fortunes": ""
                              }
                              fs.writeFile("./jsonlist/fortune.json", JSON.stringify(fortune), function(err) { if(err) { return console.log(err); }});
                            }
    
                              if(!fdate[autheur.user.id]) {
                              fdate[autheur.id] = {
                                  "date": "0"
                              }
                              fs.writeFile("./jsonlist/fdate.json", JSON.stringify(fdate), function(err) { if(err) { return console.log(err); }});
                            }
    
                            if(!rep[autheur.user.id]) {
                              rep[autheur.user.id] = {
                                  "reps": "0"
                              }
                              fs.writeFile("./jsonlist/rep.json", JSON.stringify(rep), function(err) { if(err) { return console.log(err); }});
                            }
    
                            if(!rdate[autheur.user.id]) {
                              rdate[autheur.user.id] = {
                              "date": "0"
                              }
                              fs.writeFile("./jsonlist/rdate.json", JSON.stringify(rdate), function(err) { if(err) { return console.log(err); }});
                            }
                            message.channel.send('Le profile de ' + autheur.user.tag + ' à bien été générer !')                 
                    }
                } else {
                    var autheur;
                    var autheur = message.author
                    if(!autheur) {
                        return message.channel.send("La personne n'a pas été trouvé")
                    }
                    if(autheur.bot) {
                        return message.channel.send('Les bots ne peuvent pas jouer.')
                    }
                    if (!exp[autheur.id]) {
                        exp[autheur.id] = {
                        "exps": "0"
                    }
                    fs.writeFile("./jsonlist/exp.json", JSON.stringify(exp), function(err) { if(err) { return console.log(err); }})
                    } 
                    if(!lvl[autheur.id]) {
                        lvl[autheur.id] = {
                      "lvls": "0"
                        }
                        fs.writeFile("./jsonlist/lvl.json", JSON.stringify(lvl), function(err) { if(err) { return console.log(err); }})
                    } 
                   if(!msg[autheur.id]) {
                      msg[autheur.id] = {
                      "msgs": "0"
                  }
                  fs.writeFile("./jsonlist/msg.json", JSON.stringify(msg), function(err) { if(err) { return console.log(err); }})
                 }

                    if(!daily[autheur.id]) {
                        daily[autheur.id] = {
                        "dailys": "0",
                        }
                        fs.writeFile("./jsonlist/daily.json", JSON.stringify(daily), function(err) { if(err) { return console.log(err); }})
                    }

                    if(!ddate[autheur.id]) {
                          ddate[autheur.id] = {
                              "date": "0"
                          }
                          fs.writeFile("./jsonlist/ddate.json", JSON.stringify(ddate), function(err) { if(err) { return console.log(err); }});
                        }

                        if(!fortune[autheur.id]) {
                          fortune[autheur.id] = {
                              "fortunes": ""
                          }
                          fs.writeFile("./jsonlist/fortune.json", JSON.stringify(fortune), function(err) { if(err) { return console.log(err); }});
                        }

                          if(!fdate[autheur.id]) {
                          fdate[autheur.id] = {
                              "date": "0"
                          }
                          fs.writeFile("./jsonlist/fdate.json", JSON.stringify(fdate), function(err) { if(err) { return console.log(err); }});
                        }

                        if(!rep[autheur.id]) {
                          rep[autheur.id] = {
                              "reps": "0"
                          }
                          fs.writeFile("./jsonlist/rep.json", JSON.stringify(rep), function(err) { if(err) { return console.log(err); }});
                        }

                        if(!rdate[autheur.id]) {
                          rdate[autheur.id] = {
                          "date": "0"
                          }
                          fs.writeFile("./jsonlist/rdate.json", JSON.stringify(rdate), function(err) { if(err) { return console.log(err); }});
                        }
                          message.channel.send('Le profile de ' + autheur.tag + ' à bien été générer !')
                }
            }

             if(message.content.startsWith(prefix + 'profile')) {
                const embed = new Discord.RichEmbed()
                var args = message.content.split(' ').slice(1).join(' ')
                var autheur;
                if(args) {
                    var args = message.content.split(' ').slice(1).join(' ')
                    var mentionned = message.mentions.users.first()
                    if(mentionned) {
                        var autheur = mentionned;
                        if(autheur.bot) {
                            return message.channel.send('Les bots ne peuvent pas jouer.')
                        }
                        if(!rep[autheur.id] || !daily[autheur.id] || !ddate[autheur.id] || !rdate[autheur.id] || !fortune[autheur.id] || !fdate[autheur.id] || !exp[autheur.id] || !lvl[autheur.id] || !msg[autheur.id]) {
                            message.channel.send(`Le profile n'a pas été générer faites \`${prefix}generateprofile ${autheur}\` pour le générer.`)   
                        return
                    }
                    if(autheur.avatarURL) {
                        var avatar = autheur.avatarURL
                        } else {
                        var avatar = autheur.displayAvatarURL;
                        }
                        let userData = rep[autheur.id].reps;
                        let userData1 = daily[autheur.id].dailys + fortune[autheur.id].fortunes;
                        embed.setAuthor(autheur.username, avatar)
                        embed.setThumbnail(avatar)
                        embed.addField('Nom', autheur.username)
                        embed.addField('Point de réputation', userData, true)
                        embed.addField('Credits', userData1, true)
                        embed.addField('Level', lvl[autheur.id].lvls, true)
                        embed.addField('Exp', exp[autheur.id].exps, true)
                        embed.addField('Message', msg[autheur.id].msgs, true)
                        embed.setTimestamp()
                        embed.setFooter(client.user.username, client.user.avatarURL)
                        message.channel.send({embed: embed})
                    } else {
                    var autheur = message.guild.members.find('name', args) || message.guild.members.get(args) || message.guild.members.filter(m => m.displayName.includes(args)).first() || message.guild.members.filter(m => m.displayName.toUpperCase().includes(args)).first() || message.guild.members.filter(m => m.displayName.toLowerCase().includes(args)).first()
                    if(!autheur) {
                        return message.channel.send("La personne n'a pas été trouvé")
                    }
                    if(autheur.user.bot) {
                        return message.channel.send('Les bots ne peuvent pas jouer.')
                    }
                    if(!rep[autheur.user.id] || !daily[autheur.user.id] || !ddate[autheur.user.id] || !rdate[autheur.user.id] || !fortune[autheur.user.id] || !fdate[autheur.user.id] || !exp[autheur.user.id] || !lvl[autheur.user.id] || !msg[autheur.user.id]) {
                        message.channel.send(`Le profile n'a pas été générer faites \`${prefix}generateprofile ${autheur}\` pour le générer.`)   
                    return
                }
                if(autheur.user.avatarURL) {
                    var avatar = autheur.user.avatarURL
                    } else {
                    var avatar = autheur.user.displayAvatarURL;
                    }
                    let userData = rep[autheur.user.id].reps;
                    let userData1 = daily[autheur.user.id].dailys + fortune[autheur.user.id].fortunes
                    embed.setAuthor(autheur.user.username, avatar)
                    embed.setThumbnail(avatar)
                    embed.addField('Nom', autheur.user.username)
                    embed.addField('Point de réputation', userData, true)
                    embed.addField('Credits', userData1, true)
                    embed.addField('Level', lvl[autheur.user.id].lvls, true)
                    embed.addField('Exp', exp[autheur.user.id].exps, true)
                    embed.addField('Message', msg[autheur.user.id].msgs, true)
                    embed.setTimestamp()
                    embed.setFooter(client.user.username, client.user.avatarURL)
                    message.channel.send({embed: embed})
            }
                } else {
                    var autheur;
                    var autheur = message.author
                    if(!autheur) {
                        return message.channel.send("La personne n'a pas été trouvé")
                    }
                    if(autheur.bot) {
                        return message.channel.send('Les bots ne peuvent pas jouer.')
                    }
                    if(!rep[autheur.id] || !daily[autheur.id] || !ddate[autheur.id] || !rdate[autheur.id] || !fortune[autheur.id] || !fdate[autheur.id] || !exp[autheur.id] || !lvl[autheur.id] || !msg[autheur.id]) {
                        message.channel.send(`Le profile n'a pas été générer faites \`${prefix}generateprofile ${autheur}\` pour le générer.`)   
                    return
                }
             
                if(autheur.avatarURL) {
                    var avatar = autheur.avatarURL
                    } else {
                    var avatar = autheur.displayAvatar
                    }
                    let userData = rep[autheur.id].reps;
                    let userData1 = daily[autheur.id].dailys + fortune[autheur.id].fortunes;
                    embed.setAuthor(autheur.username, avatar)
                    embed.setThumbnail(avatar)
                    embed.addField('Nom', autheur.username)
                    embed.addField('Point de réputation', userData, true)
                    embed.addField('Credits', userData1, true)
                    embed.addField('Level', lvl[autheur.id].lvls, true)
                    embed.addField('Exp', exp[autheur.id].exps, true)
                    embed.addField('Message', msg[autheur.id].msgs, true)
                    embed.setTimestamp()
                    embed.setFooter(client.user.username, client.user.avatarURL)
                    message.channel.send({embed: embed})
                }
              }

              if(message.content.startsWith(prefix + 'fortune')) {
                  var autheur;
                  var autheur = message.author
                  var nombre = [
                      '0',
                      '50',
                      '100',
                      '150',
                      '200',
                      '250',
                      '300',
                      '350',
                      '400',
                      '450',
                      '500'
                  ]
                  var randomn = nombre[Math.floor(Math.random() * nombre.length)]
                  var resulti = Math.floor(Math.random() * 300)
                  if(autheur.bot) {
                    return message.channel.send('Les bots ne peuvent pas jouer.')
                }
                  if(!rep[autheur.id] || !daily[autheur.id] || !ddate[autheur.id] || !rdate[autheur.id] || !fortune[autheur.id] || !fdate[autheur.id] || !exp[autheur.id] || !lvl[autheur.id] || !msg[autheur.id]) {
                    message.channel.send(`Le profile n'a pas été générer faites \`${prefix}generateprofile ${autheur}\` pour le générer.`)   
                return
            }
                  let ids = message.author.id;
                  if (!!fdate[ids].date && (new Date).getTime() - fdate[ids].date <  86400000) {
                      let r = (new Date).getTime() - fdate[ids].date;
                      r =  86400000 - r;
                      return message.channel.send('**Vous devez attendre '+pretty(r, {verbose:true})+' avant de reçevoir votre fortune !**');
                  }
                fortune[autheur.id].fortunes = fortune[autheur.id].fortunes - 0 + resulti
                var resultp = fortune[autheur.id].fortunes + daily[autheur.id].dailys
                var result = resulti
                message.channel.send('Bravo vous avez gagnez **' + result + '** credits, vous avez maintenant **' + resultp + '** credits, revenez dans 24 heures.')
                fdate[ids].date = (new Date).getTime()
                fs.writeFile("./jsonlist/fdate.json", JSON.stringify(fdate), function(err) { if(err) { return console.log(err); }});
                  fs.writeFile("./jsonlist/fortune.json", JSON.stringify(fortune), function(err) { if(err) { return console.log(err); }});
              }

              if(message.content.startsWith(prefix + "daily")) {
                var args = message.content.split(' ').slice(1).join(' ')     
                var autheur;   
                let ids = message.author.id;
                if (!!ddate[ids] && (new Date).getTime() - ddate[ids] <  14400000) {
                    let r = (new Date).getTime() - ddate[ids];
                    r =  14400000 - r;
                    return message.channel.send('**Vous devez attendre '+pretty(r, {verbose:true})+' avant de reçevoir votre daily !**');
                }
                if(args) {
                    var args = message.content.split(' ').slice(1).join(' ')
                    var mentionned = message.mentions.users.first()
                    if(mentionned) {
                    var autheur = mentionned;
                    if(autheur.bot) {
                        return message.channel.send('Les bots ne peuvent pas jouer.')
                    }
                    if(!rep[autheur.id] || !daily[autheur.id] || !ddate[autheur.id] || !rdate[autheur.id] || !fortune[autheur.id] || !fdate[autheur.id] || !exp[autheur.id] || !lvl[autheur.id] || !msg[autheur.id]) {
                        message.channel.send(`Le profile n'a pas été générer faites \`${prefix}generateprofile ${autheur}\` pour le générer.`)   
                    return
                }
                daily[autheur.id].dailys = daily[autheur.id].dailys - 0 + 200;
                  message.channel.send(`**Vous avez donné 200 credits à ` + autheur.tag + ` !**`)
                ddate[ids] = (new Date).getTime()
                fs.writeFile("./jsonlist/ddate.json", JSON.stringify(ddate), function(err) { if(err) { return console.log(err); }});
                  fs.writeFile("./jsonlist/daily.json", JSON.stringify(daily), function(err) { if(err) { return console.log(err); }});
                } else {
                    var autheur = message.guild.members.find('name', args) || message.guild.members.get(args) || message.guild.members.filter(m => m.displayName.includes(args)).first() || message.guild.members.filter(m => m.displayName.toUpperCase().includes(args)).first() || message.guild.members.filter(m => m.displayName.toLowerCase().includes(args)).first()
                    if(!autheur) {
                        return message.channel.send("La personne n'a pas été trouvé")
                    }
                    if(autheur.user.bot) {
                        return message.channel.send('Les bots ne peuvent pas jouer.')
                    }
                    if(!rep[autheur.user.id] || !daily[autheur.user.id] || !ddate[autheur.user.id] || !rdate[autheur.user.id] || !fdate[autheur.user.id] || !fortune[autheur.user.id] || !exp[autheur.user.id] || !lvl[autheur.user.id] || !msg[autheur.user.id]) {
                        message.channel.send(`Le profile n'a pas été générer faites \`${prefix}generateprofile ${autheur}\` pour le générer.`)   
                        return
                }
                daily[autheur.user.id].dailys = daily[autheur.user.id].dailys - 0 + 200;
                message.channel.send(`**Vous avez donné 200 credits à ` + autheur.tag + ` !**`)
                ddate[ids] = (new Date).getTime()
                fs.writeFile("./jsonlist/ddate.json", JSON.stringify(ddate), function(err) { if(err) { return console.log(err); }});
                  fs.writeFile("./jsonlist/daily.json", JSON.stringify(daily), function(err) { if(err) { return console.log(err); }});
                }
            } else {
                var autheur;
                var autheur = message.author
                if(!autheur) {
                    return message.channel.send("La personne n'a pas été trouvé")
                }
                if(autheur.bot) {
                    return message.channel.send('Les bots ne peuvent pas jouer.')
                }
                if(!rep[autheur.id] || !daily[autheur.id] || !ddate[autheur.id] || !rdate[autheur.id] || !fortune[autheur.id] || !fdate[autheur.id] || !exp[autheur.id] || !lvl[autheur.id] || !msg[autheur.id]) {
                    message.channel.send(`Le profile n'a pas été générer faites \`${prefix}generateprofile ${autheur}\` pour le générer.`)   
                return
            }
            daily[autheur.id].dailys = daily[autheur.id].dailys - 0 + 200;
              message.channel.send(`**Vous avez reçus 200 credits !**`)
            ddate[ids] = (new Date).getTime()
            fs.writeFile("./jsonlist/ddate.json", JSON.stringify(ddate), function(err) { if(err) { return console.log(err); }});
              fs.writeFile("./jsonlist/daily.json", JSON.stringify(daily), function(err) { if(err) { return console.log(err); }});
            }
              }

              if(message.content.startsWith(prefix + 'rep')) {
                var args = message.content.split(' ').slice(1).join(' ')     
                var autheur; 
                let ids = message.author.id;
                if (!!rdate[ids] && (new Date).getTime() - rdate[ids] <  86400000) {
                    let r = (new Date).getTime() - rdate[ids];
                    r =  86400000 - r;
                    return message.channel.send('**Vous devez attendre '+pretty(r, {verbose:true})+' avant de reçevoir votre point de reputation !**');
                }
            if(args) {
                var args = message.content.split(' ').slice(1).join(' ')
                var mentionned = message.mentions.users.first()
                if(mentionned) {
                    var autheur = mentionned;
                    if(autheur.bot) {
                        return message.channel.send('Les bots ne peuvent pas jouer.')
                    }
                    if(!rep[autheur.id] || !daily[autheur.id] || !ddate[autheur.id] || !rdate[autheur.id] || !fortune[autheur.id] || !fdate[autheur.id] || !exp[autheur.id] || !lvl[autheur.id] || !msg[autheur.id]) {
                        message.channel.send(`Le profile n'a pas été générer faites \`${prefix}generateprofile ${autheur}\` pour le générer.`)   
                    return
                }
                if(autheur === message.author) {
                    return message.channel.send('Tu ne peux pas te donner un point de reputation.')
                  }
                  
                  rep[autheur.id].reps++;
                  message.channel.send(`**Votre point de réputation a bien été donné à ${autheur.tag} !**`)
                  rdate[ids] = (new Date).getTime()
            fs.writeFile("./jsonlist/rdate.json", JSON.stringify(rdate), function(err) { if(err) { return console.log(err); }});
                  fs.writeFile("./jsonlist/rep.json", JSON.stringify(rep), function(err) { if(err) { return console.log(err); }});
                } else {
                    var autheur = message.guild.members.find('name', args) || message.guild.members.get(args) || message.guild.members.filter(m => m.displayName.includes(args)).first() || message.guild.members.filter(m => m.displayName.toUpperCase().includes(args)).first() || message.guild.members.filter(m => m.displayName.toLowerCase().includes(args)).first()
                    if(!autheur) {
                        return message.channel.send("La personne n'a pas été trouvé")
                    }
                    if(autheur.user.bot) {
                        return message.channel.send('Les bots ne peuvent pas jouer.')
                    }
                    if(autheur === message.author) {
                        return message.channel.send('Tu ne peux pas te donner un point de reputation.')
                      }
                      if(!rep[autheur.user.id] || !daily[autheur.user.id] || !ddate[autheur.user.id] || !rdate[autheur.user.id] || !fdate[autheur.user.id] || !fortune[autheur.user.id] || !exp[autheur.user.id] || !lvl[autheur.user.id] || !msg[autheur.user.id]) {
                        message.channel.send(`Le profile n'a pas été générer faites \`${prefix}generateprofile ${autheur}\` pour le générer.`)   
                        return
                }
                    rep[autheur.user.id].reps++;
                    message.channel.send(`**Votre point de réputation a bien été donné à ${autheur.user.tag} !**`)
                    rdate[ids] = (new Date).getTime()
              fs.writeFile("./jsonlist/rdate.json", JSON.stringify(rdate), function(err) { if(err) { return console.log(err); }});
                    fs.writeFile("./jsonlist/rep.json", JSON.stringify(rep), function(err) { if(err) { return console.log(err); }}); 
                }
            } else {
message.channel.send('Vous pouvez pas vous donnez un point de réputation.')
            }
            }

            if (message.content.startsWith(prefix + 'play')) {
                if (!message.guild.voiceConnection) {
                    if (!message.member.voiceChannel) return message.channel.send('Vous devez rejoindre un channel vocal.')
                    message.member.voiceChannel.join()
                }
                let suffix = message.content.split(" ").slice(1).join(" ")
                if (!suffix) return message.channel.send('Veuillez spécifier le nom ou le liens de la vidéo!')
                play(message, getQueue(message.guild.id), suffix)
            }
    
            if (message.content.startsWith(prefix + 'leave')) {
                if (!message.guild.voiceConnection) {
                    if (!message.member.voiceChannel) return message.channel.send('Vous devez rejoindre un channel vocal')
    }
                    var chan = message.member.voiceChannel;
                   message.member.voiceChannel.leave();
                    let queue = getQueue(message.guild.id);
                    if (queue.length == 0) return message.channel.send(`Il n'y a plus de musique a la queue.`);
                    for (var i = queue.length - 1; i >= 0; i--) {
                        queue.splice(i, 1);
                    }
                    message.channel.send(`La queue a été clear`);
            }
    
            if (message.content.startsWith(prefix + "queueclear")) {
                    let queue = getQueue(message.guild.id);
                    if (queue.length == 0) return message.channel.send(`Il n'y a pas de musique a la queue`);
                    for (var i = queue.length - 1; i >= 0; i--) {
                        queue.splice(i, 1);
                    }
                    message.channel.send("La queue a bien été clear")
                }
    
            if (message.content.startsWith(prefix + 'skip')) {
            if (!message.member.voiceChannel) return message.channel.send('Veuillez rejoindre un channel vocal.')
                    let player = message.guild.voiceConnection.player.dispatcher
                    if (!player || player.paused) return message.channel.send("Le bot n'est pas entrain de jouer!");
                    message.channel.send('La musique a bien été clear, je passe a la prochaine...');
                    player.end()
            }
    
            if (message.content.startsWith(prefix + 'pause')) {
                        if (!message.member.voiceChannel) return message.channel.send('Veuillez rejoindre un channel vocal');
                        let player = message.guild.voiceConnection.player.dispatcher
                        if (!player || player.paused) return message.channel.send("Le bot n'est pas entrain de jouer!");
                        player.pause();
                        message.channel.send("Musique mit en pause...");
                } 
    
            if (message.content.startsWith(prefix + 'volume')) {
             let suffix = message.content.split(" ")[1];
                var player = message.guild.voiceConnection.player.dispatcher
                if (!player || player.paused) return message.channel.send('Je ne joue pas de musique.');
                if (!suffix) {
    var player = message.guild.voiceConnection.player.dispatcher
                   return message.channel.send(`Le volume est à ${(player.volume * 100)}`);
                } 
                    var player = message.guild.voiceConnection.player.dispatcher;
                    let volumeBefore = player.volume
                    let volume = parseInt(suffix);
                    if (volume > 100) return message.channel.send("La musique ne peut pas être supérieure à 100");
                    player.setVolume((volume / 100));
                     message.channel.send("**Volume changé en** `"+ volume + "`");
                }

            if (message.content.startsWith(prefix + 'resume')) {
                    if (!message.member.voiceChannel) return message.channel.send('Vous devez rejoindre un channel vocal !');
                    let players = message.guild.voiceConnection.player.dispatcher;
                    if (!players) return message.channel.send('Je ne suis pas entrain de jouer.');
                    if (players.playing) return message.channel.send('Je suis deja entrain de jouer.');
                    var queue = getQueue(message.guild.id);
                    players.resume();
                    message.channel.send("**Music mit en play.**");
                }

            if (message.content.startsWith(prefix + 'queue')) {
              let queue = getQueue(message.guild.id);
                if (queue.length == 0) return message.channel.send("Pas de musique a la queue");
                let text = '';
                for (let i = 0; i < queue.length; i++) {
                    text += `${(i + 1)}. ${queue[i].title} | Demmandé par ${queue[i].requested}\n`
                };
                message.channel.send(":globe_with_meridians: **Queue:**\n`" + text + "`");
            }
        } catch (err) {
            console.log("Error\n\n\n" + err.stack)
            errorlog[String(Object.keys(errorlog).length)] = {
                "code": err.code,
                "error": err,
                "stack": err.stack
            }
            fs.writeFile("./jsonlist/errors.json", JSON.stringify(errorlog), function(err) {
                if (err) return console.log("Error");
            })
          }
        })
            app.listen(2000);

  client.login(client.config.token);
    };

    init()
