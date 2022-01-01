function Notification(message, color) {
    if (!process.notification_channel || !message) return
    try {
        var embed = {
            "description": message,
            "color": color || '#ffffff'
        }

        process.notification_channel.send({ embeds: [embed] }).then(msg => setTimeout(() => { msg.delete().catch(err => console.log('Failed to delete message!')) }, 120 * 1000))
        console.log(message)
    } catch (err) {
        console.log(err)
    }
}



module.exports = {

    Notification

}