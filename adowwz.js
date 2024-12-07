const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');

// Bot istemcisi
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,           // Sunucu bilgilerini dinlemek için gerekli
        GatewayIntentBits.GuildMessages,   // Sunucudaki mesajları dinlemek için gerekli
        GatewayIntentBits.MessageContent   // Mesaj içeriğini okumak için gerekli
    ],
});

// Komutlar için koleksiyon oluşturma
client.commands = new Collection();

// Komutları yükleme
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Bot hazır olduğunda
client.once('ready', () => {
    console.log(`${client.user.tag} botu aktif!`);
});

// Mesaj olayını dinleme
client.on('messageCreate', message => {
    const prefix = '.'; // Botun prefix'i

    // Eğer mesaj bot tarafından yazılmışsa veya prefix ile başlamıyorsa işlem yapma
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Komutu çalıştırırken bir hata oluştu!');
    }
});

// Botu başlat
client.login('');
