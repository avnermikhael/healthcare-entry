import express from "express";
import mysql from "mysql";
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'carenow'
})

app.get('/', (req, res) => {
    const sql = "SELECT * FROM patients";
    db.query(sql, (err, result) => {
        if(err) return res.json({Message : "Error inside server"});
        return res.json(result)
    })
})

app.post('/patient', (req, res) => {
    const patientId = uuidv4();

    console.log(req.body)

    const sql = "INSERT INTO Patients (`PatientName`, `PatientId`, `DateOfTreatment`, `TreatmentDescription`, `MedicationsPrescribed`, `CostOfTreatment`) VALUES (?)";
    const values = [
        req.body.name,
        patientId,
        req.body.date,
        req.body.treatment,
        req.body.medication,
        req.body.cost
    ]
    db.query(sql, [values], (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    })
})

app.listen(8081, ()=> {
    console.log("Listening...")
})

