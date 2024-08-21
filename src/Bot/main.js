const { Client, LocalAuth, MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Gemini = require("../services/gemini.js");
const YTmp3 = require("../services/YTmp3.js");
const GroupChat = require('whatsapp-web.js/src/structures/GroupChat.js');

const client = new Client({
    authStrategy: new LocalAuth()
});


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

//When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});


// client.on("message_create", async message => {
// 	if(message.fromMe){
// 		message.reply("Ok bro");
// 		return
// 	}
// })


client.on("message_create", async (message) => {
	const [mention, command] = message.body.split(" ");
	if(mention == "@Smash"){
		if(command == "/Joke"){
			
		}
		else if(command == "/IA"){
			const text = message.body.slice(mention.length+1+command.length+1);
			const IA = new Gemini(text);
			IA.generateContent().then(data => message.reply(data));

		}
		else if(command == "/mp3"){ 
			const text = message.body.slice(mention.length+1+command.length+1);
			const MP3 = new YTmp3(text);
			MP3.fetchData().then(async data => {
				if(data.status != "ok"){
					message.reply("No se encontro el video");
				}else{
					const chat = await message.getChat()
					message.reply(`Title: ${data.title}\nFileSize: ${(data.filesize/1000000).toFixed(2)}Mb\nDuration: ${(data.duration/60).toFixed(2)}minutes`);

					const Media = await MessageMedia.fromUrl(data.link);
					
					client.sendMessage(chat.id._serialized, Media);
				}
			});
		}else if(command == "/everyone"){
			const chat = await message.getChat();
			if(chat.isGroup){
				console.log("es un grupo");
				const group = new GroupChat(client, chat);
				let mesage = ""
				for(const participant of group.participants){
					mesage += `@${participant.id.user}` + "   \n";
				}
				message.reply(mesage)
			}else{
				message.reply("No es un grupo");
			}
		}
		else if(command == "/help"){
			message.reply(`Comandos disponibles:\n/IA {Mensaje} utiliza la IA de google Gemini para responder cualquier pregunta\n/mp3 {youtubeURL} Permite descargar musica de youtube en formato .mp3\n/everyone Si estas en un grupo menciona todas las personas de ese grupo\n
				`)
		}
		else {
			message.reply("El comando que ha proporcionado no funciona");
			message.reply("Vea la lista de domandos con @Smash /help");
		}
	}
})

//Testing bot
// Start your client
client.initialize();
