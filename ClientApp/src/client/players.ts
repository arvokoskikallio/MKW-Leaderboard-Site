import axios from 'axios';
import { checkResponse } from './helpers';
import { Player } from '../types/common';


export const getPlayers = (): Promise<Player[]> => axios(
    `/api/player`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
).then(checkResponse)
.then(e => e.data);