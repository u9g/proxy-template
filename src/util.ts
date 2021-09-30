import fs from 'fs'
import fsp from 'fs/promises'

export async function startProgram (): Promise<boolean> {
  if (!await checkFileExists('./logins.json')) {
    await fsp.writeFile('./logins.json', '{\n\t"YOURUSERNAMEHERE": {\n\t\t"username": "YOUREMAILHERE",\n\t\t"password": "YOURPASSWORDHERE"\n\t}\n}')
    console.error('Put your login in the logins.json file in the empty quotes, then restart the program.')
    return false
  }
  return true
}

export async function checkFileExists (file): Promise<boolean> {
  return await fs.promises.access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
}
