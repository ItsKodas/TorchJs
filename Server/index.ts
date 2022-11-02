//? Dependencies

import Mongo from '@lib/mongodb'
import Discord, { Channel } from '@lib/discord'
import API from './api'

import { Client } from 'discord.js'



//? Initialize

Mongo()
Discord()
API()