const request=require("request")
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs=require("fs")

//https://www.espncricinfo.com/series/asia-cup-2022-1327237/match-schedule-fixtures-and-results

const readline = require("readline-sync");

let pathFromUser = String(readline.question("Enter the series url... "))

request(pathFromUser, function (error, response, html) {
if(error)
  console.error('error:', error); 
else{
    const dom=new JSDOM(html)
    const document=dom.window.document
    series(document)
}
});

let leaderboard=[]
let counter=0

const series=(document)=>{
  let seriesMatch=document.querySelectorAll(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent");

  for(let i=0;i<seriesMatch.length;i++){
    let link=seriesMatch[i].querySelectorAll("a")[0].href;
    let completeLink="https://www.espncricinfo.com"+link
    request(completeLink, function (error, response, html) {
      if(error)
        console.error('error:', error); 
      else{
          const dom=new JSDOM(html)
          const document=dom.window.document
          scoreboard(document)
      }
      });
      counter++;
  }
}

const scoreboard=(document)=>{
  let battingPlayer=document.querySelectorAll(".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table")
  for(let i=0;i<battingPlayer.length;i++){
      let teamPlayer=battingPlayer[i].querySelectorAll("tbody tr");
      for(let j=0;j<teamPlayer.length;j++){
        let cells=teamPlayer[j].querySelectorAll("td");
        if(cells.length===8){
          let name=cells[0].textContent;
          let run=cells[2].textContent
          let ball=cells[3].textContent
          let four=cells[5].textContent
          let six=cells[6].textContent
          processPlayer(name,run,ball,four,six)
        }
    }
  }
  counter--;
  if(counter==0){
    let pathFromUser = String(readline.question("Enter the json fileName  to create... "))
    fs.writeFileSync(pathFromUser+".json",JSON.stringify(leaderboard))
    //console.log(leaderboard)
  }
}

const processPlayer=(name,run,ball,four,six)=>{
  run=Number(run)
  ball=Number(ball)
  four=Number(four)
  six=Number(six)
  for(let i=0;i<leaderboard.length;i++){
    let playerObj=leaderboard[i]
    if(playerObj.Name===name){
      playerObj.Innings+=1
      playerObj.Runs+=run
      playerObj.Balls+=ball
      playerObj.Fours+=four
      playerObj.Sixes+=six
      return;
    }
  }
  let playerObj={
    Name:name,
    Innings:1,
    Balls:ball,
    Runs:run,
    Fours:four,
    Sixes:six
  }
  leaderboard.push(playerObj)
}