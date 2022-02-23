import { useEffect, useState } from "react";
import GamesTable from './GamesTable';
import { GameData } from '../interfaces/GameData';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import TeamsFilter from "./TeamsFilter";
import '../styles/GamesTableContainer.css';
import moment from "@date-io/moment";
import { Moment } from "moment";

export default function GamesTableContainer() {
    const dateAdapter = new moment();
    const today = dateAdapter.date();
    const lastWeek = dateAdapter.addWeeks(dateAdapter.date(), -1)

    const [games, setGames] = useState<GameData[]>([])
    const [startDate, setStartDate] = useState<Moment>(lastWeek)
    const [threshold, setThreshold] = useState(10)
    const [invalidThreshold, setInvalidThreshold] = useState(false)
    const [thresholdHelper, setThresholdHelper] = useState("")
    const [teamsFilter, setTeamsFilter] = useState<string[]>([])
    const [loading, setLoading] = useState<Boolean>(false);


    useEffect(() => {
        const fetchGames = async (startDate: Moment, teamsFilter: string[]) => {
            let startDateCopy = new moment().date(startDate) // copying so we don't mutate actual startDate 

            const params = new URLSearchParams({
                "start_date": startDateCopy.add(-1, "days").format(), // actually fetch from a day before (otherwise would miss games from start date)
                "per_page": "100"
            });

            let res = await fetch("https://www.balldontlie.io/api/v1/games?" + params)
            let json = await res.json();
            let meta = json["meta"];
            let totalPages = meta["total_pages"]

            let allGames = []

            for (let page = 1; page <= totalPages; page++) {
                params.set("page", page.toString())            
            
                console.log(`Processing page ${page} of ${totalPages}...`)
                let res = await fetch("https://www.balldontlie.io/api/v1/games?" + params)
                let json = await res.json()
                let games = json["data"]

                let finishedGames = games.filter((game: any) => game["status"] === "Final")
                let filteredGames = finishedGames

                if (teamsFilter.length > 0) {
                    filteredGames = finishedGames.filter((game: any) => teamsFilter.includes(game["home_team"]["full_name"]) || teamsFilter.includes(game["visitor_team"]["full_name"]))
                }

                allGames.push(...filteredGames);
            }

            return allGames
        }

        const fetchCloseGames = async (startDate: moment.Moment, teamsFilter: string[], threshold: number) => {
            setLoading(true)
            let differenceBetween = (x: string, y: string) => Math.abs(parseInt(x)-parseInt(y))
            let games = await fetchGames(startDate, teamsFilter)
            let filteredGames = games.filter((game) => differenceBetween(game["home_team_score"], game["visitor_team_score"]) <= threshold)
            let sortedGames = filteredGames.sort((g1, g2) => Date.parse(g2["date"]) - Date.parse(g1["date"])) 

            setGames(sortedGames)
            setLoading(false)
        }
        
        fetchCloseGames(startDate, teamsFilter, threshold)
    }, [startDate, teamsFilter, threshold])
    
    const isPositiveInteger = (str: string) => {
        const num = Number(str);

          if (Number.isInteger(num) && num > 0) {
            return true;
          }

          return false;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column"}}>
            <div style={{ display: "flex", marginBottom: 10, marginTop: 40}}>
                <LocalizationProvider dateAdapter={DateAdapter}>
                    <DatePicker
                        label="Start date"
                        value={startDate}
                        onChange={() => {}} // only do something onAccept, sadly onChange is required
                        disableCloseOnSelect={false}
                        onAccept={(newValue) => {
                            if (newValue !== null) {
                                setStartDate(newValue);
                            }
                        }}
                        maxDate={today}
                        renderInput={(params) => <TextField {...params} sx={{width: 180}}/>}
                      />
                </LocalizationProvider>
                <TextField 
                    onKeyDown={(e: any) => { 
                        if (e.key === "Enter") {
                            if (isPositiveInteger(e.target.value)) {
                                setThreshold(e.target.value)
                                setInvalidThreshold(false)
                                setThresholdHelper("")
                            } else {
                                setInvalidThreshold(true)
                                setThresholdHelper("Invalid threshold value, please enter a positive integer")
                            }
                        }
                    }}
                    error={invalidThreshold}
                    helperText={thresholdHelper}
                    variant="outlined" 
                    label="Score threshold"
                    defaultValue={10}
                    sx={{marginLeft: 1, width: 120}}/>
                
                { loading &&  <div className="lds-dual-ring"></div> }

            </div>
            <TeamsFilter setTeamsFilter={setTeamsFilter}/>
            <GamesTable games={games}/>
        </div>
    )
}
