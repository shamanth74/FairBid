export const getRemainingTimeParts =(endTime)=>{
    const diff = Math.max(0,new Date(endTime)-new Date ());

    const totalSeconds=Math.floor(diff/1000);
    const days =Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds%(3600*24))/3600);
    const minutes=Math.floor((totalSeconds % 3600)/60);
    const seconds=totalSeconds%60;

    return {days,hours,minutes,seconds,totalSeconds};
}