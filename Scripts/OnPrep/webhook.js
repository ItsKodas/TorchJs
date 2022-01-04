const Editor = require('C:\\snapshot\\TorchJs\\Modules\\editor.js')
const fetch = require('C:\\snapshot\\TorchJs\\node_modules\\node-fetch')

async function Webhook() {
    var Sandbox = await Editor.GetSandboxSBC()

    var data = {}

    try {
        for (Player of Sandbox.MyObjectBuilder_Checkpoint.AllPlayersData[0].dictionary[0].item) {
            if (Player.Value[0].Connected[0] === 'false' || !Player.Value[0].DisplayName[0]) continue
            data[Player.Value[0].IdentityId[0]] = {
                name: Player.Value[0].DisplayName[0],
                admin: Player.Value[0].PromoteLevel[0],
                creative: Player.Value[0].CreativeToolsEnabled[0],
                admin_settings: Player.Value[0].RemoteAdminSettings[0]
            }
        }
    } catch (err) { }

    fetch(process.env.webhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Sector': process.env.name
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.status !== 200) console.log(`Webhook response: ${res.status}`)
        })
        .catch(err => console.log(err))


}
if (process.env.webhook) setInterval(Webhook, 1000 * 60), Webhook()