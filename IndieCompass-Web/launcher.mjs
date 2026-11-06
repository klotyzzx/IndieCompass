import {startServer} from './server.mjs';import {spawn} from 'node:child_process';import {existsSync} from 'node:fs';import path from 'node:path';
const app=await startServer();console.log('Инди-компас: '+app.url);console.log('Закройте это окно после выхода из приложения. Ctrl+C — остановить.');
if(process.platform==='win32'){
 const candidates=[path.join(process.env['PROGRAMFILES(X86)']||'C:/Program Files (x86)','Microsoft/Edge/Application/msedge.exe'),path.join(process.env.PROGRAMFILES||'C:/Program Files','Microsoft/Edge/Application/msedge.exe'),path.join(process.env.PROGRAMFILES||'C:/Program Files','Google/Chrome/Application/chrome.exe'),path.join(process.env.LOCALAPPDATA||'','Google/Chrome/Application/chrome.exe')];
 const browser=candidates.find(existsSync);
 if(browser){const child=spawn(browser,['--app='+app.url,'--new-window','--window-size=1440,960'],{stdio:'ignore',windowsHide:true});child.on('error',()=>console.log('Откройте адрес выше в браузере.'));}
 else console.log('Edge/Chrome не найден. Откройте адрес выше в браузере.');
}else console.log('Откройте адрес выше в браузере.');
process.on('SIGINT',()=>{app.server.close();process.exit(0);});
