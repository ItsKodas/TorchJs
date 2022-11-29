//? Dependencies

import * as React from "react"


//? Components


import FormControl from '@mui/material/FormControl'

import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"



//? Page

export default () => {

    return (
        <div className="flex-col">

            <div className="mx-auto my-10 text-center">
                <h1 className="text-4xl text-gray-100">Welcome to TorchJs</h1>
                <h4 className="text-lg text-gray-300">- First time Setup -</h4>
            </div>


            <div className="mx-auto my-10 max-w-xs flex-col space-y-28">

                <FormControl fullWidth className="flex-col space-y-8">
                    <TextField variant="standard" label="Server Host" defaultValue={'torch.horizons.gg'} />
                    <TextField variant="standard" label="Discord Server ID" type='number' />
                    <TextField variant="standard" label="Community Password" type='password' />
                </FormControl>

                <div>
                    <Button variant="contained" fullWidth>Continue</Button>
                </div>

            </div>

        </div>
    )

}