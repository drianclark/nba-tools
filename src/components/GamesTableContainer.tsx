import moment from "@date-io/moment";
import { Moment } from "moment";
import { useEffect, useState } from "react";
import { GameData } from '../interfaces/GameData';
import '../styles/GamesTableContainer.css';
import DateFilter from "./DateFilter";
import GamesTable from './GamesTable';
import TeamsFilter from "./TeamsFilter";
import ThresholdField from './ThresholdField';

export default function GamesTableContainer() {
    const dateAdapter = new moment();
    const lastWeek = dateAdapter.addWeeks(dateAdapter.date(), -1)

    const [games, setGames] = useState<GameData[]>([])
    const [startDate, setStartDate] = useState<Moment>(lastWeek)
    const [threshold, setThreshold] = useState(10)
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

    return (
        <div style={{ display: "flex", flexDirection: "column"}}>
            <div style={{ display: "flex", marginBottom: 10, marginTop: 40}}>
                <DateFilter startDate={startDate} setStartDate={setStartDate}/>
                <ThresholdField threshold={threshold} setThreshold={setThreshold}/>
                { loading &&  <div className="lds-dual-ring"></div> }
            </div>
            <TeamsFilter setTeamsFilter={setTeamsFilter}/>
            <GamesTable games={games}/>
        </div>
    )
}
