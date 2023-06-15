const express=require('express');
const app=express();
const port=3000;
const path=require('path');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));


app.get('/',(req,res)=>{
    res.render('index.ejs');
});
//FUNCTION FOR SEPERATING AM_PM AND TIME
function give_time_am_pm(time){
    let obj={};
    obj.time=parseInt(time);
    obj.am_pm=time.substr(-2);
    return obj;
}

// FUNCTION FOR CALCULATING NUMBER OF HOURS BETWEEN TIME1 AND TIME2
function no_of_hours(time1_obj,time2_obj){
    //if AM and PM
    if(time1_obj.am_pm==='AM' && time2_obj.am_pm==='PM'){
            return (12-time1_obj.time + time2_obj.time);
    }else if(time1_obj.am_pm==='AM' && time2_obj.am_pm==='AM'){
            return (time2_obj.time-time1_obj.time);
    }else if(time1_obj.am_pm==='PM' && time2_obj.am_pm==='AM'){
            return 0;
    }else if(time1_obj.am_pm==='PM' && time2_obj.am_pm==='PM'){
            let remaining_time=time2_obj.time-time1_obj.time;
            if(remaining_time>=0) return remaining_time;
            return 0;
    }

}

function nextHourInClock(Hour){
    if(Hour<12){ return Hour+1;}
    return 1;
}
function backHourInClock(Hour){
    if(Hour>1){ return Hour-1;}
    return 12;
}

