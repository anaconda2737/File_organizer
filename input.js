#!/usr/bin/env node



let fs = require("fs");
let path = require("path")
let inputArr = process.argv.slice(2);

let types =  {
    media:["mp4","mkv","mp3"],
    archives:['zip','7z','rar','tar','gz','ar','iso','xz'],
    document:['docs','doc','pdf','xlsx','xls','odt','ods','odp','odg','odf','txt','ps','tex'],
    app:['exe','dmg','pkg','deb']

}

let command = inputArr[0];

switch(command){
    case "tree":
        treeFn(inputArr[1])
        break;
    case "organize":
        OrganizeFn(inputArr[1])
        break;
    case "help":
        helpfn()
        break;
        default:
            console.log("🙏🏿Please input right command")        
}

function treeFn(dirpath){
    // console.log("Tree command is implemented for", dirpath);
    // let destPath


    if(dirpath==undefined){
       
        TreeHelper(process.cwd(),"")
        return;
    }
    else{
        let doesExist = fs.existsSync(dirpath)
        if(doesExist){

            TreeHelper(process.cwd())
           

        }
        else{
            console.log("Kindly Enter the correct path")
            return;
        }
    }

    
}



function TreeHelper(dirpath,indent){
    let isFile = fs.lstatSync(dirpath).isFile();
    if(isFile==true){
        let filename = path.basename(dirpath);
        console.log(indent+"-----"+filename)

    }
    else{
        let dirname = path.basename(dirpath)
        console.log(indent + "__|" + dirname)

        let childrens = fs.readdirSync(dirpath)
        for(let i = 0; i<childrens.length;i++){
            let childpath = path.join(dirpath,childrens[i])
            TreeHelper(childpath,indent+"\t")
        }

    }
}












function OrganizeFn(dirpath){
    console.log("Organize command is implemented for", dirpath);

    let destPath


    if(dirpath==undefined){
        destPath = process.cwd();
        return;
    }
    else{
        let doesExist = fs.existsSync(dirpath)
        if(doesExist){
           destPath = path.join(dirpath,"organized");
            if(fs.existsSync(destPath)==false){
                fs.mkdirSync(destPath);

            }
          

        }
        else{
            console.log("Kindly Enter the correct path")
            return;
        }
    }
    organizehelper(dirpath,destPath)
}

function organizehelper(src,dest){
    let childName =  fs.readdirSync(src);
    for(let i = 0; i<childName.length; i++){
         let chiladdress = path.join(src,childName[i])
          let fileIs = fs.lstatSync(chiladdress).isFile()
          if(fileIs){
            // console.log(childName[i])
            let category = getcategory(childName[i])
            sendFiles(chiladdress,dest,category)
          }
    }

}

function sendFiles(srcFile,dest,category){
    categorypath = path.join(dest,category)
    if(fs.existsSync(categorypath)==false){
        fs.mkdirSync(categorypath)
    }
    let fileNmae = path.basename(srcFile);
    let destFilepath = path.join(categorypath,fileNmae);
    fs.copyFileSync(srcFile,destFilepath);
}

function getcategory(name){
   let extension = path.extname(name)
   extension = extension.slice(1);

   for(let  type in types){
    let cTypeArr = types[type];
    for(let i = 0; i<cTypeArr.length; i++){
        if(extension==cTypeArr[i]){
            return type;
        }
    }
   }

   return "other types"

}











function helpfn(){
    console.log(`List of All the command : 
                  node main.js tree "directoryPath"
                  node main.js organize "directoryPath"
                  node main.js help
    `);
}


