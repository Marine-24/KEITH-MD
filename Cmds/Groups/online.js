const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, participants, text } = context;

        // Create an array to store online members
        const onlineMembers = [];

        // Loop through the participants to check their presence status
        for (let participant of participants) {
            try {
                // Get the presence of the participant (Check if online)
                const presence = await client.getPresence(participant.id._serialized);

                // If the status is 'online', add them to the onlineMembers list
                if (presence && presence.status === 'online') {
                    onlineMembers.push(participant.id.user); // Push the user ID (username)
                }
            } catch (err) {
                console.error(`Error checking presence for ${participant.id.user}:`, err);
            }
        }

        // If no online members, reply with a message
        if (onlineMembers.length === 0) {
            return m.reply('_No online members_');
        }

        // Construct the message with the names of online members
        let txt = `You have been tagged by ${m.pushName}.\n\nMessage: ${text || 'No Message!'}\n\n`;

        // Add mentions for online members
        for (let member of onlineMembers) {
            txt += `📧 @${member}\n`;  // Append the tagged members to the message
        }

        // Send the message, mentioning online members
        await client.sendMessage(m.chat, { text: txt, mentions: onlineMembers }, { quoted: m });
    });
};