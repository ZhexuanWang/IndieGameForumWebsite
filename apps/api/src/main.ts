import 'reflect-metadata'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../../../.env') })

import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const uploadsDir = join(process.cwd(), 'uploads')
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true })
  app.useStaticAssets(uploadsDir, { prefix: '/uploads' })

  app.use(cookieParser())
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.enableCors({
    origin: process.env.WEB_URL || /^http:\/\/localhost(:\d+)?$/,
    credentials: true,
  })

  const port = process.env.PORT ?? 3001
  await app.listen(port)
  console.log(`FlashDev GameWeb API → http://localhost:${port}/api`)
}

bootstrap()
