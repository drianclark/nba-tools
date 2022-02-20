import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { GameData } from "../interfaces/GameData";

export default function GamesTable(props: {games: GameData[]}) {
    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
    }

    const shuffleAndStringifyScores = (game: GameData): string => {
        let scores = [game["home_team_score"], game["visitor_team_score"]]
        shuffleArray(scores)

        return scores.join(" - ")
    }

    const removeTimestampFromDate = (datestr: string): string => datestr.split('T')[0]
    
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Game</strong></TableCell>
                        <TableCell><strong>Score</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { props.games.map((game: any) => 
                    <TableRow key={game["home_team"]["abbreviation"] + game["visitor_team"]["abbreviation"] + game["date"]}>
                        <TableCell>{removeTimestampFromDate(game["date"])}</TableCell>
                        <TableCell>{game["home_team"]["full_name"]} vs {game["visitor_team"]["full_name"]}</TableCell>
                        <TableCell>{shuffleAndStringifyScores(game)}</TableCell>
                    </TableRow>) 
                    }
                </TableBody>    
            </Table>
        </TableContainer>
  )
}