function create_day_timings(startTime,endTime,exceptTimeFrom,exceptTimeTo,lunchTimeFrom,lunchTimeTo){
    let dayTimmingObj={
            "9-10am":"x",
            "10-11am":"x",
            "11-12am":"x",
            "12-1am":"x",
            "1-2pm":"x",
            "2-3pm":"x",
            "3-4pm":"x",
            "4-5pm":"x",
            "5-6pm":"x",
            "6-7pm":"x",
            "7-8pm":"x"
    };
    // Writing 'p' for subject timmings  in a day 
    for(let i=startTime.time;i<=12;i++){
            dayTimmingObj[`${i}-${nextHourInClock(i)}am`]='period';
    }
    for(let i=1;i<endTime.time;i++){
            dayTimmingObj[`${i}-${nextHourInClock(i)}pm`]='period';
    }
    //Writing 'e' for except timmings  in a day

    if(exceptTimeFrom.am_pm==="AM" &&  exceptTimeTo.am_pm==='AM'){
            for(let i=exceptTimeFrom.time;i<exceptTimeTo.time;i++){
                    dayTimmingObj[`${i}-${nextHourInClock(i)}am`]='except';
            }
    }else if(exceptTimeFrom.am_pm==="AM" &&  exceptTimeTo.am_pm==='PM'){
            for(let i=exceptTimeFrom.time;i<=12;i++){
                    dayTimmingObj[`${i}-${nextHourInClock(i)}am`]='except';
            }
            for(let i=1;i<exceptTimeTo.time;i++){
                    dayTimmingObj[`${i}-${nextHourInClock(i)}pm`]='except';

            }
    }else if(exceptTimeFrom.am_pm==="PM" &&  exceptTimeTo.am_pm==='PM'){
            for(let i=exceptTimeFrom.time;i<exceptTimeTo.time;i++){
                    dayTimmingObj[`${i}-${nextHourInClock(i)}pm`]='except';
            }
    }else if(exceptTimeFrom.am_pm==="PM" &&  exceptTimeTo.am_pm==='AM'){
            
    }

    // Writing 'l' for lunch timmings in day
    if(lunchTimeFrom.am_pm==="AM" &&  lunchTimeTo.am_pm==='PM'){
            for(let i=lunchTimeFrom.time;i<=12;i++){
                    dayTimmingObj[`${i}-${nextHourInClock(i)}am`]='lunch';
            }
            for(let i=1;i<lunchTimeTo.time;i++){
                    dayTimmingObj[`${i}-${nextHourInClock(i)}pm`]='lunch';

            }
    }else if(lunchTimeFrom.am_pm==="PM" &&  lunchTimeTo.am_pm==='PM'){
            for(let i=exceptTimeFrom.time;i<exceptTimeTo.time;i++){
                    dayTimmingObj[`${i}-${nextHourInClock(i)}pm`]='lunch';
            }
    }
    return dayTimmingObj;
}
app.post('/newtimetable',(req,res)=>{
    //DESTRUCTING THE VARIABLE NAMES FROM REQEST BODY
    const {
            name_of_tt,
            no_of_sub,
            from_time,
            to_time,
            except_time_from,
            except_time_to,
            lunch_time_from,
            lunch_time_to,
            subNames,favSubNames
    }=req.body;

    //SPLITING TIME AND AM_PM

    let from_time_obj=give_time_am_pm(from_time),
    to_time_obj=give_time_am_pm(to_time),
    except_time_from_obj=give_time_am_pm(except_time_from),
    except_time_to_obj=give_time_am_pm(except_time_to),
    lunch_time_from_obj=give_time_am_pm(lunch_time_from),
    lunch_time_to_obj=give_time_am_pm(lunch_time_to);


   //ESTIMATING THE AVAILABLE HOURS IN A WEEK
    
    let freeHoursInDay=no_of_hours(except_time_from_obj,except_time_to_obj);
    let lunchHoursInDay=no_of_hours(lunch_time_from_obj,lunch_time_to_obj);
    let availableHoursInDay=no_of_hours(from_time_obj,to_time_obj)-freeHoursInDay-lunchHoursInDay;
    let availableHoursInWeek=5*availableHoursInDay;
    let availableHoursInWeekForSubject= parseInt(availableHoursInWeek/no_of_sub);
    let extraHoursInWeek=availableHoursInWeek%no_of_sub;
    //res.send(`${availableHoursInDay},${freeHoursInDay},${lunchHoursInDay},${availableHoursInWeek},${availableHoursInWeekForSubject}`);
   
    //ADDING SUBJECT NAMES TO PERIODS IN TIMETABLE
    let workingDays=[]; //days*sub
    //availablehoursinweek=5*no_of_sub + extrahoursinweek+x*no_of_sub;
    //let noOfreapSubInDay=(availableHoursInWeek-5*no_of_sub-extraHoursInWeek)/no_of_sub;

    for(let i=0;i<5;i++){
            let k=i%no_of_sub;
            let obj=create_day_timings(from_time_obj,to_time_obj,except_time_from_obj,except_time_to_obj,lunch_time_from_obj,lunch_time_to_obj);
            let count=0;
            for(let j in obj){
                    if(obj[j]==='period' && count<no_of_sub && k<no_of_sub){
                            obj[j]=subNames[`sub_${k+1}`];
                            k=(k+1)%no_of_sub;
                            count++;
                    }
            }

            workingDays.push(obj);
    }
  
    let y=5;
    if(extraHoursInWeek!==0) y=4;
    for(let i=0;i<y;i++){
            let obj=workingDays[i];
           // let x=noOfreapSubInDay;
            let temp=[];
            for(let k in obj){
                    if(obj[k]!=='period' && obj[k]!=='except' && obj[k]!=='lunch'){
                            temp.push(obj[k]);
                            
                    }
                    if(obj[k]==='period'){
                            let i=temp.length;
                            obj[k]=temp[i-1];
                            temp.pop();
                    }
            }
            workingDays[i]=obj;
            
    }
    //MAPPING N FAVOURITE SUB IN LAST DAY OF WEEK (FRIDAY)
    if(extraHoursInWeek!==0){
            let obj4=workingDays[4];
            let x=1;
            for(let i in obj4){
                    if(obj4[i]==='period' && x<=extraHoursInWeek){
                            obj4[i]=favSubNames[`fav_sub_${x}`];
                            x++;
                    }
            }
    }


    res.render('show.ejs',{workingDays,name_of_tt});
    
})






app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});