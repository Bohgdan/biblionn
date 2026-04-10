import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const dynamic = 'force-dynamic'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  const { data } = await req.json()
  const result = await cloudinary.uploader.upload(data, {
    folder: 'biblion',
    transformation: [{ width: 400, height: 560, crop: 'fill', quality: 'auto' }]
  })
  return NextResponse.json({ url: result.secure_url })
}
