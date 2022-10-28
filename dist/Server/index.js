//? Dependencies
import Mongo from '@lib/mongodb';
import Discord from '@lib/discord';
import API from './api';
//? Initialize
Mongo();
Discord();
API();
