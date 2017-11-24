const { Client } = require('discord.js');
const {readdir} = require('fs-nextra');
const Enmap = require('enmap');
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
  console.log('Bot Start')
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

  client.login(client.config.token);
    };

    init()
