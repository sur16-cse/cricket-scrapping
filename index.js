const request=require("request")
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const readline = require("readline-sync");

let pathFromUser = String(readline.question("Enter the match url"))

request(pathFromUser, function (error, response, html) {
if(error)
  console.error('error:', error); 
else{
    const dom=new JSDOM(html)
    const document=dom.window.document
    teanwin(document)
    teamname(document)
    highestwicket(document)
    batsmandetails(document)
}
});

//winning team
const teanwin=(document)=>{
  let teamWin=document.querySelectorAll(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title span")
  console.log(teamWin[0].textContent)
}

//team between match happen
const teamname=(document)=>{
    let teamName=document.querySelectorAll(".ds-inline-flex.ds-items-start.ds-leading-none .ds-text-tight-l.ds-font-bold.ds-text-ui-typo.ds-block.ds-truncate")
    console.log(teamName[0].textContent)
    console.log(teamName[1].textContent)
}

//bowling team member and their wicket taken
const highestwicket=(document)=>{
  let bowlingPlayer=document.querySelectorAll(".ReactCollapse--content .ds-w-full.ds-table.ds-table-md.ds-table-auto")
 
  let max=-1;
  let player;
  for(let i=0;i<bowlingPlayer.length;i++){
    if(i%2!=0){
      let teamRow=bowlingPlayer[i].querySelectorAll("tbody tr");
      // console.log(teamRow.length)
      for(let j=0;j<teamRow.length;j++){
        let tds=teamRow[j].querySelectorAll("td");
        //console.log(tds.length)
        if(tds.length>1){
          let nameOfPlayer=tds[0].textContent
          let wicketOfPlayer=tds[4].textContent
          console.log("Name of Bowler ---> ",nameOfPlayer, "       Wickets of player---> ",wicketOfPlayer)
          if(max<wicketOfPlayer){
            player=nameOfPlayer
            max=wicketOfPlayer
          }
        }
      }
      console.log()
    }
  }
  console.log("Name of highest wicket taker : ",player)
  console.log("wicket taken highest : ",max)
}

const batsmandetails=(document)=>{
  let battingPlayer=document.querySelectorAll(".ReactCollapse--content .ds-w-full.ds-table.ds-table-md.ds-table-auto")

  for(let i=0;i<battingPlayer.length;i++){
    if(i%2==0){
      let teamPlayer=battingPlayer[i].querySelectorAll("tbody tr .ds-w-0.ds-whitespace-nowrap.ds-min-w-max a");
      for(let j=0;j<teamPlayer.length;j++){
        let batsmanLink=teamPlayer[j].href;
        let completeBatsmanLink="https://www.espncricinfo.com"+batsmanLink
        request(completeBatsmanLink,(error,response,html)=>{
          if(error)
           console.error('error:', error);
           else{
            const dom=new JSDOM(html)
            const document=dom.window.document
            let detail=document.querySelector(".ds-grid.ds-grid-cols-2.ds-gap-4.ds-mb-8")
            let detailDiv=detail.querySelectorAll(".ds-text-title-s.ds-font-bold.ds-text-ui-typo h5")
            let playerName=detailDiv[0].textContent;
            let playerDOB=detailDiv[1].textContent;
            console.log("Full Name: ",playerName, " ","D.O.B: ",playerDOB)
           }
        })
      }
    }
  }
}