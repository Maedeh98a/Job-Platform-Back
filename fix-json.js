const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'db.json');

const rawData = fs.readFileSync(filePath, 'utf8');

let data;
try{
    data = JSON.parse(rawData);
}
catch(error){
    console.error('Failed to parse db.json:', error.message);
    process.exit(1);
}
let jobs = Array.isArray(data) ? data : data.jobs;

if(!Array.isArray(jobs)){
    console.error('jobs" is not an array. Please check your db.json structure.');
    process.exit(1);
}
jobs = jobs.map(job =>{
    if(typeof job.qualifications === "string"){
        try{
            const parsed = JSON.parse(job.qualifications);
            if(Array.isArray(parsed)){
                job.qualifications = parsed;
            }
        }catch(e){
            console.warn(`⚠️ Could not parse qualifications for job ID: ${job.id}`);

        }
    }
    return job;
})
const updatedData = Array.isArray(data) ? jobs : {...data, jobs};
fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
console.log("✅ db.json updated successfully!")