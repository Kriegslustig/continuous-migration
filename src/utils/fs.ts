import * as fs from 'fs'

export const readdir = (dir: string): Promise<Array<string>> =>
  new Promise((res, rej) => {
    fs.readdir(dir, (err, data) => {
      if (err) rej(err)
      else res(data)
    })
  })
