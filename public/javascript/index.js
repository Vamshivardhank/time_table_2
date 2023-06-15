// let names_of_sub_arr=[];


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

// ON CHANGE OF NUMBER OF SUBJECTS, IT SHOULD EFFECT ON AVAILABLE HOURS FOR EACH SUBJECT  IN A WEEK
function numOfSub(){
    let no_of_sub=document.getElementsByName('no_of_sub');
    let namesOfSub=document.getElementById('nameOfSub');
    namesOfSub.innerHTML="";
    let num=no_of_sub[0].value;
    for(let i=1;i<=num;i++){
            let div=document.createElement('div');
            let lbl=document.createElement('label');
            lbl.setAttribute('for',`sub_${i}`);
            let numEnd='th';
            if(i===1){
                    numEnd='st';
            }else if(i===2 || i===3){
                    numEnd='nd'
            }
            lbl.innerHTML=`<h3>Enter the ${i}${numEnd} Subject :  </h3>`
            let inp=document.createElement('input');
            inp.setAttribute("type","text");
            inp.setAttribute('name',`subNames[sub_${i}]`);
            inp.setAttribute('id',`sub_${i}`);
            inp.setAttribute('required','true');
            div.append(lbl);
            div.append(inp);
            namesOfSub.append(div);
    }
    console.log(num);    
    changeHandler();
}

// CALCULATING THE AVAILABLE HOURS FOR EACH SUBJECT IN A WEEK AND ON CHANGE FUNCTION FOR SELECT OPTIONS IN  VARIOUS FILEDS
function changeHandler(){
   
     let num=document.getElementsByName('no_of_sub')[0].value;
    let from_time=document.getElementsByName('from_time')[0].value,
    to_time=document.getElementsByName('to_time')[0].value,
    except_time_from=document.getElementsByName('except_time_from')[0].value,
    except_time_to=document.getElementsByName('except_time_to')[0].value,
    lunch_time_from=document.getElementsByName('lunch_time_from')[0].value,
    lunch_time_to=document.getElementsByName('lunch_time_to')[0].value;

    // SPLITING TIME AND AM_PM
    let from_time_obj=give_time_am_pm(from_time),
    to_time_obj=give_time_am_pm(to_time),
    except_time_from_obj=give_time_am_pm(except_time_from),
    except_time_to_obj=give_time_am_pm(except_time_to),
    lunch_time_from_obj=give_time_am_pm(lunch_time_from),
    lunch_time_to_obj=give_time_am_pm(lunch_time_to);


    // ESTIMATING THE AVAILABLE HOURS IN A WEEK

    let freeHoursInDay=no_of_hours(except_time_from_obj,except_time_to_obj);
    let lunchHoursInDay=no_of_hours(lunch_time_from_obj,lunch_time_to_obj);
    let availableHoursInDay=no_of_hours(from_time_obj,to_time_obj)-freeHoursInDay-lunchHoursInDay;
    let availableHoursInWeek=5*availableHoursInDay;
    let availableHoursInWeekForSubject= parseInt(availableHoursInWeek/num);
    let extraHoursInWeek=availableHoursInWeek%num;
  
    console.log("avilHoursSub=",availableHoursInWeekForSubject);
    console.log("extraHours=",extraHoursInWeek);  

    // MAPPING  N_EXTRA_HOURS TO N_FAVOURITE_SUBJECTS 
    let favSub=document.getElementById('favSub');
    favSub.innerHTML="";
    if(extraHoursInWeek!==0){

            for(let i=1;i<=extraHoursInWeek;i++){
                    let div=document.createElement('div');
                    let lbl=document.createElement('label');
                    lbl.setAttribute('for',`fav_sub_${i}`);
                    let numEnd='th';
                    if(i===1){
                            numEnd='st';
                    }else if(i===2 || i===3){
                            numEnd='nd'
                    }
                    lbl.innerHTML=`<h3>Enter your ${i}${numEnd} favourite  Subject :  </h3>`
                    let inp=document.createElement('input');
                    inp.setAttribute("type","text");
                    inp.setAttribute('name',`favSubNames[fav_sub_${i}]`);
                    inp.setAttribute('id',`fav_sub_${i}`);
                    inp.setAttribute('required','true');
                    div.append(lbl);
                    div.append(inp);
                    favSub.append(div);
            }
    }
}


let inputs = document.getElementsByTagName("input");
for (let i=0; i<inputs.length; i++){
inputs[i].onchange = changeHandler;
}




