const {app,BrowserWindow,shell}=require('electron');
const path=require('node:path');
let local;
app.whenReady().then(async()=>{
 const {startServer}=await import('./server.mjs');local=await startServer({dataDir:app.getPath('userData')});
 const window=new BrowserWindow({width:1440,height:960,minWidth:800,minHeight:650,backgroundColor:'#0c1017',autoHideMenuBar:true,title:'Инди-компас',webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
 window.webContents.setWindowOpenHandler(({url})=>{if(/^https:\/\/store\.steampowered\.com\/app\/\d+/.test(url))shell.openExternal(url);return {action:'deny'};});
 window.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith(local.url+'/'))event.preventDefault();});
 window.loadURL(local.url);
});
app.on('window-all-closed',()=>app.quit());
app.on('before-quit',()=>local?.server.close());
