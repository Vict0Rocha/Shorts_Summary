import ytdl from "ytdl-core"
import fs from "fs"
import { ifError, rejects } from "assert"
import { error } from "console"
import { resolve } from "path"

export const download = (videoID) =>
  new Promise((resolve, rejects) => {
    const videoURL = "https://www.youtube.com/shorts/" + videoID
    console.log("Realizando o donwload do video: ", videoID)

    ytdl(videoURL, { quality: "lowestaudio", filter: "audioonly" })
      .on("info", (info) => {
        const seconds = info.formats[0].approxDurationMs / 1000

        if (seconds > 80) {
          throw new Error("A duração dese vídeo é maior do que 60 segundos.")
        }
      })
      .on("end", () => {
        console.log("Download do vídeo finalizado.")
        resolve()
      })
      .on("error", (error) => {
        console.log(
          "Não foi possível fazer o download do vídeo. Detalhes do erro: ",
          error
        )
        rejects(error)
      })
      .pipe(fs.createWriteStream("./tmp/audio.mp4"))
  })
