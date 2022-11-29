//? Dependencies




//? Torch Ready

export function TorchPrepped(data: string) {
    return new Promise((resolve, reject) => {



    })
}



//? Common Functions

export function ParseLine(line: string) {

    // console.log(line)

    if (line.includes('[INFO]')) return { type: 'info', data: line.split('[INFO]')[1].trim() }
    if (line.includes('[FATAL]')) return { type: 'fatal', data: line.split('[FATAL]')[1].trim() }

}



//Torch: Starting server.