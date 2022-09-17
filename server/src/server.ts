import express from "express"
import { PrismaClient } from '@prisma/client'
import { convertHoursStringToMinutes } from "./utils/convert-hours-string-to-minutes"
import cors from 'cors'

const options: cors.CorsOptions = {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: 'http://127.0.0.1:5173',
    preflightContinue: false,
  };

const app = express()

app.use(cors(options));
app.use(express.json())

const prisma = new PrismaClient({
    log: ['query']
})

app.get('/games', async (req, res) => {
    const games = await prisma.game.findMany({
        include:{
            _count:{
                select:{
                    ads: true,
                }
            }
        }
    })
    console.log(games)
    return res.json(games)
})

app.post('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id;
    const body: any = req.body;


    const ad = await prisma.ad.create({

        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHoursStringToMinutes(body.hourStart),
            hourEnd: convertHoursStringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel, 
              
        }
    })

    return res.status(201).json(ad)
})

app.get('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id;

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel:true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        where: {
            //gameId: gameId
            gameId,
        },
        orderBy: {
            createdAt: 'desc',
        }
    })


    return res.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(',')
        }
    }))
})

app.get('/ads/:id/discord', async(req, res) => {
    const adId = req.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })
 
    return res.json({
        discord: ad.discord,
    })
})

app.listen(3333)